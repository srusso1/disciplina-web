package com.disciplina.controller;

import com.disciplina.service.ReportePdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping({"/reportes", "/api/v1/reportes"})
@RequiredArgsConstructor
public class ReporteController {

    private final ReportePdfService reportePdfService;

    /**
     * RF-08 / CU-11: Emite el acta formal de descargos y debido proceso en PDF.
     * Accesible por Orientación Escolar y Rectoría.
     */
    @GetMapping("/pdf/incidente/{id}")
    @PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
    public ResponseEntity<byte[]> descargarActaIncidentePdf(@PathVariable("id") Integer id) {
        byte[] pdfBytes = reportePdfService.generarActaIncidentePdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", "Acta-Incidente-" + id + ".pdf");
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    /**
     * RF-08 / CU-11: Emite el informe ejecutivo consolidado de convivencia para el despacho de Rectoría.
     * Restringido exclusivamente al rol Rector.
     */
    @GetMapping({"/pdf/consolidado-rectoria", "/pdf/consolidado-anual"})
    @PreAuthorize("hasRole('RECTOR')")
    public ResponseEntity<byte[]> descargarConsolidadoRectoriaPdf() {
        byte[] pdfBytes = reportePdfService.generarConsolidadoRectoriaPdf();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        String nombrePdf = "Informe-Ejecutivo-Convivencia-" + LocalDate.now().getYear() + ".pdf";
        headers.setContentDispositionFormData("inline", nombrePdf);
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
