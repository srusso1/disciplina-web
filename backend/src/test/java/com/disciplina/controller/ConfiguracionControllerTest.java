package com.disciplina.controller;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.enums.GravedadInstitucional;
import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.model.CatalogoFalta;
import com.disciplina.domain.model.Docente;
import com.disciplina.domain.model.Lugar;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.CatalogoFaltaRepository;
import com.disciplina.domain.repository.DocenteRepository;
import com.disciplina.domain.repository.LugarRepository;
import com.disciplina.domain.repository.UsuarioRepository;
import com.disciplina.dto.configuracion.CatalogoFaltaRequestDTO;
import com.disciplina.dto.configuracion.DocenteRequestDTO;
import com.disciplina.dto.configuracion.LugarRequestDTO;
import com.disciplina.dto.configuracion.UsuarioRequestDTO;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ConfiguracionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CatalogoFaltaRepository catalogoFaltaRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private LugarRepository lugarRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String tokenRector;
    private String tokenOrientador;

    @BeforeEach
    void setUp() {
        Usuario rector = usuarioRepository.findByUsername("rector_config_test").orElseGet(() ->
                usuarioRepository.save(Usuario.builder()
                        .username("rector_config_test")
                        .passwordHash(passwordEncoder.encode("Password123!"))
                        .nombres("Rector")
                        .apellidos("Configuracion")
                        .email("rector.config@disciplina.edu.co")
                        .rol(RolUsuario.ROLE_RECTOR)
                        .activo(true)
                        .build())
        );

        Usuario orientador = usuarioRepository.findByUsername("orientador_config_test").orElseGet(() ->
                usuarioRepository.save(Usuario.builder()
                        .username("orientador_config_test")
                        .passwordHash(passwordEncoder.encode("Password123!"))
                        .nombres("Orientador")
                        .apellidos("Configuracion")
                        .email("orientador.config@disciplina.edu.co")
                        .rol(RolUsuario.ROLE_ORIENTADOR)
                        .activo(true)
                        .build())
        );

        tokenRector = "Bearer " + jwtTokenProvider.generateToken("rector_config_test", "ROLE_RECTOR");
        tokenOrientador = "Bearer " + jwtTokenProvider.generateToken("orientador_config_test", "ROLE_ORIENTADOR");
    }

    @Test
    @DisplayName("ROLE_ORIENTADOR no debe tener acceso a modulo de configuracion (403 Forbidden)")
    void accesoDenegadoAOrientador() throws Exception {
        mockMvc.perform(get("/api/v1/configuracion/catalogo-faltas")
                        .header("Authorization", tokenOrientador))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("ROLE_RECTOR lista catalogo de faltas exitosamente (200 OK)")
    void listarCatalogoFaltasExitoso() throws Exception {
        mockMvc.perform(get("/api/v1/configuracion/catalogo-faltas")
                        .header("Authorization", tokenRector))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contenido").isArray());
    }

    @Test
    @DisplayName("ROLE_RECTOR crea y alterna estado de un lugar (201 Created & 200 OK)")
    void crearYToggleLugar() throws Exception {
        LugarRequestDTO req = LugarRequestDTO.builder()
                .nombre("Laboratorio Test Config " + System.currentTimeMillis())
                .descripcion("Sala de prueba para test de integracion")
                .activo(true)
                .build();

        String response = mockMvc.perform(post("/api/v1/configuracion/lugares")
                        .header("Authorization", tokenRector)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre", is(req.getNombre())))
                .andExpect(jsonPath("$.activo", is(true)))
                .andReturn().getResponse().getContentAsString();

        Integer lugarId = objectMapper.readTree(response).get("id").asInt();

        // Toggle activo
        mockMvc.perform(patch("/api/v1/configuracion/lugares/" + lugarId + "/toggle-activo")
                        .header("Authorization", tokenRector))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activo", is(false)));
    }

    @Test
    @DisplayName("ROLE_RECTOR crea y actualiza un docente (201 Created & 200 OK)")
    void crearYActualizarDocente() throws Exception {
        String docNum = "DOC" + (System.currentTimeMillis() % 1000000);
        DocenteRequestDTO req = DocenteRequestDTO.builder()
                .documento(docNum)
                .nombres("Docente")
                .apellidos("Prueba")
                .areaDesempeno("Ciencias")
                .activo(true)
                .build();

        String response = mockMvc.perform(post("/api/v1/configuracion/docentes")
                        .header("Authorization", tokenRector)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.documento", is(docNum)))
                .andReturn().getResponse().getContentAsString();

        Integer docenteId = objectMapper.readTree(response).get("id").asInt();

        // Actualizar
        req.setNombres("Docente Modificado");
        mockMvc.perform(put("/api/v1/configuracion/docentes/" + docenteId)
                        .header("Authorization", tokenRector)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombres", is("Docente Modificado")));
    }
}
