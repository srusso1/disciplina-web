package com.disciplina.controller;

import com.disciplina.dto.ia.GenerarPropuestaIntervencionDTO;
import com.disciplina.dto.ia.NarrativaProcesadaDTO;
import com.disciplina.dto.ia.ProcesarNarrativaRequestDTO;
import com.disciplina.dto.ia.PropuestaIntervencionIADTO;
import com.disciplina.service.ia.IaConvivenciaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ia")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
public class IaController {

    private final IaConvivenciaService iaConvivenciaService;

    @PostMapping("/procesar-narrativa")
    public ResponseEntity<NarrativaProcesadaDTO> procesarNarrativa(
            @Valid @RequestBody ProcesarNarrativaRequestDTO dto) {
        NarrativaProcesadaDTO resultado = iaConvivenciaService.procesarNarrativa(dto);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/generar-intervencion")
    public ResponseEntity<PropuestaIntervencionIADTO> generarPropuestaIntervencion(
            @Valid @RequestBody GenerarPropuestaIntervencionDTO dto) {
        PropuestaIntervencionIADTO resultado = iaConvivenciaService.generarPropuestaIntervencion(dto);
        return ResponseEntity.ok(resultado);
    }
}
