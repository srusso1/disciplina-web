package com.disciplina.controller;

import com.disciplina.common.exception.RecursoNoEncontradoException;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.UsuarioRepository;
import com.disciplina.dto.notificacion.ConteoNotificacionesDTO;
import com.disciplina.dto.notificacion.NotificacionResponseDTO;
import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.disciplina.domain.enums.TipoNotificacion;
import com.disciplina.service.notificacion.NotificacionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;

@RestController
@RequestMapping({"/notificaciones", "/api/v1/notificaciones"})
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
public class NotificacionController {

    private final NotificacionService notificacionService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<NotificacionResponseDTO>> obtenerUltimas(
            @RequestParam(value = "limite", defaultValue = "15") int limite,
            Authentication authentication) {
        Usuario usuario = obtenerUsuarioAutenticado(authentication);
        List<NotificacionResponseDTO> notificaciones = notificacionService.obtenerUltimas(usuario.getId(), limite);
        return ResponseEntity.ok(notificaciones);
    }

    @GetMapping("/conteo-no-leidas")
    public ResponseEntity<ConteoNotificacionesDTO> obtenerConteoNoLeidas(Authentication authentication) {
        Usuario usuario = obtenerUsuarioAutenticado(authentication);
        long noLeidas = notificacionService.contarNoLeidas(usuario.getId());
        return ResponseEntity.ok(ConteoNotificacionesDTO.of(noLeidas));
    }

    @GetMapping("/historial")
    public ResponseEntity<PaginaRespuestaDTO<NotificacionResponseDTO>> obtenerHistorial(
            @RequestParam(required = false) TipoNotificacion tipo,
            @RequestParam(required = false) Boolean leida,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "20") int tamano,
            Authentication authentication) {
        Usuario usuario = obtenerUsuarioAutenticado(authentication);
        return ResponseEntity.ok(notificacionService.obtenerHistorial(usuario.getId(), tipo, leida,
                desde, hasta, pagina, tamano));
    }

    @PatchMapping("/{id}/leer")
    public ResponseEntity<NotificacionResponseDTO> marcarComoLeida(
            @PathVariable("id") Long id,
            Authentication authentication) {
        Usuario usuario = obtenerUsuarioAutenticado(authentication);
        NotificacionResponseDTO actualizada = notificacionService.marcarComoLeida(id, usuario.getId());
        return ResponseEntity.ok(actualizada);
    }

    @PatchMapping("/marcar-todas-leidas")
    public ResponseEntity<Void> marcarTodasComoLeidas(Authentication authentication) {
        Usuario usuario = obtenerUsuarioAutenticado(authentication);
        notificacionService.marcarTodasComoLeidas(usuario.getId());
        return ResponseEntity.noContent().build();
    }

    private Usuario obtenerUsuarioAutenticado(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Acceso no autenticado. Se requiere una sesión válida.");
        }
        String username = authentication.getName();
        return usuarioRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario autenticado no encontrado: " + username));
    }
}
