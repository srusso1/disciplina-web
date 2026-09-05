package com.disciplina.service;

import com.disciplina.common.exception.ConflictoEntidadException;
import com.disciplina.common.exception.RecursoNoEncontradoException;
import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.enums.EstadoProceso;
import com.disciplina.domain.enums.RolEstudianteIncidente;
import com.disciplina.domain.model.*;
import com.disciplina.domain.repository.*;
import com.disciplina.dto.catalogo.CatalogoFaltaResponseDTO;
import com.disciplina.dto.catalogo.DocenteResponseDTO;
import com.disciplina.dto.catalogo.LugarResponseDTO;
import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.disciplina.dto.incidente.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class IncidenteService {

    private final IncidenteRepository incidenteRepository;
    private final IncidenteEstudianteRepository incidenteEstudianteRepository;
    private final DocenteRepository docenteRepository;
    private final LugarRepository lugarRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstudianteRepository estudianteRepository;
    private final MatriculaEstudianteRepository matriculaEstudianteRepository;
    private final CatalogoFaltaRepository catalogoFaltaRepository;

    @Transactional
    public IncidenteResponseDTO registrarIncidente(RegistrarIncidenteDTO dto, String username) {
        Docente docente = docenteRepository.findById(dto.getDocenteReportaId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Docente no encontrado con ID: " + dto.getDocenteReportaId()));

        Lugar lugar = lugarRepository.findById(dto.getLugarId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Lugar no encontrado con ID: " + dto.getLugarId()));

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario autenticado no encontrado: " + username));

        // Validar unicidad de estudiantes dentro del mismo incidente
        Set<Integer> estudiantesProcesados = new HashSet<>();
        for (InvolucradoRequestDTO inv : dto.getInvolucrados()) {
            if (!estudiantesProcesados.add(inv.getEstudianteId())) {
                throw new ConflictoEntidadException("El estudiante con ID " + inv.getEstudianteId() + " no puede ser registrado multiples veces en el mismo incidente.");
            }
        }

        Incidente incidente = Incidente.builder()
                .docenteReporta(docente)
                .lugar(lugar)
                .usuarioRegistro(usuario)
                .fechaIncidente(dto.getFechaIncidente())
                .horaIncidente(dto.getHoraIncidente())
                .descripcionHechos(dto.getDescripcionHechos().trim())
                .estadoProceso(EstadoProceso.REPORTADO)
                .build();

        int anioLectivo = dto.getFechaIncidente().getYear();

        for (InvolucradoRequestDTO invDto : dto.getInvolucrados()) {
            Estudiante estudiante = estudianteRepository.findById(invDto.getEstudianteId())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Estudiante no encontrado con ID: " + invDto.getEstudianteId()));

            CatalogoFalta falta = null;
            boolean esParteProtegida = invDto.getRolEstudiante() == RolEstudianteIncidente.VICTIMA
                    || invDto.getRolEstudiante() == RolEstudianteIncidente.TESTIGO;

            if (esParteProtegida && invDto.getCatalogoFaltaId() != null) {
                log.warn("Salvaguarda Debido Proceso (Ley 1620): Se ignora catalogoFaltaId {} para estudiante {} con rol protegido {}",
                        invDto.getCatalogoFaltaId(), estudiante.getId(), invDto.getRolEstudiante());
            } else if (!esParteProtegida && invDto.getCatalogoFaltaId() != null) {
                falta = catalogoFaltaRepository.findById(invDto.getCatalogoFaltaId())
                        .orElseThrow(() -> new RecursoNoEncontradoException("Falta disciplinaria no encontrada con ID: " + invDto.getCatalogoFaltaId()));
            }

            // Snapshot histórico inmutable: consultar matrícula del año del hecho
            String gradoMomento = "SIN_GRADO";
            String grupoMomento = "SIN_GRUPO";

            Optional<MatriculaEstudiante> matriculaOpt = matriculaEstudianteRepository.findByEstudianteAndAnioLectivo(estudiante, anioLectivo);
            if (matriculaOpt.isPresent()) {
                gradoMomento = matriculaOpt.get().getGrado();
                grupoMomento = matriculaOpt.get().getGrupo();
            }

            String descargoInicial = invDto.getDescargoEstudiante() != null
                    ? invDto.getDescargoEstudiante().trim()
                    : (invDto.getDescripcionIndividual() != null ? invDto.getDescripcionIndividual().trim() : null);

            IncidenteEstudiante ie = IncidenteEstudiante.builder()
                    .estudiante(estudiante)
                    .catalogoFalta(falta)
                    .anioLectivo(anioLectivo)
                    .gradoMomento(gradoMomento)
                    .grupoMomento(grupoMomento)
                    .rolEstudiante(invDto.getRolEstudiante())
                    .descargoEstudiante(descargoInicial)
                    .compromisoIndividual(invDto.getCompromisoIndividual() != null ? invDto.getCompromisoIndividual().trim() : null)
                    .build();

            incidente.agregarInvolucrado(ie);
        }

        Incidente guardado = incidenteRepository.save(incidente);
        log.info("Incidente registrado exitosamente con ID: {} e involucrados: {}", guardado.getId(), guardado.getInvolucrados().size());

        return mapearADTO(guardado, null);
    }

    public PaginaRespuestaDTO<IncidenteResponseDTO> listarIncidentesPaginados(
            EstadoProceso estado,
            ClasificacionLey tipoLey,
            LocalDate fechaDesde,
            LocalDate fechaHasta,
            String busqueda,
            int page,
            int size) {

        int paginaValida = Math.max(0, page);
        int tamanoValido = (size > 0 && size <= 100) ? size : 15;
        Pageable pageable = PageRequest.of(paginaValida, tamanoValido);

        String filtro = (busqueda != null && !busqueda.trim().isEmpty()) ? busqueda.trim() : null;

        Page<Incidente> pagina = incidenteRepository.buscarIncidentesPaginados(estado, tipoLey, fechaDesde, fechaHasta, filtro, pageable);
        return PaginaRespuestaDTO.de(pagina.map(i -> mapearADTO(i, null)));
    }

    public IncidenteResponseDTO obtenerIncidentePorId(Integer id) {
        Incidente incidente = incidenteRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Incidente no encontrado con ID: " + id));

        // Cargar involucrados con detalles sin mutar la referencia de coleccion gestionada por Hibernate
        List<IncidenteEstudiante> involucrados = incidenteEstudianteRepository.findByIncidenteIdConDetalles(id);

        return mapearADTO(incidente, involucrados);
    }

    @Transactional
    public IncidenteResponseDTO actualizarEstado(Integer id, ActualizarEstadoIncidenteDTO dto) {
        Incidente incidente = incidenteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Incidente no encontrado con ID: " + id));

        incidente.setEstadoProceso(dto.getEstadoProceso());
        incidente = incidenteRepository.save(incidente);

        return obtenerIncidentePorId(incidente.getId());
    }

    @Transactional
    public InvolucradoResponseDTO actualizarDescargoEstudiante(Integer incidenteId, Integer estudianteId, ActualizarDescargoDTO dto) {
        IncidenteEstudiante ie = incidenteEstudianteRepository.findByIncidenteIdAndEstudianteId(incidenteId, estudianteId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontro relacion entre el incidente " + incidenteId + " y el estudiante " + estudianteId));

        ie.setDescargoEstudiante(dto.getDescargoEstudiante().trim());
        if (dto.getCompromisoIndividual() != null) {
            ie.setCompromisoIndividual(dto.getCompromisoIndividual().trim());
        }

        ie = incidenteEstudianteRepository.save(ie);
        return mapearInvolucradoADTO(ie);
    }

    public EstadisticasIncidentesDTO obtenerEstadisticasIncidentes() {
        long total = incidenteRepository.count();
        long tipoI = incidenteEstudianteRepository.countDistinctIncidentesByClasificacionLey(ClasificacionLey.TIPO_I);
        long tipoII = incidenteEstudianteRepository.countDistinctIncidentesByClasificacionLey(ClasificacionLey.TIPO_II);
        long tipoIII = incidenteEstudianteRepository.countDistinctIncidentesByClasificacionLey(ClasificacionLey.TIPO_III);

        long cerrados = incidenteRepository.countByEstadoProceso(EstadoProceso.CERRADO);
        long enSeguimiento = Math.max(0, total - cerrados);

        return EstadisticasIncidentesDTO.builder()
                .totalIncidentes(total)
                .tipoI(tipoI)
                .tipoII(tipoII)
                .tipoIII(tipoIII)
                .enSeguimiento(enSeguimiento)
                .cerrados(cerrados)
                .build();
    }

    private IncidenteResponseDTO mapearADTO(Incidente i, List<IncidenteEstudiante> involucradosExternos) {
        Docente d = i.getDocenteReporta();
        Lugar l = i.getLugar();
        Usuario u = i.getUsuarioRegistro();

        List<IncidenteEstudiante> listaFuente = involucradosExternos != null ? involucradosExternos : i.getInvolucrados();
        List<InvolucradoResponseDTO> invList = listaFuente != null
                ? listaFuente.stream().map(this::mapearInvolucradoADTO).collect(Collectors.toList())
                : new ArrayList<>();

        return IncidenteResponseDTO.builder()
                .id(i.getId())
                .docenteReporta(DocenteResponseDTO.builder()
                        .id(d.getId())
                        .documento(d.getDocumento())
                        .nombres(d.getNombres())
                        .apellidos(d.getApellidos())
                        .nombreCompleto(d.getNombreCompleto())
                        .areaDesempeno(d.getAreaDesempeno())
                        .build())
                .lugar(LugarResponseDTO.builder()
                        .id(l.getId())
                        .nombre(l.getNombre())
                        .descripcion(l.getDescripcion())
                        .build())
                .usuarioRegistro(u != null ? u.getNombreCompleto() : "N/A")
                .fechaIncidente(i.getFechaIncidente())
                .horaIncidente(i.getHoraIncidente())
                .descripcionHechos(i.getDescripcionHechos())
                .estadoProceso(i.getEstadoProceso())
                .createdAt(i.getCreatedAt())
                .updatedAt(i.getUpdatedAt())
                .involucrados(invList)
                .build();
    }

    private InvolucradoResponseDTO mapearInvolucradoADTO(IncidenteEstudiante ie) {
        Estudiante e = ie.getEstudiante();
        CatalogoFalta cf = ie.getCatalogoFalta();

        CatalogoFaltaResponseDTO faltaDTO = null;
        if (cf != null) {
            faltaDTO = CatalogoFaltaResponseDTO.builder()
                    .id(cf.getId())
                    .codigo(cf.getCodigo())
                    .clasificacionLey(cf.getClasificacionLey())
                    .gravedadInstitucional(cf.getGravedadInstitucional())
                    .descripcion(cf.getDescripcion())
                    .procedimientoSugerido(cf.getProcedimientoSugerido())
                    .build();
        }

        return InvolucradoResponseDTO.builder()
                .id(ie.getId())
                .estudianteId(e.getId())
                .estudianteDocumento(e.getDocumento())
                .estudianteNombreCompleto(e.getNombres() + " " + e.getApellidos())
                .anioLectivo(ie.getAnioLectivo())
                .gradoMomento(ie.getGradoMomento())
                .grupoMomento(ie.getGrupoMomento())
                .rolEstudiante(ie.getRolEstudiante())
                .falta(faltaDTO)
                .descargoEstudiante(ie.getDescargoEstudiante())
                .compromisoIndividual(ie.getCompromisoIndividual())
                .build();
    }
}
