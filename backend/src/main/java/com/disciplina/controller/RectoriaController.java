package com.disciplina.controller;

import com.disciplina.dto.rectoria.MetricasDashboardRectoriaDTO;
import com.disciplina.service.RectoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/rectoria", "/api/v1/rectoria"})
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECTOR')")
public class RectoriaController {

    private final RectoriaService rectoriaService;

    @GetMapping("/metricas-dashboard")
    public ResponseEntity<MetricasDashboardRectoriaDTO> obtenerMetricasDashboard() {
        return ResponseEntity.ok(rectoriaService.obtenerMetricasDashboard());
    }
}
