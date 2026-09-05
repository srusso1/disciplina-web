package com.disciplina.controller;

import com.disciplina.domain.enums.EstadoPlanIntervencion;
import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.model.Estudiante;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.EstudianteRepository;
import com.disciplina.domain.repository.UsuarioRepository;
import com.disciplina.dto.plan.CrearPlanIntervencionDTO;
import com.disciplina.dto.plan.RegistrarSeguimientoDTO;
import com.disciplina.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PlanIntervencionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private EstudianteRepository estudianteRepository;

    private String tokenOrientador;
    private Estudiante estudiantePrueba;

    @BeforeEach
    void setUp() {
        Usuario orientador = usuarioRepository.findByUsername("orientador_plan_test").orElseGet(() ->
                usuarioRepository.save(Usuario.builder()
                        .username("orientador_plan_test")
                        .passwordHash(passwordEncoder.encode("Password123!"))
                        .nombres("Orientador")
                        .apellidos("Planes")
                        .email("orientador.plan@disciplina.edu.co")
                        .rol(RolUsuario.ROLE_ORIENTADOR)
                        .activo(true)
                        .build()));

        tokenOrientador = jwtTokenProvider.generateToken("orientador_plan_test", "ROLE_ORIENTADOR");

        estudiantePrueba = estudianteRepository.findAll().stream().findFirst().orElseGet(() ->
                estudianteRepository.save(Estudiante.builder()
                        .documento("EST_PLAN_" + System.nanoTime())
                        .nombres("Mateo")
                        .apellidos("Gómez")
                        .nombreAcudiente("Gloria Gómez")
                        .telefonoAcudiente("3159876543")
                        .activo(true)
                        .build()));
    }

    @Test
    @DisplayName("RF-06: Debe crear un plan de intervención pedagógica exitosamente (201 CREATED)")
    void crearPlanIntervencion_exitoso() throws Exception {
        CrearPlanIntervencionDTO dto = CrearPlanIntervencionDTO.builder()
                .estudianteId(estudiantePrueba.getId())
                .diagnosticoSituacional("Dificultad recurrente en la regulación de impulsos ante frustración académica.")
                .recomendacionesIa("Estrategias de autorregulación emocional y pausas activas.")
                .accionesAcordadas("Asistencia semanal a taller de mediación y acuerdos restaurativos.")
                .compromisoPadres("Supervisión diaria de agenda escolar y diálogo en casa.")
                .fechaProximoSeguimiento(LocalDate.now().plusDays(15))
                .estado(EstadoPlanIntervencion.EN_SEGUIMIENTO)
                .build();

        mockMvc.perform(post("/api/v1/planes-intervencion")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.estudianteId", is(estudiantePrueba.getId())))
                .andExpect(jsonPath("$.estado", is("EN_SEGUIMIENTO")))
                .andExpect(jsonPath("$.accionesAcordadas", containsString("taller de mediación")));
    }

    @Test
    @DisplayName("CU-07: Debe registrar una nota de seguimiento y actualizar el estado del plan")
    void registrarSeguimiento_exitoso() throws Exception {
        // 1. Crear plan primero
        CrearPlanIntervencionDTO crearDto = CrearPlanIntervencionDTO.builder()
                .estudianteId(estudiantePrueba.getId())
                .diagnosticoSituacional("Diagnóstico inicial para seguimiento")
                .accionesAcordadas("Acciones iniciales")
                .estado(EstadoPlanIntervencion.EN_SEGUIMIENTO)
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/v1/planes-intervencion")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(crearDto)))
                .andExpect(status().isCreated())
                .andReturn();

        Integer planId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asInt();

        // 2. Registrar nota de seguimiento (CU-07)
        RegistrarSeguimientoDTO segDto = RegistrarSeguimientoDTO.builder()
                .observacion("El estudiante asistió puntualmente a las sesiones y presentó avances notables.")
                .nuevoEstadoPlan(EstadoPlanIntervencion.CUMPLIDO)
                .build();

        mockMvc.perform(post("/api/v1/planes-intervencion/" + planId + "/seguimientos")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(segDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(planId)))
                .andExpect(jsonPath("$.estado", is("CUMPLIDO")))
                .andExpect(jsonPath("$.seguimientos", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.seguimientos[0].observacion", containsString("avances notables")));
    }

    @Test
    @DisplayName("Debe listar los planes de intervención vinculados a un estudiante")
    void listarPorEstudiante_retornaLista() throws Exception {
        mockMvc.perform(get("/api/v1/planes-intervencion/estudiante/" + estudiantePrueba.getId())
                        .header("Authorization", "Bearer " + tokenOrientador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)));
    }

    @Test
    @DisplayName("Debe rechazar con 401 Unauthorized sin credenciales Bearer")
    void crearPlan_sinToken_retornaUnauthorized() throws Exception {
        CrearPlanIntervencionDTO dto = CrearPlanIntervencionDTO.builder()
                .estudianteId(estudiantePrueba.getId())
                .diagnosticoSituacional("Sin auth")
                .accionesAcordadas("Accion")
                .build();

        mockMvc.perform(post("/api/v1/planes-intervencion")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnauthorized());
    }
}
