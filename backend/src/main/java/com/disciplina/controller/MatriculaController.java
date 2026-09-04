package com.disciplina.controller;

import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.disciplina.dto.matricula.EstudianteMatriculaResponseDTO;
import com.disciplina.dto.matricula.ImportacionMatriculasResumenDTO;
import com.disciplina.service.EstudianteService;
import com.disciplina.service.ImportadorMatriculasService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping({"/matriculas", "/api/v1/matriculas"})
@RequiredArgsConstructor
public class MatriculaController {

    private final ImportadorMatriculasService importadorMatriculasService;
    private final EstudianteService estudianteService;

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
}