package com.disciplina.controller;

import com.disciplina.dto.catalogo.CatalogoFaltaResponseDTO;
import com.disciplina.dto.catalogo.DocenteResponseDTO;
import com.disciplina.dto.catalogo.LugarResponseDTO;
import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.disciplina.dto.configuracion.CatalogoFaltaRequestDTO;
import com.disciplina.dto.configuracion.DocenteRequestDTO;
import com.disciplina.dto.configuracion.LugarRequestDTO;
import com.disciplina.dto.configuracion.UsuarioAdminResponseDTO;
import com.disciplina.dto.configuracion.UsuarioRequestDTO;
import com.disciplina.service.ConfiguracionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/configuracion", "/api/v1/configuracion"})
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECTOR')")
public class ConfiguracionController {

    private final ConfiguracionService configuracionService;

    // -------------------------------------------------------------------------
    // Catalogo de Faltas
    // -------------------------------------------------------------------------

    @GetMapping("/catalogo-faltas")
    public ResponseEntity<PaginaRespuestaDTO<CatalogoFaltaResponseDTO>> listarCatalogoFaltas(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        return ResponseEntity.ok(configuracionService.listarCatalogoFaltas(page, size));
    }

    @PostMapping("/catalogo-faltas")
    public ResponseEntity<CatalogoFaltaResponseDTO> crearCatalogoFalta(
            @Valid @RequestBody CatalogoFaltaRequestDTO req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(configuracionService.crearCatalogoFalta(req));
    }

    @PutMapping("/catalogo-faltas/{id}")
    public ResponseEntity<CatalogoFaltaResponseDTO> actualizarCatalogoFalta(
            @PathVariable("id") Integer id,
            @Valid @RequestBody CatalogoFaltaRequestDTO req) {
        return ResponseEntity.ok(configuracionService.actualizarCatalogoFalta(id, req));
    }

    @PatchMapping("/catalogo-faltas/{id}/toggle-activo")
    public ResponseEntity<CatalogoFaltaResponseDTO> toggleActivoCatalogoFalta(
            @PathVariable("id") Integer id) {
        return ResponseEntity.ok(configuracionService.toggleActivoCatalogoFalta(id));
    }

    // -------------------------------------------------------------------------
    // Docentes
    // -------------------------------------------------------------------------

    @GetMapping("/docentes")
    public ResponseEntity<PaginaRespuestaDTO<DocenteResponseDTO>> listarDocentes(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        return ResponseEntity.ok(configuracionService.listarDocentes(q, page, size));
    }

    @PostMapping("/docentes")
    public ResponseEntity<DocenteResponseDTO> crearDocente(
            @Valid @RequestBody DocenteRequestDTO req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(configuracionService.crearDocente(req));
    }

    @PutMapping("/docentes/{id}")
    public ResponseEntity<DocenteResponseDTO> actualizarDocente(
            @PathVariable("id") Integer id,
            @Valid @RequestBody DocenteRequestDTO req) {
        return ResponseEntity.ok(configuracionService.actualizarDocente(id, req));
    }

    @PatchMapping("/docentes/{id}/toggle-activo")
    public ResponseEntity<DocenteResponseDTO> toggleActivoDocente(
            @PathVariable("id") Integer id) {
        return ResponseEntity.ok(configuracionService.toggleActivoDocente(id));
    }

    // -------------------------------------------------------------------------
    // Lugares
    // -------------------------------------------------------------------------

    @GetMapping("/lugares")
    public ResponseEntity<PaginaRespuestaDTO<LugarResponseDTO>> listarLugares(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        return ResponseEntity.ok(configuracionService.listarLugares(q, page, size));
    }

    @PostMapping("/lugares")
    public ResponseEntity<LugarResponseDTO> crearLugar(
            @Valid @RequestBody LugarRequestDTO req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(configuracionService.crearLugar(req));
    }

    @PutMapping("/lugares/{id}")
    public ResponseEntity<LugarResponseDTO> actualizarLugar(
            @PathVariable("id") Integer id,
            @Valid @RequestBody LugarRequestDTO req) {
        return ResponseEntity.ok(configuracionService.actualizarLugar(id, req));
    }

    @PatchMapping("/lugares/{id}/toggle-activo")
    public ResponseEntity<LugarResponseDTO> toggleActivoLugar(
            @PathVariable("id") Integer id) {
        return ResponseEntity.ok(configuracionService.toggleActivoLugar(id));
    }

    // -------------------------------------------------------------------------
    // Usuarios
    // -------------------------------------------------------------------------

    @GetMapping("/usuarios")
    public ResponseEntity<PaginaRespuestaDTO<UsuarioAdminResponseDTO>> listarUsuarios(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        return ResponseEntity.ok(configuracionService.listarUsuarios(page, size));
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioAdminResponseDTO> crearUsuario(
            @Valid @RequestBody UsuarioRequestDTO req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(configuracionService.crearUsuario(req));
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioAdminResponseDTO> actualizarUsuario(
            @PathVariable("id") Integer id,
            @Valid @RequestBody UsuarioRequestDTO req) {
        return ResponseEntity.ok(configuracionService.actualizarUsuario(id, req));
    }

    @PatchMapping("/usuarios/{id}/toggle-activo")
    public ResponseEntity<UsuarioAdminResponseDTO> toggleActivoUsuario(
            @PathVariable("id") Integer id) {
        return ResponseEntity.ok(configuracionService.toggleActivoUsuario(id));
    }
}
