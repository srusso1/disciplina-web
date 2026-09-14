package com.disciplina.service;

import com.disciplina.common.exception.OperacionInvalidaException;
import com.disciplina.common.exception.RecursoNoEncontradoException;
import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.enums.SeveridadNotificacion;
import com.disciplina.domain.enums.TipoNotificacion;
import com.disciplina.domain.model.Notificacion;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.NotificacionRepository;
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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificacionServiceTest {

    @Mock
    private NotificacionRepository notificacionRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private NotificacionService notificacionService;

    private Usuario usuario;
    private Notificacion notificacion;

    @BeforeEach
    void setUp() {
        usuario = Usuario.builder()
                .id(1)
                .username("rector")
                .rol(RolUsuario.ROLE_RECTOR)
                .activo(true)
                .build();

        notificacion = Notificacion.builder()
                .id(100L)
                .usuario(usuario)
                .titulo("Alerta de Prueba")
                .mensaje("Mensaje de prueba")
                .tipo(TipoNotificacion.CRITICA)
                .severidad(SeveridadNotificacion.CRITICA)
                .rutaEnlace("/rectoria/faltas-graves")
                .leida(false)
                .createdAt(Instant.now())
                .build();
    }

    @Test
    @DisplayName("Debe crear una notificacion exitosamente para un usuario valido")
    void crearNotificacion_exito() {
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
        when(notificacionRepository.save(any(Notificacion.class))).thenAnswer(invocation -> {
            Notificacion n = invocation.getArgument(0);
            n.setId(100L);
            return n;
        });

        NotificacionResponseDTO res = notificacionService.crearNotificacion(
                1,
                "Alerta",
                "Mensaje",
                TipoNotificacion.CRITICA,
                SeveridadNotificacion.CRITICA,
                "/ruta"
        );

        assertThat(res).isNotNull();
        assertThat(res.getId()).isEqualTo(100L);
        assertThat(res.getTitulo()).isEqualTo("Alerta");
        verify(notificacionRepository, times(1)).save(any(Notificacion.class));
    }

    @Test
    @DisplayName("Debe lanzar excepcion al crear notificacion para usuario inexistente")
    void crearNotificacion_usuarioNoEncontrado() {
        when(usuarioRepository.findById(999)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> notificacionService.crearNotificacion(
                999, "Titulo", "Mensaje", TipoNotificacion.INFORMATIVA, SeveridadNotificacion.MEDIA, null
        )).isInstanceOf(RecursoNoEncontradoException.class);
    }

    @Test
    @DisplayName("Debe enviar notificaciones a todos los usuarios activos de un rol")
    void notificarPorRol_exito() {
        Usuario rector2 = Usuario.builder().id(2).username("rector2").rol(RolUsuario.ROLE_RECTOR).activo(true).build();
        when(usuarioRepository.findByRolAndActivoTrue(RolUsuario.ROLE_RECTOR)).thenReturn(List.of(usuario, rector2));
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.findById(2)).thenReturn(Optional.of(rector2));
        when(notificacionRepository.save(any(Notificacion.class))).thenReturn(notificacion);

        notificacionService.notificarPorRol(
                RolUsuario.ROLE_RECTOR,
                "Alerta Masiva",
                "Mensaje para directivos",
                TipoNotificacion.TERMINO_LEGAL,
                SeveridadNotificacion.ALTA,
                "/rectoria/incidentes"
        );

        verify(notificacionRepository, times(2)).save(any(Notificacion.class));
    }

    @Test
    @DisplayName("Debe marcar notificacion como leida si pertenece al usuario solicitante")
    void marcarComoLeida_exito() {
        when(notificacionRepository.findById(100L)).thenReturn(Optional.of(notificacion));
        when(notificacionRepository.save(any(Notificacion.class))).thenAnswer(i -> i.getArgument(0));

        NotificacionResponseDTO res = notificacionService.marcarComoLeida(100L, 1);

        assertThat(res.isLeida()).isTrue();
        verify(notificacionRepository).save(notificacion);
    }

    @Test
    @DisplayName("Debe lanzar OperacionInvalidaException si la notificacion pertenece a otro usuario")
    void marcarComoLeida_usuarioInvalido() {
        when(notificacionRepository.findById(100L)).thenReturn(Optional.of(notificacion));

        assertThatThrownBy(() -> notificacionService.marcarComoLeida(100L, 99))
                .isInstanceOf(OperacionInvalidaException.class);
    }

    @Test
    @DisplayName("Debe marcar todas las notificaciones como leidas")
    void marcarTodasComoLeidas_exito() {
        notificacionService.marcarTodasComoLeidas(1);
        verify(notificacionRepository, times(1)).marcarTodasComoLeidas(1);
    }

    @Test
    @DisplayName("Debe obtener las ultimas notificaciones paginadas")
    void obtenerUltimas_exito() {
        when(notificacionRepository.findByUsuarioIdOrderByCreatedAtDesc(eq(1), any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of(notificacion)));

        List<NotificacionResponseDTO> lista = notificacionService.obtenerUltimas(1, 10);

        assertThat(lista).hasSize(1);
        assertThat(lista.get(0).getId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("Debe contar correctamente las notificaciones no leidas")
    void contarNoLeidas_exito() {
        when(notificacionRepository.countByUsuarioIdAndLeidaFalse(1)).thenReturn(5L);

        long conteo = notificacionService.contarNoLeidas(1);

        assertThat(conteo).isEqualTo(5L);
    }
}
