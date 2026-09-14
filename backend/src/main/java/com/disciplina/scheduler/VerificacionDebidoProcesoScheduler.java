package com.disciplina.scheduler;

import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.enums.SeveridadNotificacion;
import com.disciplina.domain.enums.TipoNotificacion;
import com.disciplina.domain.model.Incidente;
import com.disciplina.domain.model.PlanIntervencion;
import com.disciplina.domain.repository.IncidenteRepository;
import com.disciplina.domain.repository.PlanIntervencionRepository;
import com.disciplina.service.notificacion.NotificacionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class VerificacionDebidoProcesoScheduler {

    private final IncidenteRepository incidenteRepository;
    private final PlanIntervencionRepository planIntervencionRepository;
    private final NotificacionService notificacionService;

    @Scheduled(cron = "0 0 6 * * MON-FRI")
    @Transactional
    public void ejecutarVerificacionesDiarias() {
        log.info("Iniciando tarea programada: Verificacion de terminos del debido proceso y seguimientos pedagogicos");
        verificarTerminosDebidoProceso();
        verificarSeguimientosPlanes();
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
                    "/rectoria/incidentes"
            );

            notificacionService.notificarPorRol(
                    RolUsuario.ROLE_ORIENTADOR,
                    titulo,
                    mensaje,
                    TipoNotificacion.TERMINO_LEGAL,
                    SeveridadNotificacion.ALTA,
                    "/orientador/incidentes"
            );
        }

        if (!incidentesVencidos.isEmpty()) {
            log.warn("Se notificaron alertas de termino legal para {} incidentes en mora", incidentesVencidos.size());
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
                        "/orientador/planes"
                );
            }
        }

        if (!planesParaSeguimiento.isEmpty()) {
            log.info("Se notificaron {} orientadores sobre seguimientos de planes programados", planesParaSeguimiento.size());
        }
    }
}
