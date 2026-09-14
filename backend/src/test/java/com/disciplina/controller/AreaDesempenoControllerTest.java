package com.disciplina.controller;

import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.model.AreaDesempeno;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.AreaDesempenoRepository;
import com.disciplina.domain.repository.UsuarioRepository;
import com.disciplina.dto.configuracion.AreaDesempenoRequestDTO;
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
class AreaDesempenoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AreaDesempenoRepository areaDesempenoRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String tokenRector;
    private String tokenOrientador;

    @BeforeEach
    void setUp() {
        Usuario rector = usuarioRepository.findByUsername("rector_area_test").orElseGet(() ->
                usuarioRepository.save(Usuario.builder()
                        .username("rector_area_test")
                        .passwordHash(passwordEncoder.encode("Password123!"))
                        .nombres("Rector")
                        .apellidos("Area")
                        .email("rector.area@disciplina.edu.co")
                        .rol(RolUsuario.ROLE_RECTOR)
                        .activo(true)
                        .build()));

        Usuario orientador = usuarioRepository.findByUsername("orientador_area_test").orElseGet(() ->
                usuarioRepository.save(Usuario.builder()
                        .username("orientador_area_test")
                        .passwordHash(passwordEncoder.encode("Password123!"))
                        .nombres("Orientador")
                        .apellidos("Area")
                        .email("orientador.area@disciplina.edu.co")
                        .rol(RolUsuario.ROLE_ORIENTADOR)
                        .activo(true)
                        .build()));

        tokenRector = "Bearer " + jwtTokenProvider.generateToken(rector.getUsername(), rector.getRol().name());
        tokenOrientador = "Bearer " + jwtTokenProvider.generateToken(orientador.getUsername(), orientador.getRol().name());
    }

    @Test
    @DisplayName("ROLE_RECTOR y ROLE_ORIENTADOR pueden listar áreas activas")
    void listarActivasPermitido() throws Exception {
        mockMvc.perform(get("/api/v1/areas-desempeno/activas")
                        .header("Authorization", tokenOrientador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)));
    }

    @Test
    @DisplayName("ROLE_RECTOR crea y actualiza un área de desempeño (201 Created & 200 OK)")
    void crearYActualizarArea() throws Exception {
        String nombreUnico = "Área Test " + System.currentTimeMillis();
        AreaDesempenoRequestDTO req = AreaDesempenoRequestDTO.builder()
                .nombre(nombreUnico)
                .descripcion("Descripción de prueba")
                .activo(true)
                .build();

        String response = mockMvc.perform(post("/api/v1/areas-desempeno")
                        .header("Authorization", tokenRector)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre", is(nombreUnico)))
                .andReturn().getResponse().getContentAsString();

        Integer areaId = objectMapper.readTree(response).get("id").asInt();

        // Actualizar
        req.setDescripcion("Descripción actualizada");
        mockMvc.perform(put("/api/v1/areas-desempeno/" + areaId)
                        .header("Authorization", tokenRector)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.descripcion", is("Descripción actualizada")));

        // Toggle activo
        mockMvc.perform(patch("/api/v1/areas-desempeno/" + areaId + "/toggle-activo")
                        .header("Authorization", tokenRector))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activo", is(false)));
    }

    @Test
    @DisplayName("ROLE_ORIENTADOR no puede crear áreas de desempeño (403 Forbidden)")
    void orientadorNoPuedeCrearArea() throws Exception {
        AreaDesempenoRequestDTO req = AreaDesempenoRequestDTO.builder()
                .nombre("Robótica")
                .descripcion("Intento de orientador")
                .activo(true)
                .build();

        mockMvc.perform(post("/api/v1/areas-desempeno")
                        .header("Authorization", tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }
}
