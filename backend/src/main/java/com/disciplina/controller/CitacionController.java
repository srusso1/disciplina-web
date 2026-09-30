package com.disciplina.controller;

import com.disciplina.dto.citacion.*;
import com.disciplina.service.CitacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/citaciones")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
public class CitacionController {
    private final CitacionService service;

    @PostMapping
    public CitacionResponseDTO crear(@Valid @RequestBody CrearCitacionDTO dto, Authentication authentication) {
        return service.crearCitacion(dto, authentication.getName());
    }

    @GetMapping("/incidente/{id}")
    public List<CitacionResponseDTO> listarPorIncidente(@PathVariable Integer id) {
        return service.listarPorIncidente(id);
    }

    @GetMapping("/estudiante/{id}")
    public List<CitacionResponseDTO> listarPorEstudiante(@PathVariable Integer id) {
        return service.listarPorEstudiante(id);
    }

    @PatchMapping("/{id}/estado")
    public CitacionResponseDTO actualizarEstado(@PathVariable Long id,
                                                @Valid @RequestBody ActualizarEstadoCitacionDTO dto,
                                                Authentication authentication) {
        return service.actualizarEstado(id, dto, authentication.getName());
    }

    @PostMapping("/{id}/reenviar")
    public CitacionResponseDTO reenviar(@PathVariable Long id, Authentication authentication) {
        return service.reenviar(id, authentication.getName());
    }

    @GetMapping("/{id}/historial")
    public List<HistorialEstadoCitacionDTO> historial(@PathVariable Long id) {
        return service.obtenerHistorial(id);
    }
}
