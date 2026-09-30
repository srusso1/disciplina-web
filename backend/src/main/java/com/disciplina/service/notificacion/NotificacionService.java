package com.disciplina.service.notificacion;

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
import com.disciplina.dto.common.PaginaRespuestaDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public NotificacionResponseDTO crearNotificacion(
            Integer usuarioId,
            String titulo,
            String mensaje,
            TipoNotificacion tipo,
            SeveridadNotificacion severidad,
            String rutaEnlace) {
        return crearNotificacion(usuarioId, titulo, mensaje, tipo, severidad, rutaEnlace, null, null, null);
    }

    @Transactional
    public NotificacionResponseDTO crearNotificacion(Integer usuarioId, String titulo, String mensaje,
            TipoNotificacion tipo, SeveridadNotificacion severidad, String rutaEnlace,
            String recursoTipo, String recursoId, String eventoClave) {

        if (eventoClave != null) {
            var existente = notificacionRepository.findByUsuarioIdAndEventoClave(usuarioId, eventoClave);
            if (existente.isPresent()) {
                return mapearADTO(existente.get());
            }
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con ID: " + usuarioId));

        Notificacion notificacion = Notificacion.builder()
                .usuario(usuario)
                .titulo(titulo != null ? titulo.trim() : "")
                .mensaje(mensaje != null ? mensaje.trim() : "")
                .tipo(tipo)
                .severidad(severidad != null ? severidad : SeveridadNotificacion.MEDIA)
                .rutaEnlace(rutaEnlace)
                .recursoTipo(recursoTipo)
                .recursoId(recursoId)
                .eventoClave(eventoClave)
                .leida(false)
                .build();

        Notificacion guardada = notificacionRepository.save(notificacion);
        log.debug("Notificacion creada con ID: {} para usuario: {}", guardada.getId(), usuario.getUsername());
        return mapearADTO(guardada);
    }

    @Transactional
    public void notificarPorRol(
            RolUsuario rol,
            String titulo,
            String mensaje,
            TipoNotificacion tipo,
            SeveridadNotificacion severidad,
            String rutaEnlace) {
        notificarPorRol(rol, titulo, mensaje, tipo, severidad, rutaEnlace, null, null, null);
    }

    @Transactional
    public void notificarPorRol(RolUsuario rol, String titulo, String mensaje,
            TipoNotificacion tipo, SeveridadNotificacion severidad, String rutaEnlace,
            String recursoTipo, String recursoId, String eventoClave) {

        List<Usuario> usuarios = usuarioRepository.findByRolAndActivoTrue(rol);
        if (usuarios.isEmpty()) {
            return;
        }

        List<Notificacion> notificaciones = usuarios.stream()
                .filter(u -> eventoClave == null || !notificacionRepository.existsByUsuarioIdAndEventoClave(u.getId(), eventoClave))
                .map(u -> Notificacion.builder()
                        .usuario(u)
                        .titulo(titulo != null ? titulo.trim() : "")
                        .mensaje(mensaje != null ? mensaje.trim() : "")
                        .tipo(tipo)
                        .severidad(severidad != null ? severidad : SeveridadNotificacion.MEDIA)
                        .rutaEnlace(rutaEnlace)
                        .recursoTipo(recursoTipo)
                        .recursoId(recursoId)
                        .eventoClave(eventoClave)
                        .leida(false)
                        .build())
                .toList();

        if (!notificaciones.isEmpty()) {
            notificacionRepository.saveAll(notificaciones);
        }
        log.info("Notificacion masiva enviada a {} usuarios con rol: {}", notificaciones.size(), rol);
    }

    public PaginaRespuestaDTO<NotificacionResponseDTO> obtenerHistorial(Integer usuarioId, TipoNotificacion tipo,
            Boolean leida, LocalDate desde, LocalDate hasta, int pagina, int tamano) {
        if (desde != null && hasta != null && desde.isAfter(hasta)) {
            throw new OperacionInvalidaException("La fecha inicial no puede ser posterior a la final.");
        }
        ZoneId zona = ZoneId.of("America/Bogota");
        Instant inicio = desde == null ? null : desde.atStartOfDay(zona).toInstant();
        Instant finExclusivo = hasta == null ? null : hasta.plusDays(1).atStartOfDay(zona).toInstant();
        return PaginaRespuestaDTO.de(notificacionRepository.buscarHistorial(usuarioId,
                tipo, tipo != null, leida, leida != null, inicio, inicio != null,
                finExclusivo, finExclusivo != null,
                PageRequest.of(Math.max(0, pagina), tamano > 0 && tamano <= 100 ? tamano : 20,
                        Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id")))).map(this::mapearADTO));
    }

    public List<NotificacionResponseDTO> obtenerUltimas(Integer usuarioId, int limite) {
        int tamano = limite > 0 ? Math.min(limite, 50) : 15;
        return notificacionRepository
                .findByUsuarioIdOrderByCreatedAtDesc(usuarioId, PageRequest.of(0, tamano))
                .getContent()
                .stream()
                .map(this::mapearADTO)
                .toList();
    }

    public long contarNoLeidas(Integer usuarioId) {
        return notificacionRepository.countByUsuarioIdAndLeidaFalse(usuarioId);
    }

    @Transactional
    public NotificacionResponseDTO marcarComoLeida(Long notificacionId, Integer usuarioId) {
        Notificacion notificacion = notificacionRepository.findById(notificacionId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Notificacion no encontrada con ID: " + notificacionId));

        if (!notificacion.getUsuario().getId().equals(usuarioId)) {
            throw new OperacionInvalidaException("No tiene autorizacion para modificar una notificacion asignada a otro usuario.");
        }

        if (!notificacion.isLeida()) {
            notificacion.setLeida(true);
            notificacion.setFechaLectura(Instant.now());
            notificacion = notificacionRepository.save(notificacion);
        }

        return mapearADTO(notificacion);
    }

    @Transactional
    public void marcarTodasComoLeidas(Integer usuarioId) {
        notificacionRepository.marcarTodasComoLeidas(usuarioId);
        log.debug("Todas las notificaciones marcadas como leidas para usuario ID: {}", usuarioId);
    }

    private NotificacionResponseDTO mapearADTO(Notificacion n) {
        return NotificacionResponseDTO.builder()
                .id(n.getId())
                .titulo(n.getTitulo())
                .mensaje(n.getMensaje())
                .tipo(n.getTipo())
                .severidad(n.getSeveridad())
                .rutaEnlace(n.getRutaEnlace())
                .recursoTipo(n.getRecursoTipo())
                .recursoId(n.getRecursoId())
                .leida(n.isLeida())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
