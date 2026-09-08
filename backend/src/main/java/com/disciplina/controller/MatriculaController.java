package com.disciplina.controller;

import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.disciplina.dto.expediente.ExpedienteEstudianteDTO;
import com.disciplina.dto.matricula.ActualizarEstudianteDTO;
import com.disciplina.dto.matricula.EstudianteMatriculaResponseDTO;
import com.disciplina.dto.matricula.ImportacionMatriculasResumenDTO;
import com.disciplina.service.EstudianteService;
import com.disciplina.service.ImportadorMatriculasService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping({"/matriculas", "/api/v1/matriculas"})
@RequiredArgsConstructor
public class MatriculaController {

    private final ImportadorMatriculasService importadorMatriculasService;
    private final EstudianteService estudianteService;

    @GetMapping(value = "/plantilla-ejemplo", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    @PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
    public ResponseEntity<byte[]> descargarPlantillaEjemplo() {
        byte[] excel = importadorMatriculasService.generarPlantillaEjemplo();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"plantilla_matricula_oficial.xlsx\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }

    @PostMapping(value = "/importar-masivo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
    public ResponseEntity<ImportacionMatriculasResumenDTO> importarPlanillaMasiva(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "anioLectivo", required = false) Integer anioLectivo) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ImportacionMatriculasResumenDTO.builder()
                    .anioLectivo(anioLectivo != null ? anioLectivo : 0)
                    .build());
        }

        String filename = file.getOriginalFilename();
        if (filename == null || (!filename.toLowerCase().endsWith(".xlsx") && !filename.toLowerCase().endsWith(".xls"))) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).build();
        }

        try {
            ImportacionMatriculasResumenDTO resumen = importadorMatriculasService
                    .importarPlanilla(file.getInputStream(), anioLectivo);
            return ResponseEntity.ok(resumen);
        } catch (IOException e) {
            log.error("Error de E/S al procesar la planilla de matrículas Excel: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/estudiantes")
    @PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
    public ResponseEntity<PaginaRespuestaDTO<EstudianteMatriculaResponseDTO>> listarEstudiantes(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "15") int size,
            @RequestParam(value = "anioLectivo", required = false) Integer anioLectivo,
            @RequestParam(value = "grado", required = false) String grado,
            @RequestParam(value = "grupo", required = false) String grupo,
            @RequestParam(value = "busqueda", required = false) String busqueda) {

        PaginaRespuestaDTO<EstudianteMatriculaResponseDTO> pagina = estudianteService
                .listarEstudiantesPaginados(anioLectivo, grado, grupo, busqueda, page, size);
        return ResponseEntity.ok(pagina);
    }

    @GetMapping("/resumen")
    @PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
    public ResponseEntity<Map<String, Object>> obtenerResumen(
            @RequestParam(value = "anioLectivo", required = false) Integer anioLectivo) {

        long total = estudianteService.contarMatriculasPorAnio(anioLectivo);
        return ResponseEntity.ok(Map.of(
                "anioLectivo", anioLectivo != null ? anioLectivo : 2026,
                "totalMatriculados", total
        ));
    }

    @PutMapping("/estudiantes/{id}")
    @PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
    public ResponseEntity<EstudianteMatriculaResponseDTO> actualizarEstudiante(
            @PathVariable("id") Integer id,
            @Valid @RequestBody ActualizarEstudianteDTO dto) {

        EstudianteMatriculaResponseDTO actualizado = estudianteService.actualizarEstudiante(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @GetMapping("/estudiantes/{id}/expediente")
    @PreAuthorize("hasAnyRole('RECTOR', 'ORIENTADOR')")
    public ResponseEntity<ExpedienteEstudianteDTO> obtenerExpediente(@PathVariable("id") Integer id) {
        ExpedienteEstudianteDTO expediente = estudianteService.obtenerExpedienteEstudiante(id);
        return ResponseEntity.ok(expediente);
    }
}