package com.disciplina.controller;

import com.disciplina.domain.enums.EstadoPlanIntervencion;
import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.disciplina.dto.plan.ActualizarPlanIntervencionDTO;
import com.disciplina.dto.plan.CrearPlanIntervencionDTO;
import com.disciplina.dto.plan.PlanIntervencionResponseDTO;
import com.disciplina.dto.plan.RegistrarSeguimientoDTO;
import com.disciplina.service.PlanIntervencionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/planes-intervencion", "/api/v1/planes-intervencion"})
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
public class PlanIntervencionController {

    private final PlanIntervencionService planIntervencionService;

    /**
     * RF-06: Registra un plan de intervención pedagógica y restaurativa.
     */
    @PostMapping
    public ResponseEntity<PlanIntervencionResponseDTO> crearPlan(
            @Valid @RequestBody CrearPlanIntervencionDTO dto,
            Authentication authentication) {

        String username = authentication != null ? authentication.getName() : "orientador";
        PlanIntervencionResponseDTO creado = planIntervencionService.crearPlan(dto, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    /**
     * Consulta un plan de intervención por ID incluyendo todos sus seguimientos históricos.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PlanIntervencionResponseDTO> obtenerPlanPorId(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(planIntervencionService.obtenerPlanPorId(id));
    }

    /**
     * Lista todos los planes de intervención de un estudiante.
     */
    @GetMapping("/estudiante/{estudianteId}")
    public ResponseEntity<List<PlanIntervencionResponseDTO>> listarPorEstudiante(
            @PathVariable("estudianteId") Integer estudianteId) {

        return ResponseEntity.ok(planIntervencionService.listarPlanesPorEstudiante(estudianteId));
    }

    /**
     * Consulta paginada de planes de intervención con filtros de estado y búsqueda.
     */
    @GetMapping
    public ResponseEntity<PaginaRespuestaDTO<PlanIntervencionResponseDTO>> listarPlanesPaginados(
            @RequestParam(value = "estado", required = false) EstadoPlanIntervencion estado,
            @RequestParam(value = "busqueda", required = false) String busqueda,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        return ResponseEntity.ok(planIntervencionService.listarPlanesPaginados(estado, busqueda, page, size));
    }

    /**
     * Actualiza el diagnóstico, compromisos o estado de un plan de intervención.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PlanIntervencionResponseDTO> actualizarPlan(
            @PathVariable("id") Integer id,
            @RequestBody ActualizarPlanIntervencionDTO dto) {

        return ResponseEntity.ok(planIntervencionService.actualizarPlan(id, dto));
    }

    /**
     * CU-07: Registra una nota de seguimiento o evolución en un plan de intervención.
     */
    @PostMapping("/{id}/seguimientos")
    public ResponseEntity<PlanIntervencionResponseDTO> registrarSeguimiento(
            @PathVariable("id") Integer id,
            @Valid @RequestBody RegistrarSeguimientoDTO dto,
            Authentication authentication) {

        String username = authentication != null ? authentication.getName() : "orientador";
        PlanIntervencionResponseDTO actualizado = planIntervencionService.registrarSeguimiento(id, dto, username);
        return ResponseEntity.ok(actualizado);
    }
}
