package com.disciplina.service;

import com.disciplina.common.exception.ConflictoEntidadException;
import com.disciplina.common.exception.RecursoNoEncontradoException;
import com.disciplina.domain.enums.EstadoMatricula;
import com.disciplina.domain.model.Estudiante;
import com.disciplina.domain.model.MatriculaEstudiante;
import com.disciplina.domain.enums.RolEstudianteIncidente;
import com.disciplina.domain.model.CatalogoFalta;
import com.disciplina.domain.model.Incidente;
import com.disciplina.domain.model.IncidenteEstudiante;
import com.disciplina.domain.repository.EstudianteRepository;
import com.disciplina.domain.repository.IncidenteEstudianteRepository;
import com.disciplina.domain.repository.MatriculaEstudianteRepository;
import com.disciplina.dto.catalogo.CatalogoFaltaResponseDTO;
import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.disciplina.dto.expediente.*;
import com.disciplina.dto.matricula.ActualizarEstudianteDTO;
import com.disciplina.dto.matricula.EstudianteMatriculaResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EstudianteService {

    private final EstudianteRepository estudianteRepository;
    private final MatriculaEstudianteRepository matriculaEstudianteRepository;
    private final IncidenteEstudianteRepository incidenteEstudianteRepository;

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

    @Transactional
    public EstudianteMatriculaResponseDTO actualizarEstudiante(Integer estudianteId, ActualizarEstudianteDTO dto) {
        Estudiante estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Estudiante no encontrado con ID: " + estudianteId));

        String nuevoDoc = dto.getDocumento().trim();
        if (!estudiante.getDocumento().equalsIgnoreCase(nuevoDoc)) {
            if (estudianteRepository.existsByDocumento(nuevoDoc)) {
                throw new ConflictoEntidadException("Ya existe un estudiante registrado con el documento: " + nuevoDoc);
            }
            estudiante.setDocumento(nuevoDoc);
        }

        estudiante.setNombres(dto.getNombres().trim().toUpperCase());
        estudiante.setApellidos(dto.getApellidos().trim().toUpperCase());
        estudiante.setNombreAcudiente(dto.getNombreAcudiente().trim().toUpperCase());
        estudiante.setTelefonoAcudiente(dto.getTelefonoAcudiente().trim());

        estudiante = estudianteRepository.save(estudiante);

        int anio = (dto.getAnioLectivo() != null && dto.getAnioLectivo() > 2000) ? dto.getAnioLectivo() : LocalDate.now().getYear();
        Optional<MatriculaEstudiante> matriculaOpt = matriculaEstudianteRepository.findByEstudianteAndAnioLectivo(estudiante, anio);
        MatriculaEstudiante matricula;
        if (matriculaOpt.isPresent()) {
            matricula = matriculaOpt.get();
            if (dto.getGrado() != null && !dto.getGrado().trim().isEmpty()) {
                matricula.setGrado(dto.getGrado().trim());
            }
            if (dto.getGrupo() != null && !dto.getGrupo().trim().isEmpty()) {
                matricula.setGrupo(dto.getGrupo().trim());
            }
            if (dto.getJornada() != null && !dto.getJornada().trim().isEmpty()) {
                matricula.setJornada(dto.getJornada().trim());
            }
            if (dto.getEstadoMatricula() != null) {
                matricula.setEstadoMatricula(dto.getEstadoMatricula());
            }
            matricula = matriculaEstudianteRepository.save(matricula);
        } else {
            matricula = MatriculaEstudiante.builder()
                    .estudiante(estudiante)
                    .anioLectivo(anio)
                    .grado(dto.getGrado() != null ? dto.getGrado().trim() : "0")
                    .grupo(dto.getGrupo() != null ? dto.getGrupo().trim() : "0")
                    .jornada(dto.getJornada() != null ? dto.getJornada().trim() : "MANANA")
                    .estadoMatricula(dto.getEstadoMatricula() != null ? dto.getEstadoMatricula() : EstadoMatricula.ACTIVO)
                    .build();
            matricula = matriculaEstudianteRepository.save(matricula);
        }

        return mapToDTO(matricula);
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

    public ExpedienteEstudianteDTO obtenerExpedienteEstudiante(Integer estudianteId) {
        Estudiante e = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Estudiante no encontrado con ID: " + estudianteId));

        // 1. Historial de Matrículas (orden descendente por año lectivo)
        List<MatriculaEstudiante> matriculas = matriculaEstudianteRepository
                .findByEstudianteIdOrderByAnioLectivoDesc(estudianteId);

        List<MatriculaHistorialDTO> matriculasDTO = matriculas.stream()
                .map(m -> MatriculaHistorialDTO.builder()
                        .id(m.getId())
                        .anioLectivo(m.getAnioLectivo())
                        .grado(m.getGrado())
                        .grupo(m.getGrupo())
                        .jornada(m.getJornada())
                        .estadoMatricula(m.getEstadoMatricula().name())
                        .build())
                .collect(Collectors.toList());

        MatriculaHistorialDTO matriculaActual = matriculasDTO.isEmpty() ? null : matriculasDTO.get(0);

        // 2. Historial de Incidentes y Debido Proceso
        List<IncidenteEstudiante> incidentesRel = incidenteEstudianteRepository
                .findByEstudianteIdConIncidente(estudianteId);

        long agresor = 0;
        long participe = 0;
        long victima = 0;
        long testigo = 0;
        long tipoI = 0;
        long tipoII = 0;
        long tipoIII = 0;

        List<IncidenteHistorialEstudianteDTO> incidentesDTO = new ArrayList<>();
        for (IncidenteEstudiante ie : incidentesRel) {
            Incidente inc = ie.getIncidente();
            RolEstudianteIncidente rol = ie.getRolEstudiante();

            if (rol != null) {
                switch (rol) {
                    case AGRESOR_PRINCIPAL -> agresor++;
                    case PARTICIPE -> participe++;
                    case VICTIMA -> victima++;
                    case TESTIGO -> testigo++;
                }
            }

            CatalogoFalta cf = ie.getCatalogoFalta();
            CatalogoFaltaResponseDTO faltaDTO = null;
            if (cf != null) {
                if (cf.getClasificacionLey() != null) {
                    switch (cf.getClasificacionLey()) {
                        case TIPO_I -> tipoI++;
                        case TIPO_II -> tipoII++;
                        case TIPO_III -> tipoIII++;
                    }
                }
                faltaDTO = CatalogoFaltaResponseDTO.builder()
                        .id(cf.getId())
                        .codigo(cf.getCodigo())
                        .clasificacionLey(cf.getClasificacionLey())
                        .gravedadInstitucional(cf.getGravedadInstitucional())
                        .descripcion(cf.getDescripcion())
                        .procedimientoSugerido(cf.getProcedimientoSugerido())
                        .build();
            }

            incidentesDTO.add(IncidenteHistorialEstudianteDTO.builder()
                    .incidenteId(inc.getId())
                    .fechaIncidente(inc.getFechaIncidente())
                    .horaIncidente(inc.getHoraIncidente())
                    .lugarNombre(inc.getLugar() != null ? inc.getLugar().getNombre() : "N/A")
                    .docenteReportaNombre(inc.getDocenteReporta() != null ? inc.getDocenteReporta().getNombreCompleto() : "N/A")
                    .estadoProceso(inc.getEstadoProceso())
                    .descripcionHechos(inc.getDescripcionHechos())
                    .rolEstudiante(rol)
                    .anioLectivoSnapshot(ie.getAnioLectivo())
                    .gradoMomento(ie.getGradoMomento())
                    .grupoMomento(ie.getGrupoMomento())
                    .falta(faltaDTO)
                    .descargoEstudiante(ie.getDescargoEstudiante())
                    .compromisoIndividual(ie.getCompromisoIndividual())
                    .createdAt(inc.getCreatedAt())
                    .build());
        }

        // Criterio pedagógico de reincidencia: >1 falta grave/gravísima o >=3 faltas tipo I
        boolean reincidente = (tipoII + tipoIII > 0 && (tipoI + tipoII + tipoIII > 1)) || tipoI >= 3;

        ResumenConvivenciaDTO resumen = ResumenConvivenciaDTO.builder()
                .totalIncidentes(incidentesRel.size())
                .comoAgresorPrincipal(agresor)
                .comoParticipe(participe)
                .comoVictima(victima)
                .comoTestigo(testigo)
                .faltasTipoI(tipoI)
                .faltasTipoII(tipoII)
                .faltasTipoIII(tipoIII)
                .reincidente(reincidente)
                .build();

        return ExpedienteEstudianteDTO.builder()
                .id(e.getId())
                .documento(e.getDocumento())
                .nombres(e.getNombres())
                .apellidos(e.getApellidos())
                .nombreCompleto(e.getNombres() + " " + e.getApellidos())
                .nombreAcudiente(e.getNombreAcudiente())
                .telefonoAcudiente(e.getTelefonoAcudiente())
                .emailAcudiente(e.getEmailAcudiente())
                .activo(Boolean.TRUE.equals(e.getActivo()))
                .matriculaActual(matriculaActual)
                .historialMatriculas(matriculasDTO)
                .resumenConvivencia(resumen)
                .historialIncidentes(incidentesDTO)
                .build();
    }
}