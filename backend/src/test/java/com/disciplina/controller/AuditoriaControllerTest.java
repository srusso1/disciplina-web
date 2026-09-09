package com.disciplina.controller;

import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.model.AuditoriaSistema;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.AuditoriaSistemaRepository;
import com.disciplina.domain.repository.UsuarioRepository;
import com.disciplina.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuditoriaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuditoriaSistemaRepository auditoriaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private String tokenRector;
    private String tokenOrientador;
    private Usuario rector;
    private String uuidTest;

    @BeforeEach
    void setUp() {
        uuidTest = UUID.randomUUID().toString().substring(0, 8);
        String usernameRector = "rector_audit_" + uuidTest;
        String usernameOrientador = "orientador_audit_" + uuidTest;

        rector = usuarioRepository.save(Usuario.builder()
                .username(usernameRector)
                .passwordHash(passwordEncoder.encode("Rector123*"))
                .nombres("Rector")
                .apellidos("Auditor")
                .email(usernameRector + "@disciplina.edu.co")
                .rol(RolUsuario.ROLE_RECTOR)
                .activo(true)
                .build());

        usuarioRepository.save(Usuario.builder()
                .username(usernameOrientador)
                .passwordHash(passwordEncoder.encode("Orientador123*"))
                .nombres("Orientador")
                .apellidos("Usuario")
                .email(usernameOrientador + "@disciplina.edu.co")
                .rol(RolUsuario.ROLE_ORIENTADOR)
                .activo(true)
                .build());

        tokenRector = jwtTokenProvider.generateToken(usernameRector, "ROLE_RECTOR");
        tokenOrientador = jwtTokenProvider.generateToken(usernameOrientador, "ROLE_ORIENTADOR");

        // Insertar traza de auditoria para pruebas
        auditoriaRepository.save(AuditoriaSistema.builder()
                .usuario(rector)
                .accion("CREAR")
                .entidad("IncidenteTest")
                .entidadId("999" + uuidTest)
                .datosAnteriores(null)
                .datosNuevos("{\"estado\":\"REPORTADO\"}")
                .ipOrigen("127.0.0.1")
                .build());
    }

    @Test
    @DisplayName("Debe permitir al Rector consultar la bitácora de auditoría paginada con éxito (200 OK)")
    void listarAuditorias_comoRector_retorna200Ok() throws Exception {
        mockMvc.perform(get("/api/v1/auditoria")
                        .header("Authorization", "Bearer " + tokenRector)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contenido", notNullValue()))
                .andExpect(jsonPath("$.totalElementos", greaterThanOrEqualTo(1)));
    }

    @Test
    @DisplayName("Debe denegar con 403 Forbidden cuando un Orientador intenta acceder a la bitácora de auditoría")
    void listarAuditorias_comoOrientador_retorna403Forbidden() throws Exception {
        mockMvc.perform(get("/api/v1/auditoria")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Debe retornar la cadena de custodia forense por entidad específica (200 OK)")
    void obtenerHistorialPorEntidad_comoRector_retornaRegistros() throws Exception {
        mockMvc.perform(get("/api/v1/auditoria/entidad/IncidenteTest/999" + uuidTest)
                        .header("Authorization", "Bearer " + tokenRector)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].entidad", is("IncidenteTest")))
                .andExpect(jsonPath("$[0].accion", is("CREAR")))
                .andExpect(jsonPath("$[0].usuarioUsername", is(rector.getUsername())));
    }
}
