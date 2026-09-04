package com.disciplina.service;

import com.disciplina.domain.model.Estudiante;
import com.disciplina.domain.model.MatriculaEstudiante;
import com.disciplina.domain.repository.EstudianteRepository;
import com.disciplina.domain.repository.MatriculaEstudianteRepository;
import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.disciplina.dto.matricula.EstudianteMatriculaResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EstudianteService {

    private final EstudianteRepository estudianteRepository;
    private final MatriculaEstudianteRepository matriculaEstudianteRepository;

    public PaginaRespuestaDTO<EstudianteMatriculaResponseDTO> listarEstudiantesPaginados(
            Integer anioLectivo,
            String grado,
            String grupo,
            String busqueda,
            int page,
            int size) {

        int anio = (anioLectivo != null && anioLectivo > 2000) ? anioLectivo : LocalDate.now().getYear();
        int paginaValida = Math.max(0, page);
        int tamanoValido = (size > 0 && size <= 100) ? size : 15;

        Pageable pageable = PageRequest.of(paginaValida, tamanoValido);
        String filtro = (busqueda != null && !busqueda.trim().isEmpty()) ? busqueda.trim() : null;
        String g = (grado != null && !grado.trim().isEmpty()) ? grado.trim() : null;
        String grp = (grupo != null && !grupo.trim().isEmpty()) ? grupo.trim() : null;

        Page<MatriculaEstudiante> pagina = matriculaEstudianteRepository
                .buscarMatriculasPaginadas(anio, g, grp, filtro, pageable);

        Page<EstudianteMatriculaResponseDTO> paginaDTO = pagina.map(this::mapToDTO);
        return PaginaRespuestaDTO.de(paginaDTO);
    }

    public List<EstudianteMatriculaResponseDTO> listarEstudiantesPorMatricula(Integer anioLectivo, String grado, String grupo, String busqueda) {
        int anio = (anioLectivo != null && anioLectivo > 2000) ? anioLectivo : LocalDate.now().getYear();

        List<MatriculaEstudiante> matriculas;
        if (grado != null && !grado.trim().isEmpty() && grupo != null && !grupo.trim().isEmpty()) {
            matriculas = matriculaEstudianteRepository.findByAnioLectivoYGradoYGrupo(anio, grado.trim(), grupo.trim());
        } else if (grado != null && !grado.trim().isEmpty()) {
            matriculas = matriculaEstudianteRepository.findByAnioLectivoYGrado(anio, grado.trim());
        } else {
            matriculas = matriculaEstudianteRepository.findByAnioLectivoConEstudiante(anio);
        }

        String filtro = (busqueda != null) ? busqueda.trim().toLowerCase() : "";

        return matriculas.stream()
                .filter(m -> {
                    if (filtro.isEmpty()) return true;
                    Estudiante e = m.getEstudiante();
                    String full = (e.getNombres() + " " + e.getApellidos() + " " + e.getDocumento()).toLowerCase();
                    return full.contains(filtro);
                })
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public long contarMatriculasPorAnio(Integer anioLectivo) {
        int anio = (anioLectivo != null && anioLectivo > 2000) ? anioLectivo : LocalDate.now().getYear();
        return matriculaEstudianteRepository.countByAnioLectivo(anio);
    }

    private EstudianteMatriculaResponseDTO mapToDTO(MatriculaEstudiante m) {
        Estudiante e = m.getEstudiante();
        return EstudianteMatriculaResponseDTO.builder()
                .id(e.getId())
                .documento(e.getDocumento())
                .nombres(e.getNombres())
                .apellidos(e.getApellidos())
                .nombreCompleto(e.getNombres() + " " + e.getApellidos())
                .nombreAcudiente(e.getNombreAcudiente())
                .telefonoAcudiente(e.getTelefonoAcudiente())
                .grado(m.getGrado())
                .grupo(m.getGrupo())
                .jornada(m.getJornada())
                .anioLectivo(m.getAnioLectivo())
                .estadoMatricula(m.getEstadoMatricula().name())
                .build();
    }
}