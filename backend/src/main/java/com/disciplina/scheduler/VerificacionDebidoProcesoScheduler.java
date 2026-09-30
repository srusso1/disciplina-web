package com.disciplina.scheduler;

import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.enums.SeveridadNotificacion;
import com.disciplina.domain.enums.TipoNotificacion;
import com.disciplina.domain.model.Incidente;
import com.disciplina.domain.model.PlanIntervencion;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.IncidenteRepository;
import com.disciplina.domain.repository.UsuarioRepository;
import com.disciplina.domain.repository.HistorialEstadoIncidenteRepository;
import com.disciplina.service.notificacion.DiasClaseService;
import com.disciplina.domain.repository.PlanIntervencionRepository;
import com.disciplina.service.notificacion.NotificacionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class VerificacionDebidoProcesoScheduler {

    private final IncidenteRepository incidenteRepository;
    private final PlanIntervencionRepository planIntervencionRepository;
    private final UsuarioRepository usuarioRepository;
    private final HistorialEstadoIncidenteRepository historialEstadoIncidenteRepository;
    private final DiasClaseService diasClaseService;
    private final NotificacionService notificacionService;
    private static final ZoneId ZONA = ZoneId.of("America/Bogota");
    private static final int DIAS_INACTIVIDAD = 2;
    private static final int DIAS_ESTADO_SIN_CAMBIO = 5;

    @Scheduled(cron = "0 0 6 * * MON-FRI", zone = "America/Bogota")
    @Transactional
    public void ejecutarVerificacionesDiarias() {
        log.info("Iniciando tarea programada: Verificacion de terminos del debido proceso y seguimientos pedagogicos");
        verificarTerminosDebidoProceso();
        verificarSeguimientosPlanes();
        verificarInactividadOrientadores();
        verificarEstadosSinActualizar();
        log.info("Finalizada tarea programada diaria de verificacion");
    }

    public void verificarTerminosDebidoProceso() {
        LocalDate fechaLimite = LocalDate.now().minusDays(8);
        List<Incidente> incidentesVencidos = incidenteRepository.findIncidentesConTerminoVencido(fechaLimite);

        for (Incidente i : incidentesVencidos) {
            String titulo = "Alerta Término Legal Vencido";
            String mensaje = "Vencimiento de término: El incidente #" + i.getId()
                    + " supera 8 días en estado " + i.getEstadoProceso()
                    + " sin recepción formal de descargos o resolución.";

            notificacionService.notificarPorRol(
                    RolUsuario.ROLE_RECTOR,
                    titulo,
                    mensaje,
                    TipoNotificacion.TERMINO_LEGAL,
                    SeveridadNotificacion.ALTA,
                    "/rectoria/faltas-graves",
                    "INCIDENTE", i.getId().toString(), "termino:incidente:" + i.getId()
            );

            notificacionService.notificarPorRol(
                    RolUsuario.ROLE_ORIENTADOR,
                    titulo,
                    mensaje,
                    TipoNotificacion.TERMINO_LEGAL,
                    SeveridadNotificacion.ALTA,
                    "/orientador/incidentes",
                    "INCIDENTE", i.getId().toString(), "termino:incidente:" + i.getId()
            );
        }

        if (!incidentesVencidos.isEmpty()) {
            log.warn("Se procesaron alertas de termino legal para {} incidentes en mora", incidentesVencidos.size());
        }
    }

    public void verificarSeguimientosPlanes() {
        LocalDate hoy = LocalDate.now();
        List<PlanIntervencion> planesParaSeguimiento = planIntervencionRepository.findPlanesParaSeguimiento(hoy);

        for (PlanIntervencion plan : planesParaSeguimiento) {
            if (plan.getOrientador() != null) {
                String titulo = "Compromiso de Seguimiento Pedagógico";
                String mensaje = "Seguimiento pedagógico programado: El plan #" + plan.getId()
                        + " del estudiante " + plan.getEstudiante().getNombres() + " " + plan.getEstudiante().getApellidos()
                        + " requiere sesión de seguimiento.";

                notificacionService.crearNotificacion(
                        plan.getOrientador().getId(),
                        titulo,
                        mensaje,
                        TipoNotificacion.SEGUIMIENTO,
                        SeveridadNotificacion.ALTA,
                        "/orientador/planes",
                        "PLAN", plan.getId().toString(),
                        "seguimiento:plan:" + plan.getId() + ":fecha:" + plan.getFechaProximoSeguimiento()
                );
            }
        }

        if (!planesParaSeguimiento.isEmpty()) {
            log.info("Se procesaron {} seguimientos de planes programados", planesParaSeguimiento.size());
        }
    }

    public void verificarInactividadOrientadores() {
        LocalDate limite = diasClaseService.retrocederDiasClase(LocalDate.now(ZONA), DIAS_INACTIVIDAD);
        List<Usuario> orientadores = usuarioRepository.findByRolAndActivoTrue(RolUsuario.ROLE_ORIENTADOR);
        if (orientadores.isEmpty()) {
            return;
        }
        Map<Integer, Instant> ultimosRegistros = incidenteRepository.fechasUltimoRegistroPorUsuarios(
                orientadores.stream().map(Usuario::getId).toList()).stream()
                .collect(Collectors.toMap(fila -> (Integer) fila[0], fila -> (Instant) fila[1]));
        for (Usuario orientador : orientadores) {
            Instant ultimoRegistro = ultimosRegistros.get(orientador.getId());
            Instant referencia = ultimoRegistro != null ? ultimoRegistro : orientador.getCreatedAt().toInstant();
            if (!referencia.atZone(ZONA).toLocalDate().isBefore(limite)) {
                continue;
            }
            notificacionService.notificarPorRol(RolUsuario.ROLE_RECTOR,
                    "Orientador sin registros recientes",
                    "El orientador " + orientador.getNombreCompleto() + " no registra incidentes desde "
                            + referencia.atZone(ZONA).toLocalDate() + ".",
                    TipoNotificacion.INFORMATIVA, SeveridadNotificacion.MEDIA,
                    "/rectoria/bitacora-notificaciones", "USUARIO", orientador.getId().toString(),
                    "inactividad:orientador:" + orientador.getId() + ":desde:" + referencia.toEpochMilli());
        }
    }

    public void verificarEstadosSinActualizar() {
        LocalDate limite = diasClaseService.retrocederDiasClase(LocalDate.now(ZONA), DIAS_ESTADO_SIN_CAMBIO);
        Instant inicioLimite = limite.atStartOfDay(ZONA).toInstant();
        List<Incidente> pendientes = incidenteRepository.findIncidentesSinCambioEstadoDesde(inicioLimite);
        if (pendientes.isEmpty()) {
            return;
        }
        Map<Integer, Long> ultimosIds = historialEstadoIncidenteRepository.obtenerUltimosIds(
                pendientes.stream().map(Incidente::getId).toList()).stream()
                .collect(Collectors.toMap(fila -> (Integer) fila[0], fila -> (Long) fila[1]));
        for (Incidente incidente : pendientes) {
            Long ultimoId = ultimosIds.get(incidente.getId());
            if (ultimoId == null) continue;
            notificacionService.notificarPorRol(RolUsuario.ROLE_RECTOR,
                    "Expediente sin cambio de estado",
                    "El incidente #" + incidente.getId() + " permanece en estado "
                            + incidente.getEstadoProceso() + " sin cambios recientes.",
                    TipoNotificacion.SEGUIMIENTO, SeveridadNotificacion.ALTA,
                    "/rectoria/bitacora-notificaciones", "INCIDENTE", incidente.getId().toString(),
                    "estado-pendiente:incidente:" + incidente.getId() + ":cambio:" + ultimoId);
        }
    }
}
