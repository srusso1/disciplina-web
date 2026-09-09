package com.disciplina.controller;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.enums.EstadoProceso;
import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.disciplina.dto.incidente.*;
import com.disciplina.service.IncidenteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping({"/incidentes", "/api/v1/incidentes"})
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
public class IncidenteController {

    private final IncidenteService incidenteService;

    @PostMapping
    public ResponseEntity<IncidenteResponseDTO> registrarIncidente(
            @Valid @RequestBody RegistrarIncidenteDTO dto,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Acceso no autenticado. Se requiere una sesión válida.");
        }
        String username = authentication.getName();
        IncidenteResponseDTO creado = incidenteService.registrarIncidente(dto, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @GetMapping
    public ResponseEntity<PaginaRespuestaDTO<IncidenteResponseDTO>> listarIncidentes(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "15") int size,
            @RequestParam(value = "estado", required = false) EstadoProceso estado,
            @RequestParam(value = "tipoLey", required = false) ClasificacionLey tipoLey,
            @RequestParam(value = "fechaDesde", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaDesde,
            @RequestParam(value = "fechaHasta", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaHasta,
            @RequestParam(value = "busqueda", required = false) String busqueda) {

        PaginaRespuestaDTO<IncidenteResponseDTO> pagina = incidenteService
                .listarIncidentesPaginados(estado, tipoLey, fechaDesde, fechaHasta, busqueda, page, size);
        return ResponseEntity.ok(pagina);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidenteResponseDTO> obtenerIncidentePorId(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(incidenteService.obtenerIncidentePorId(id));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<IncidenteResponseDTO> actualizarEstado(
            @PathVariable("id") Integer id,
            @Valid @RequestBody ActualizarEstadoIncidenteDTO dto) {

        return ResponseEntity.ok(incidenteService.actualizarEstado(id, dto));
    }

    @PutMapping("/{id}/estudiantes/{estudianteId}/descargo")
    public ResponseEntity<InvolucradoResponseDTO> actualizarDescargo(
            @PathVariable("id") Integer id,
            @PathVariable("estudianteId") Integer estudianteId,
            @Valid @RequestBody ActualizarDescargoDTO dto) {

        return ResponseEntity.ok(incidenteService.actualizarDescargoEstudiante(id, estudianteId, dto));
    }

    @GetMapping("/estadisticas")
    public ResponseEntity<EstadisticasIncidentesDTO> obtenerEstadisticas() {
        return ResponseEntity.ok(incidenteService.obtenerEstadisticasIncidentes());
    }
}
