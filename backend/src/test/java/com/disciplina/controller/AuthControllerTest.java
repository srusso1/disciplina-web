package com.disciplina.controller;

import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.UsuarioRepository;
import com.disciplina.dto.auth.LoginRequest;
import com.disciplina.security.JwtTokenProvider;
import com.disciplina.security.LoginRateLimiterService;
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

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

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
    private LoginRateLimiterService loginRateLimiterService;

    @BeforeEach
    void setUp() {
        loginRateLimiterService.resetParaPruebas();
        if (usuarioRepository.findByUsername("test_rector").isEmpty()) {
            Usuario rector = Usuario.builder()
                    .username("test_rector")
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .nombres("Test")
                    .apellidos("Rector")
                    .email("test.rector@disciplina.edu.co")
                    .rol(RolUsuario.ROLE_RECTOR)
                    .activo(true)
                    .build();
            usuarioRepository.save(rector);
        }

        if (usuarioRepository.findByUsername("test_orientador").isEmpty()) {
            Usuario orientador = Usuario.builder()
                    .username("test_orientador")
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .nombres("Test")
                    .apellidos("Orientador")
                    .email("test.orientador@disciplina.edu.co")
                    .rol(RolUsuario.ROLE_ORIENTADOR)
                    .activo(true)
                    .build();
            usuarioRepository.save(orientador);
        }
    }

    @Test
    @DisplayName("Debe autenticar exitosamente y retornar token JWT para credenciales validas")
    void testLoginExitoso() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .username("test_rector")
                .password("Password123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.type", is("Bearer")))
                .andExpect(jsonPath("$.username", is("test_rector")))
                .andExpect(jsonPath("$.rol", is("ROLE_RECTOR")))
                .andExpect(jsonPath("$.expiresIn", notNullValue()));
    }

    @Test
    @DisplayName("Debe soportar inicio de sesion insensible a mayusculas/minusculas")
    void testLoginCaseInsensitive() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .username("TEST_RECTOR")
                .password("Password123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("test_rector")));
    }

    @Test
    @DisplayName("Debe fallar con 401 si la contrasena es incorrecta")
    void testLoginPasswordIncorrecto() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .username("test_rector")
                .password("WrongPassword999!")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)))
                .andExpect(jsonPath("$.message", containsString("Credenciales invalidas")));
    }

    @Test
    @DisplayName("Debe fallar con 401 si el usuario no existe")
    void testLoginUsuarioInexistente() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .username("usuario_fantasma")
                .password("Password123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }

    @Test
    @DisplayName("Debe retornar 400 Bad Request si los campos vienen en blanco")
    void testLoginCamposEnBlanco() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .username("")
                .password("")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.fieldErrors.username", notNullValue()))
                .andExpect(jsonPath("$.fieldErrors.password", notNullValue()));
    }

    @Test
    @DisplayName("Rutas protegidas sin token deben retornar 401 con AuthenticationEntryPoint personalizado")
    void testRutaProtegidaSinToken() throws Exception {
        mockMvc.perform(get("/api/v1/incidentes"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)))
                .andExpect(jsonPath("$.error", is("Unauthorized")))
                .andExpect(jsonPath("$.message", containsString("Acceso no autenticado")));
    }

    @Test
    @DisplayName("Ruta exclusiva de Rectoria debe rechazar a Orientador con 403 y AccessDeniedHandler")
    void testAccesoDenegadoPorRol() throws Exception {
        String tokenOrientador = jwtTokenProvider.generateToken("test_orientador", "ROLE_ORIENTADOR");

        mockMvc.perform(get("/api/v1/rectoria/metricas-dashboard")
                        .header("Authorization", "Bearer " + tokenOrientador))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is(403)))
                .andExpect(jsonPath("$.error", is("Forbidden")))
                .andExpect(jsonPath("$.message", containsString("Acceso denegado")));
    }

    @Test
    @DisplayName("Debe bloquear con 429 Too Many Requests tras 5 intentos fallidos consecutivos")
    void testRateLimitingLogin() throws Exception {
        LoginRequest fallido = LoginRequest.builder()
                .username("usuario_bruteforce")
                .password("ClaveErrada123!")
                .build();

        // 5 intentos fallidos consecutivos (401 Unauthorized)
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(fallido)))
                    .andExpect(status().isUnauthorized());
        }

        // El 6to intento debe ser bloqueado con 429 Too Many Requests
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(fallido)))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().exists("Retry-After"))
                .andExpect(jsonPath("$.status", is(429)))
                .andExpect(jsonPath("$.message", containsString("Demasiados intentos fallidos")));
    }
}
