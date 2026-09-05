package com.disciplina.controller;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.enums.EstadoProceso;
import com.disciplina.domain.enums.GravedadInstitucional;
import com.disciplina.domain.enums.RolEstudianteIncidente;
import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.model.*;
import com.disciplina.domain.repository.*;
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

import java.time.LocalDate;
import java.time.LocalTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class RectoriaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private LugarRepository lugarRepository;

    @Autowired
    private CatalogoFaltaRepository catalogoFaltaRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private IncidenteRepository incidenteRepository;

    private String tokenRector;
    private String tokenOrientador;

    @BeforeEach
    void setUp() {
        if (usuarioRepository.findByUsername("rector_dash_test").isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .username("rector_dash_test")
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .nombres("Rector")
                    .apellidos("Dashboard")
                    .email("rector.dash@disciplina.edu.co")
                    .rol(RolUsuario.ROLE_RECTOR)
                    .activo(true)
                    .build());
        }

        if (usuarioRepository.findByUsername("orientador_dash_test").isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .username("orientador_dash_test")
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .nombres("Orientador")
                    .apellidos("Dashboard")
                    .email("orientador.dash@disciplina.edu.co")
                    .rol(RolUsuario.ROLE_ORIENTADOR)
                    .activo(true)
                    .build());
        }

        tokenRector = jwtTokenProvider.generateToken("rector_dash_test", "ROLE_RECTOR");
        tokenOrientador = jwtTokenProvider.generateToken("orientador_dash_test", "ROLE_ORIENTADOR");
    }

    @Test
    @DisplayName("Debe permitir al Rector consultar las métricas analíticas del dashboard con éxito (200)")
    void obtenerMetricasDashboard_comoRector_retornaOk() throws Exception {
        mockMvc.perform(get("/api/v1/rectoria/metricas-dashboard")
                        .header("Authorization", "Bearer " + tokenRector)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalIncidentes", notNullValue()))
                .andExpect(jsonPath("$.distribucionEstados", notNullValue()))
                .andExpect(jsonPath("$.focosCriticosLugares", notNullValue()))
                .andExpect(jsonPath("$.distribucionPorGrado", notNullValue()))
                .andExpect(jsonPath("$.franjasHorariasCriticas", notNullValue()))
                .andExpect(jsonPath("$.tendenciaMensual", notNullValue()));
    }

    @Test
    @DisplayName("Debe rechazar con 403 Forbidden cuando un Orientador intenta acceder al dashboard de Rectoría")
    void obtenerMetricasDashboard_comoOrientador_retornaForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/rectoria/metricas-dashboard")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Debe rechazar con 401 Unauthorized cuando la petición no incluye token de autenticación")
    void obtenerMetricasDashboard_sinToken_retornaUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/rectoria/metricas-dashboard")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
