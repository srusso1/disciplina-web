package com.disciplina.controller;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.dto.catalogo.CatalogoFaltaResponseDTO;
import com.disciplina.dto.catalogo.DocenteResponseDTO;
import com.disciplina.dto.catalogo.LugarResponseDTO;
import com.disciplina.service.CatalogoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/catalogos", "/api/v1/catalogos"})
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
public class CatalogoController {

    private final CatalogoService catalogoService;

    @GetMapping("/docentes")
    public ResponseEntity<List<DocenteResponseDTO>> listarDocentes() {
        return ResponseEntity.ok(catalogoService.listarDocentesActivos());
    }

    @GetMapping("/lugares")
    public ResponseEntity<List<LugarResponseDTO>> listarLugares() {
        return ResponseEntity.ok(catalogoService.listarLugaresActivos());
    }

    @GetMapping("/faltas")
    public ResponseEntity<List<CatalogoFaltaResponseDTO>> listarFaltas(
            @RequestParam(value = "tipo", required = false) ClasificacionLey tipo) {
        return ResponseEntity.ok(catalogoService.listarFaltasActivas(tipo));
    }
}
