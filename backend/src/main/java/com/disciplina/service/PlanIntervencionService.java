package com.disciplina.service;

import com.disciplina.common.exception.RecursoNoEncontradoException;
import com.disciplina.domain.enums.EstadoPlanIntervencion;
import com.disciplina.domain.model.*;
import com.disciplina.domain.repository.*;
import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.disciplina.dto.plan.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlanIntervencionService {

    private final PlanIntervencionRepository planIntervencionRepository;
    private final SeguimientoCasoRepository seguimientoCasoRepository;
    private final EstudianteRepository estudianteRepository;
    private final IncidenteRepository incidenteRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuditoriaService auditoriaService;

    @Transactional
    public PlanIntervencionResponseDTO crearPlan(CrearPlanIntervencionDTO dto, String username) {
        Estudiante estudiante = estudianteRepository.findById(dto.getEstudianteId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Estudiante no encontrado con ID: " + dto.getEstudianteId()));

        Usuario orientador = usuarioRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con username: " + username));

        Incidente incidente = null;
        if (dto.getIncidenteOrigenId() != null) {
            incidente = incidenteRepository.findById(dto.getIncidenteOrigenId())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Incidente de origen no encontrado con ID: " + dto.getIncidenteOrigenId()));
        }

        PlanIntervencion plan = PlanIntervencion.builder()
                .estudiante(estudiante)
                .incidenteOrigen(incidente)
                .orientador(orientador)
                .diagnosticoSituacional(dto.getDiagnosticoSituacional().trim())
                .recomendacionesIa(dto.getRecomendacionesIa() != null ? dto.getRecomendacionesIa().trim() : null)
                .accionesAcordadas(dto.getAccionesAcordadas().trim())
                .compromisoPadres(dto.getCompromisoPadres() != null ? dto.getCompromisoPadres().trim() : null)
                .fechaProximoSeguimiento(dto.getFechaProximoSeguimiento())
                .estado(dto.getEstado() != null ? dto.getEstado() : EstadoPlanIntervencion.EN_SEGUIMIENTO)
                .build();

        plan = planIntervencionRepository.save(plan);

        auditoriaService.registrarAuditoria(
                "CREAR",
                "PlanIntervencion",
                plan.getId(),
                null,
                Map.of(
                        "estudianteId", plan.getEstudiante().getId(),
                        "estado", plan.getEstado().name(),
                        "accionesAcordadas", plan.getAccionesAcordadas()
                ),
                username);

        return mapearADTO(plan, Collections.emptyList());
    }

    public PlanIntervencionResponseDTO obtenerPlanPorId(Integer id) {
        PlanIntervencion plan = planIntervencionRepository.findByIdConDetalles(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Plan de intervención no encontrado con ID: " + id));

        List<SeguimientoCaso> seguimientos = seguimientoCasoRepository.findByPlanIdConUsuario(id);
        return mapearADTO(plan, seguimientos);
    }

    public List<PlanIntervencionResponseDTO> listarPlanesPorEstudiante(Integer estudianteId) {
        if (!estudianteRepository.existsById(estudianteId)) {
            throw new RecursoNoEncontradoException("Estudiante no encontrado con ID: " + estudianteId);
        }

        List<PlanIntervencion> planes = planIntervencionRepository.findByEstudianteIdConDetalles(estudianteId);
        return planes.stream()
                .map(p -> {
                    List<SeguimientoCaso> segs = seguimientoCasoRepository.findByPlanIdConUsuario(p.getId());
                    return mapearADTO(p, segs);
                })
                .collect(Collectors.toList());
    }

    public PaginaRespuestaDTO<PlanIntervencionResponseDTO> listarPlanesPaginados(
            EstadoPlanIntervencion estado,
            String busqueda,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size));
        Page<PlanIntervencion> resultado = planIntervencionRepository.buscarPlanesPaginados(
                estado,
                busqueda != null ? busqueda.trim() : null,
                pageable);

        List<PlanIntervencionResponseDTO> dtos = resultado.getContent().stream()
                .map(p -> {
                    List<SeguimientoCaso> segs = seguimientoCasoRepository.findByPlanIdConUsuario(p.getId());
                    return mapearADTO(p, segs);
                })
                .collect(Collectors.toList());

        return PaginaRespuestaDTO.<PlanIntervencionResponseDTO>builder()
                .contenido(dtos)
                .pagina(resultado.getNumber())
                .tamanoPagina(resultado.getSize())
                .totalElementos(resultado.getTotalElements())
                .totalPaginas(resultado.getTotalPages())
                .primera(resultado.isFirst())
                .ultima(resultado.isLast())
                .build();
    }

    @Transactional
    public PlanIntervencionResponseDTO actualizarPlan(Integer id, ActualizarPlanIntervencionDTO dto) {
        PlanIntervencion plan = planIntervencionRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Plan de intervención no encontrado con ID: " + id));

        EstadoPlanIntervencion estadoAnterior = plan.getEstado();

        if (dto.getDiagnosticoSituacional() != null && !dto.getDiagnosticoSituacional().isBlank()) {
            plan.setDiagnosticoSituacional(dto.getDiagnosticoSituacional().trim());
        }
        if (dto.getRecomendacionesIa() != null) {
            plan.setRecomendacionesIa(dto.getRecomendacionesIa().trim());
        }
        if (dto.getAccionesAcordadas() != null && !dto.getAccionesAcordadas().isBlank()) {
            plan.setAccionesAcordadas(dto.getAccionesAcordadas().trim());
        }
        if (dto.getCompromisoPadres() != null) {
            plan.setCompromisoPadres(dto.getCompromisoPadres().trim());
        }
        if (dto.getFechaProximoSeguimiento() != null) {
            plan.setFechaProximoSeguimiento(dto.getFechaProximoSeguimiento());
        }
        if (dto.getEstado() != null) {
            plan.setEstado(dto.getEstado());
        }

        plan = planIntervencionRepository.save(plan);

        auditoriaService.registrarAuditoria(
                "ACTUALIZAR",
                "PlanIntervencion",
                plan.getId(),
                Map.of("estado", estadoAnterior != null ? estadoAnterior.name() : "N/A"),
                Map.of("estado", plan.getEstado().name()),
                null);

        return obtenerPlanPorId(plan.getId());
    }

    @Transactional
    public PlanIntervencionResponseDTO registrarSeguimiento(Integer planId, RegistrarSeguimientoDTO dto, String username) {
        PlanIntervencion plan = planIntervencionRepository.findById(planId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Plan de intervención no encontrado con ID: " + planId));

        Usuario usuario = usuarioRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con username: " + username));

        EstadoPlanIntervencion estadoAnterior = plan.getEstado();

        SeguimientoCaso seguimiento = SeguimientoCaso.builder()
                .plan(plan)
                .usuario(usuario)
                .observacion(dto.getObservacion().trim())
                .build();

        seguimientoCasoRepository.save(seguimiento);

        if (dto.getNuevoEstadoPlan() != null) {
            plan.setEstado(dto.getNuevoEstadoPlan());
        }
        if (dto.getNuevaFechaProximoSeguimiento() != null) {
            plan.setFechaProximoSeguimiento(dto.getNuevaFechaProximoSeguimiento());
        }

        planIntervencionRepository.save(plan);

        auditoriaService.registrarAuditoria(
                "REGISTRAR_SEGUIMIENTO",
                "PlanIntervencion",
                planId,
                Map.of("estadoAnterior", estadoAnterior != null ? estadoAnterior.name() : "N/A"),
                Map.of("nuevoEstado", plan.getEstado().name(), "observacion", dto.getObservacion()),
                username);

        return obtenerPlanPorId(planId);
    }

    private PlanIntervencionResponseDTO mapearADTO(PlanIntervencion p, List<SeguimientoCaso> seguimientos) {
        Estudiante e = p.getEstudiante();
        Usuario o = p.getOrientador();
        Incidente inc = p.getIncidenteOrigen();

        List<SeguimientoCasoResponseDTO> segDTOs = seguimientos != null ? seguimientos.stream()
                .map(s -> SeguimientoCasoResponseDTO.builder()
                        .id(s.getId())
                        .planId(p.getId())
                        .usuarioId(s.getUsuario() != null ? s.getUsuario().getId() : null)
                        .usuarioNombre(s.getUsuario() != null ? (s.getUsuario().getNombres() + " " + s.getUsuario().getApellidos()) : "Usuario")
                        .usuarioRol(s.getUsuario() != null ? s.getUsuario().getRol().name() : null)
                        .observacion(s.getObservacion())
                        .fechaRegistro(s.getFechaRegistro())
                        .build())
                .collect(Collectors.toList()) : Collections.emptyList();

        return PlanIntervencionResponseDTO.builder()
                .id(p.getId())
                .estudianteId(e != null ? e.getId() : null)
                .estudianteDocumento(e != null ? e.getDocumento() : null)
                .estudianteNombre(e != null ? (e.getNombres() + " " + e.getApellidos()) : null)
                .incidenteOrigenId(inc != null ? inc.getId() : null)
                .orientadorId(o != null ? o.getId() : null)
                .orientadorNombre(o != null ? (o.getNombres() + " " + o.getApellidos()) : null)
                .diagnosticoSituacional(p.getDiagnosticoSituacional())
                .recomendacionesIa(p.getRecomendacionesIa())
                .accionesAcordadas(p.getAccionesAcordadas())
                .compromisoPadres(p.getCompromisoPadres())
                .fechaProximoSeguimiento(p.getFechaProximoSeguimiento())
                .estado(p.getEstado())
                .seguimientos(segDTOs)
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
