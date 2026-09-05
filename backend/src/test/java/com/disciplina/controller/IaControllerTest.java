package com.disciplina.controller;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.model.*;
import com.disciplina.domain.repository.*;
import com.disciplina.dto.ia.GenerarPropuestaIntervencionDTO;
import com.disciplina.dto.ia.ProcesarNarrativaRequestDTO;
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

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class IaControllerTest {

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

    @Autowired
    private MatriculaEstudianteRepository matriculaEstudianteRepository;

    @Autowired
    private LugarRepository lugarRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private CatalogoFaltaRepository catalogoFaltaRepository;

    private String tokenRector;
    private Estudiante estudiantePrueba;
    private Lugar lugarPrueba;
    private Docente docentePrueba;

    @BeforeEach
    void setUp() {
        Usuario rector = usuarioRepository.findByUsername("rector_ia_test").orElseGet(() ->
                usuarioRepository.save(Usuario.builder()
                        .username("rector_ia_test")
                        .passwordHash(passwordEncoder.encode("Password123!"))
                        .nombres("Rector")
                        .apellidos("IA Test")
                        .email("rector.ia@disciplina.edu.co")
                        .rol(RolUsuario.ROLE_RECTOR)
                        .activo(true)
                        .build())
        );
        tokenRector = jwtTokenProvider.generateToken("rector_ia_test", "ROLE_RECTOR");

        lugarPrueba = lugarRepository.findAll().stream().findFirst().orElseGet(() ->
                lugarRepository.save(Lugar.builder()
                        .nombre("Patio Principal")
                        .activo(true)
                        .build())
        );

        docentePrueba = docenteRepository.findAll().stream().findFirst().orElseGet(() ->
                docenteRepository.save(Docente.builder()
                        .documento("DOC-IA-01")
                        .nombres("Carlos")
                        .apellidos("Pérez")
                        .areaDesempeno("Ciencias Sociales")
                        .activo(true)
                        .build())
        );

        estudiantePrueba = estudianteRepository.findAll().stream().findFirst().orElseGet(() -> {
            Estudiante e = estudianteRepository.save(Estudiante.builder()
                    .documento("9988776655")
                    .nombres("Mateo")
                    .apellidos("Gómez Restrepo")
                    .activo(true)
                    .build());

            matriculaEstudianteRepository.save(MatriculaEstudiante.builder()
                    .estudiante(e)
                    .anioLectivo(LocalDate.now().getYear())
                    .grado("9")
                    .grupo("A")
                    .build());
            return e;
        });
    }

    @Test
    @DisplayName("POST /api/v1/ia/procesar-narrativa con éxito retorna estructura del incidente")
    void procesarNarrativa_debeRetornar200_conNarrativaEstructurada() throws Exception {
        ProcesarNarrativaRequestDTO request = ProcesarNarrativaRequestDTO.builder()
                .relato("Durante el recreo en el Patio Principal, el profesor Carlos Pérez observó que el estudiante Mateo Gómez agredió verbalmente a un compañero luego de un desacuerdo.")
                .anioLectivo(LocalDate.now().getYear())
                .build();

        mockMvc.perform(post("/api/v1/ia/procesar-narrativa")
                        .header("Authorization", "Bearer " + tokenRector)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hechosEstandarizados", notNullValue()))
                .andExpect(jsonPath("$.clasificacionLeySugerida", notNullValue()))
                .andExpect(jsonPath("$.mensajeAsistente", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/v1/ia/procesar-narrativa clasifica agresión física simple sin armas como TIPO_II")
    void procesarNarrativa_agresionFisicaSimple_debeClasificarTipoII() throws Exception {
        ProcesarNarrativaRequestDTO request = ProcesarNarrativaRequestDTO.builder()
                .relato("El estudiante Juan Acero le pego a su compañero stiven delgado en el patio central de la institución, el docente andres gomez reporto la situación.")
                .anioLectivo(LocalDate.now().getYear())
                .build();

        mockMvc.perform(post("/api/v1/ia/procesar-narrativa")
                        .header("Authorization", "Bearer " + tokenRector)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clasificacionLeySugerida", is("TIPO_II")))
                .andExpect(jsonPath("$.estudiantes[?(@.rolSugerido == 'VICTIMA')].catalogoFaltaId", everyItem(nullValue())));
    }

    @Test
    @DisplayName("POST /api/v1/ia/procesar-narrativa con relato en blanco debe retornar 400")
    void procesarNarrativa_conRelatoVacio_debeRetornar400() throws Exception {
        ProcesarNarrativaRequestDTO request = ProcesarNarrativaRequestDTO.builder()
                .relato("   ")
                .build();

        mockMvc.perform(post("/api/v1/ia/procesar-narrativa")
                        .header("Authorization", "Bearer " + tokenRector)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/v1/ia/generar-intervencion con estudiante existente debe retornar propuesta formativa")
    void generarPropuestaIntervencion_conEstudianteValido_debeRetornar200() throws Exception {
        GenerarPropuestaIntervencionDTO request = GenerarPropuestaIntervencionDTO.builder()
                .estudianteId(estudiantePrueba.getId())
                .build();

        mockMvc.perform(post("/api/v1/ia/generar-intervencion")
                        .header("Authorization", "Bearer " + tokenRector)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estudianteId", is(estudiantePrueba.getId())))
                .andExpect(jsonPath("$.diagnosticoSituacional", notNullValue()))
                .andExpect(jsonPath("$.recomendacionesIa", notNullValue()))
                .andExpect(jsonPath("$.accionesAcordadasSugeridas", notNullValue()))
                .andExpect(jsonPath("$.advertenciaGobierno", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/v1/ia/generar-intervencion con estudiante inexistente debe retornar 404")
    void generarPropuestaIntervencion_conEstudianteInexistente_debeRetornar404() throws Exception {
        GenerarPropuestaIntervencionDTO request = GenerarPropuestaIntervencionDTO.builder()
                .estudianteId(999999)
                .build();

        mockMvc.perform(post("/api/v1/ia/generar-intervencion")
                        .header("Authorization", "Bearer " + tokenRector)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/v1/ia/procesar-narrativa sin token debe retornar 401 Unauthorized")
    void procesarNarrativa_sinAutenticacion_debeRetornar401() throws Exception {
        ProcesarNarrativaRequestDTO request = ProcesarNarrativaRequestDTO.builder()
                .relato("Relato de prueba sin token de autenticación institucional.")
                .build();

        mockMvc.perform(post("/api/v1/ia/procesar-narrativa")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
}
