package com.disciplina.controller;

import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.disciplina.dto.configuracion.AreaDesempenoRequestDTO;
import com.disciplina.dto.configuracion.AreaDesempenoResponseDTO;
import com.disciplina.service.AreaDesempenoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/areas-desempeno", "/api/v1/areas-desempeno"})
@RequiredArgsConstructor
public class AreaDesempenoController {

    private final AreaDesempenoService areaDesempenoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
    public ResponseEntity<?> listar(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "activo", required = false) Boolean activo) {

        if (page != null) {
            return ResponseEntity.ok(areaDesempenoService.listarPaginado(q, page, size));
        }
        return ResponseEntity.ok(areaDesempenoService.listarActivas());
    }

    @GetMapping("/activas")
    @PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
    public ResponseEntity<List<AreaDesempenoResponseDTO>> listarActivas() {
        return ResponseEntity.ok(areaDesempenoService.listarActivas());
    }

    @PostMapping
    @PreAuthorize("hasRole('RECTOR')")
    public ResponseEntity<AreaDesempenoResponseDTO> crear(
            @Valid @RequestBody AreaDesempenoRequestDTO req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(areaDesempenoService.crear(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECTOR')")
    public ResponseEntity<AreaDesempenoResponseDTO> actualizar(
            @PathVariable("id") Integer id,
            @Valid @RequestBody AreaDesempenoRequestDTO req) {
        return ResponseEntity.ok(areaDesempenoService.actualizar(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECTOR')")
    public ResponseEntity<Void> eliminarLogico(@PathVariable("id") Integer id) {
        areaDesempenoService.eliminarLogico(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-activo")
    @PreAuthorize("hasRole('RECTOR')")
    public ResponseEntity<AreaDesempenoResponseDTO> toggleActivo(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(areaDesempenoService.toggleActivo(id));
    }
}
