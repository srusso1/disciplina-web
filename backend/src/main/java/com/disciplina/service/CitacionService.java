package com.disciplina.service;

import com.disciplina.common.exception.OperacionInvalidaException;
import com.disciplina.common.exception.RecursoNoEncontradoException;
import com.disciplina.domain.enums.EstadoCitacion;
import com.disciplina.domain.enums.EstadoProceso;
import com.disciplina.domain.model.*;
import com.disciplina.domain.repository.*;
import com.disciplina.dto.catalogo.LugarResponseDTO;
import com.disciplina.dto.citacion.*;
import com.disciplina.dto.incidente.ActualizarEstadoIncidenteDTO;
import com.disciplina.event.CitacionPendienteEnvioEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class CitacionService {
    private final CitacionRepository citacionRepository;
    private final HistorialEstadoCitacionRepository historialRepository;
    private final IncidenteRepository incidenteRepository;
    private final EstudianteRepository estudianteRepository;
    private final LugarRepository lugarRepository;
    private final UsuarioRepository usuarioRepository;
    private final IncidenteEstudianteRepository relacionRepository;
    private final WhatsAppService whatsappService;
    private final IncidenteService incidenteService;
    private final AuditoriaService auditoriaService;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    public CitacionResponseDTO crearCitacion(CrearCitacionDTO dto, String username) {
        Incidente incidente = incidenteRepository.findById(dto.getIncidenteId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Incidente no encontrado con ID: " + dto.getIncidenteId()));
        if (incidente.getEstadoProceso() == EstadoProceso.CERRADO) {
            throw new OperacionInvalidaException("No es posible crear una citación para un incidente cerrado.");
        }

        Estudiante estudiante = estudianteRepository.findById(dto.getEstudianteId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Estudiante no encontrado con ID: " + dto.getEstudianteId()));
        if (relacionRepository.findByIncidenteIdAndEstudianteId(incidente.getId(), estudiante.getId()).isEmpty()) {
            throw new OperacionInvalidaException("El estudiante no participa en el incidente indicado.");
        }
        if (estudiante.getTelefonoAcudiente() == null || estudiante.getTelefonoAcudiente().isBlank()) {
            throw new OperacionInvalidaException("El acudiente del estudiante no tiene teléfono registrado.");
        }

        Lugar lugar = lugarRepository.findById(dto.getLugarCitaId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Lugar no encontrado con ID: " + dto.getLugarCitaId()));
        Usuario usuario = buscarUsuario(username);
        Citacion anterior = obtenerCitacionReprogramada(dto, incidente, estudiante);

        Citacion citacion = citacionRepository.save(Citacion.builder()
                .incidente(incidente).estudiante(estudiante).lugarCita(lugar).creadoPor(usuario)
                .fechaCita(dto.getFechaCita()).horaCita(dto.getHoraCita())
                .asunto(dto.getAsunto().trim()).observaciones(limpiar(dto.getObservaciones()))
                .estado(EstadoCitacion.PROGRAMADA).reprogramadaDesde(anterior).build());

        registrarHistorial(citacion, null, EstadoCitacion.PROGRAMADA,
                anterior == null ? "CREACION" : "REPROGRAMACION", null, usuario);
        if (anterior != null) {
            cambiarEstadoInterno(anterior, EstadoCitacion.CANCELADA,
                    "Reprogramada mediante la citación #" + citacion.getId(), "REPROGRAMACION", usuario);
        }

        solicitarEnvioTrasCommit(citacion);
        if (incidente.getEstadoProceso().ordinal() < EstadoProceso.CITACION_PADRES.ordinal()) {
            incidenteService.actualizarEstado(incidente.getId(),
                    new ActualizarEstadoIncidenteDTO(EstadoProceso.CITACION_PADRES, null), username);
        }

        auditoriaService.registrarAuditoria("CREAR_CITACION", "Citacion", citacion.getId(), null,
                Map.of("estado", citacion.getEstado(), "incidenteId", incidente.getId()), username);
        return toDto(citacionRepository.save(citacion));
    }

    public CitacionResponseDTO actualizarEstado(Long id, ActualizarEstadoCitacionDTO dto, String username) {
        Citacion citacion = buscarCitacion(id);
        Usuario usuario = buscarUsuario(username);
        EstadoCitacion anterior = citacion.getEstado();
        validarTransicion(anterior, dto.getEstado());
        if (Set.of(EstadoCitacion.NO_ASISTIO, EstadoCitacion.CANCELADA).contains(dto.getEstado())
                && limpiar(dto.getMotivo()) == null) {
            throw new OperacionInvalidaException("Debe registrar un motivo para la inasistencia o cancelación.");
        }
        cambiarEstadoInterno(citacion, dto.getEstado(), limpiar(dto.getMotivo()), "CAMBIO_ESTADO", usuario);
        auditoriaService.registrarAuditoria("CAMBIAR_ESTADO_CITACION", "Citacion", id,
                Map.of("estado", anterior), Map.of("estado", dto.getEstado()), username);
        return toDto(citacion);
    }

    public CitacionResponseDTO reenviar(Long id, String username) {
        Citacion citacion = buscarCitacion(id);
        if (citacion.getEstado() == EstadoCitacion.CANCELADA) {
            throw new OperacionInvalidaException("No es posible reenviar una citación cancelada.");
        }
        if (!Set.of("FALLIDO", "NO_ENVIADO").contains(citacion.getWaEstadoEnvio())) {
            throw new OperacionInvalidaException("Solo se pueden reenviar citaciones cuyo envío falló o no fue realizado.");
        }
        solicitarEnvioTrasCommit(citacion);
        Usuario usuario = buscarUsuario(username);
        registrarHistorial(citacion, citacion.getEstado(), citacion.getEstado(), "REENVIO_WHATSAPP", null, usuario);
        auditoriaService.registrarAuditoria("REENVIAR_CITACION", "Citacion", id, null,
                Map.of("waEstadoEnvio", citacion.getWaEstadoEnvio()), username);
        return toDto(citacionRepository.save(citacion));
    }

    @Transactional(readOnly = true)
    public List<CitacionResponseDTO> listarPorIncidente(Integer id) {
        return citacionRepository.findByIncidenteIdOrderByCreatedAtDesc(id).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<CitacionResponseDTO> listarPorEstudiante(Integer id) {
        return citacionRepository.findByEstudianteIdOrderByFechaCitaDesc(id).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<HistorialEstadoCitacionDTO> obtenerHistorial(Long id) {
        buscarCitacion(id);
        return historialRepository.findByCitacionIdOrderByFechaCambioDescIdDesc(id).stream()
                .map(h -> new HistorialEstadoCitacionDTO(h.getId(), h.getEstadoAnterior(), h.getEstadoNuevo(),
                        h.getAccion(), h.getMotivo(), h.getUsuario() == null ? null : h.getUsuario().getNombreCompleto(),
                        h.getFechaCambio())).toList();
    }

    public void procesarWebhookEstado(String messageId, String estado) {
        citacionRepository.findByWaMessageId(messageId).ifPresent(citacion -> {
            Instant ahora = Instant.now();
            switch (estado) {
                case "read" -> {
                    citacion.setWaEstadoEnvio("LEIDO");
                    if (citacion.getWaEntregadoAt() == null) citacion.setWaEntregadoAt(ahora);
                    if (citacion.getWaLeidoAt() == null) citacion.setWaLeidoAt(ahora);
                }
                case "delivered" -> {
                    if (!"LEIDO".equals(citacion.getWaEstadoEnvio())) citacion.setWaEstadoEnvio("ENTREGADO");
                    if (citacion.getWaEntregadoAt() == null) citacion.setWaEntregadoAt(ahora);
                }
                case "failed" -> citacion.setWaEstadoEnvio("FALLIDO");
                default -> { return; }
            }
            citacionRepository.save(citacion);
        });
    }

    public CitacionResponseDTO toDto(Citacion c) {
        return CitacionResponseDTO.builder()
                .id(c.getId()).incidenteId(c.getIncidente().getId()).estudianteId(c.getEstudiante().getId())
                .estudianteNombreCompleto(c.getEstudiante().getNombreCompleto())
                .nombreAcudiente(c.getEstudiante().getNombreAcudiente())
                .telefonoAcudiente(c.getEstudiante().getTelefonoAcudiente())
                .lugarCita(LugarResponseDTO.builder().id(c.getLugarCita().getId())
                        .nombre(c.getLugarCita().getNombre()).descripcion(c.getLugarCita().getDescripcion())
                        .activo(c.getLugarCita().getActivo()).build())
                .fechaCita(c.getFechaCita()).horaCita(c.getHoraCita())
                .asunto(c.getAsunto()).observaciones(c.getObservaciones())
                .estado(c.getEstado().name()).waEstadoEnvio(c.getWaEstadoEnvio())
                .waErrorDetalle(c.getWaErrorDetalle()).waEnviadoAt(texto(c.getWaEnviadoAt()))
                .waEntregadoAt(texto(c.getWaEntregadoAt())).waLeidoAt(texto(c.getWaLeidoAt()))
                .reprogramacionDeId(c.getReprogramadaDesde() == null ? null : c.getReprogramadaDesde().getId())
                .creadoPor(c.getCreadoPor().getNombreCompleto())
                .createdAt(c.getCreatedAt()).updatedAt(c.getUpdatedAt()).build();
    }

    private void solicitarEnvioTrasCommit(Citacion citacion) {
        citacion.setWaEstadoEnvio("NO_ENVIADO");
        citacion.setWaErrorDetalle(null);
        citacion.setWaMessageId(null);
        eventPublisher.publishEvent(new CitacionPendienteEnvioEvent(citacion.getId()));
    }

    private Citacion obtenerCitacionReprogramada(CrearCitacionDTO dto, Incidente incidente, Estudiante estudiante) {
        if (dto.getReprogramacionDeId() == null) return null;
        Citacion anterior = buscarCitacion(dto.getReprogramacionDeId());
        if (!anterior.getIncidente().getId().equals(incidente.getId())
                || !anterior.getEstudiante().getId().equals(estudiante.getId())) {
            throw new OperacionInvalidaException("La citación a reprogramar no corresponde al incidente y estudiante indicados.");
        }
        if (anterior.getEstado() == EstadoCitacion.CANCELADA || anterior.getEstado() == EstadoCitacion.ASISTIO) {
            throw new OperacionInvalidaException("La citación seleccionada ya no puede reprogramarse.");
        }
        return anterior;
    }

    private void validarTransicion(EstadoCitacion actual, EstadoCitacion nuevo) {
        if (actual == nuevo) throw new OperacionInvalidaException("La citación ya se encuentra en ese estado.");
        Map<EstadoCitacion, Set<EstadoCitacion>> permitidas = Map.of(
                EstadoCitacion.PROGRAMADA, Set.of(EstadoCitacion.CONFIRMADA, EstadoCitacion.ASISTIO,
                        EstadoCitacion.NO_ASISTIO, EstadoCitacion.CANCELADA),
                EstadoCitacion.CONFIRMADA, Set.of(EstadoCitacion.ASISTIO, EstadoCitacion.NO_ASISTIO,
                        EstadoCitacion.CANCELADA),
                EstadoCitacion.NO_ASISTIO, Set.of(EstadoCitacion.CANCELADA),
                EstadoCitacion.ASISTIO, Set.of(), EstadoCitacion.CANCELADA, Set.of());
        if (!permitidas.getOrDefault(actual, Set.of()).contains(nuevo)) {
            throw new OperacionInvalidaException("No se puede cambiar una citación de " + actual + " a " + nuevo + ".");
        }
    }

    private void cambiarEstadoInterno(Citacion citacion, EstadoCitacion nuevo, String motivo,
                                      String accion, Usuario usuario) {
        EstadoCitacion anterior = citacion.getEstado();
        citacion.setEstado(nuevo);
        citacionRepository.save(citacion);
        registrarHistorial(citacion, anterior, nuevo, accion, motivo, usuario);
    }

    private void registrarHistorial(Citacion citacion, EstadoCitacion anterior, EstadoCitacion nuevo,
                                    String accion, String motivo, Usuario usuario) {
        historialRepository.save(HistorialEstadoCitacion.builder().citacion(citacion)
                .estadoAnterior(anterior).estadoNuevo(nuevo).accion(accion).motivo(motivo)
                .usuario(usuario).fechaCambio(Instant.now()).build());
    }

    private Citacion buscarCitacion(Long id) {
        return citacionRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Citación no encontrada con ID: " + id));
    }

    private Usuario buscarUsuario(String username) {
        return usuarioRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario autenticado no encontrado: " + username));
    }

    private String limpiar(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String texto(Instant value) {
        return value == null ? null : value.toString();
    }
}
