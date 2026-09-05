package com.disciplina.controller;

import com.disciplina.dto.auditoria.AuditoriaResponseDTO;
import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.disciplina.service.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping({"/auditoria", "/api/v1/auditoria"})
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_RECTOR')")
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    /**
     * Criterio 3 BDD & Sección 18: Consulta paginada de la bitácora de auditoría forense.
     */
    @GetMapping
    public ResponseEntity<PaginaRespuestaDTO<AuditoriaResponseDTO>> listarAuditorias(
            @RequestParam(value = "entidad", required = false) String entidad,
            @RequestParam(value = "accion", required = false) String accion,
            @RequestParam(value = "fechaDesde", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fechaDesde,
            @RequestParam(value = "fechaHasta", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fechaHasta,
            @RequestParam(value = "busqueda", required = false) String busqueda,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "15") int size) {

        return ResponseEntity.ok(auditoriaService.listarAuditoriasPaginadas(
                entidad, accion, fechaDesde, fechaHasta, busqueda, page, size));
    }

    /**
     * Obtiene la cadena de custodia y cambios históricos de una entidad específica.
     */
    @GetMapping("/entidad/{entidad}/{entidadId}")
    public ResponseEntity<List<AuditoriaResponseDTO>> obtenerHistorialPorEntidad(
            @PathVariable("entidad") String entidad,
            @PathVariable("entidadId") String entidadId) {

        return ResponseEntity.ok(auditoriaService.obtenerHistorialPorEntidad(entidad, entidadId));
    }
}
