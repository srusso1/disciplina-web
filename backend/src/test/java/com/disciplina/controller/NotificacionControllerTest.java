package com.disciplina.controller;

import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.enums.SeveridadNotificacion;
import com.disciplina.domain.enums.TipoNotificacion;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.UsuarioRepository;
import com.disciplina.dto.notificacion.NotificacionResponseDTO;
import com.disciplina.service.notificacion.NotificacionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.security.Principal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class NotificacionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private NotificacionService notificacionService;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private NotificacionController notificacionController;

    private Usuario usuario;
    private Principal principal;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(notificacionController).build();

        usuario = Usuario.builder()
                .id(1)
                .username("rector")
                .rol(RolUsuario.ROLE_RECTOR)
                .activo(true)
                .build();

        principal = new UsernamePasswordAuthenticationToken(
                "rector",
                "credentials",
                List.of(new SimpleGrantedAuthority("ROLE_RECTOR"))
        );
    }

    @Test
    @DisplayName("GET /api/v1/notificaciones - Debe retornar ultimas notificaciones")
    void obtenerUltimas_debeRetornarLista() throws Exception {
        when(usuarioRepository.findByUsernameIgnoreCase("rector")).thenReturn(Optional.of(usuario));
        when(notificacionService.obtenerUltimas(eq(1), anyInt())).thenReturn(List.of(
                NotificacionResponseDTO.builder()
                        .id(10L)
                        .titulo("Alerta")
                        .mensaje("Mensaje")
                        .tipo(TipoNotificacion.CRITICA)
                        .severidad(SeveridadNotificacion.CRITICA)
                        .leida(false)
                        .createdAt(Instant.now())
                        .build()
        ));

        mockMvc.perform(get("/api/v1/notificaciones")
                        .principal(principal)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10))
                .andExpect(jsonPath("$[0].titulo").value("Alerta"));
    }

    @Test
    @DisplayName("GET /api/v1/notificaciones/conteo-no-leidas - Debe retornar conteo")
    void obtenerConteoNoLeidas_debeRetornarConteo() throws Exception {
        when(usuarioRepository.findByUsernameIgnoreCase("rector")).thenReturn(Optional.of(usuario));
        when(notificacionService.contarNoLeidas(1)).thenReturn(4L);

        mockMvc.perform(get("/api/v1/notificaciones/conteo-no-leidas")
                        .principal(principal)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.noLeidas").value(4));
    }

    @Test
    @DisplayName("PATCH /api/v1/notificaciones/{id}/leer - Debe marcar notificacion como leida")
    void marcarComoLeida_debeRetornarNotificacion() throws Exception {
        when(usuarioRepository.findByUsernameIgnoreCase("rector")).thenReturn(Optional.of(usuario));
        when(notificacionService.marcarComoLeida(10L, 1)).thenReturn(
                NotificacionResponseDTO.builder()
                        .id(10L)
                        .leida(true)
                        .build()
        );

        mockMvc.perform(patch("/api/v1/notificaciones/10/leer")
                        .principal(principal)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.leida").value(true));
    }

    @Test
    @DisplayName("PATCH /api/v1/notificaciones/marcar-todas-leidas - Debe retornar 204 No Content")
    void marcarTodasComoLeidas_debeRetornarNoContent() throws Exception {
        when(usuarioRepository.findByUsernameIgnoreCase("rector")).thenReturn(Optional.of(usuario));

        mockMvc.perform(patch("/api/v1/notificaciones/marcar-todas-leidas")
                        .principal(principal))
                .andExpect(status().isNoContent());

        verify(notificacionService).marcarTodasComoLeidas(1);
    }
}
