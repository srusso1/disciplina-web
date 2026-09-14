package com.disciplina.service.notificacion;

import com.disciplina.domain.enums.RolEstudianteIncidente;
import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.enums.SeveridadNotificacion;
import com.disciplina.domain.enums.TipoNotificacion;
import com.disciplina.domain.repository.IncidenteEstudianteRepository;
import com.disciplina.event.IncidenteRegistradoEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificacionEventListener {

    private final NotificacionService notificacionService;
    private final IncidenteEstudianteRepository incidenteEstudianteRepository;

    @EventListener
    @Transactional
    public void onIncidenteRegistrado(IncidenteRegistradoEvent event) {
        log.info("Procesando evento IncidenteRegistradoEvent para incidente #{}", event.getIncidenteId());

        // 1. Si se registra un incidente que contenga involucrados con falta Tipo III:
        // Notificar inmediatamente a todos los usuarios con ROLE_RECTOR
        if (event.isContieneTipoIII()) {
            notificacionService.notificarPorRol(
                    RolUsuario.ROLE_RECTOR,
                    "Activación Ruta Integral Tipo III",
                    "Activación de Ruta Integral: Incidente #" + event.getIncidenteId() + " registrado con presunta falta gravísima Tipo III.",
                    TipoNotificacion.CRITICA,
                    SeveridadNotificacion.CRITICA,
                    "/rectoria/faltas-graves"
            );
        }

        // 2. Notificar a los orientadores (ROLE_ORIENTADOR) del registro de un nuevo incidente
        notificacionService.notificarPorRol(
                RolUsuario.ROLE_ORIENTADOR,
                "Nuevo Incidente Registrado",
                "Nuevo incidente #" + event.getIncidenteId() + " registrado en el sistema.",
                TipoNotificacion.INFORMATIVA,
                SeveridadNotificacion.MEDIA,
                "/orientador/incidentes"
        );

        // 3. Si un alumno acumula >= 2 faltas en las últimas 6 semanas como víctima (RolEstudianteIncidente.VICTIMA),
        // emitir una alerta de presunto acoso sistemático al orientador y rector.
        if (event.getInvolucrados() != null) {
            LocalDate limiteSemanas = LocalDate.now().minusWeeks(6);
            for (IncidenteRegistradoEvent.InvolucradoResumen inv : event.getInvolucrados()) {
                if (inv.getRol() == RolEstudianteIncidente.VICTIMA && inv.getEstudianteId() != null) {
                    long victimizaciones = incidenteEstudianteRepository
                            .countByEstudianteIdAndRolEstudianteAndFechaIncidenteAfter(
                                    inv.getEstudianteId(),
                                    RolEstudianteIncidente.VICTIMA,
                                    limiteSemanas
                            );

                    if (victimizaciones >= 2) {
                        String alertaTitulo = "Alerta de Presunto Acoso Escolar";
                        String alertaMensaje = "El estudiante " + inv.getEstudianteNombre()
                                + " acumula " + victimizaciones + " registros como víctima en las últimas 6 semanas. Se sugiere activación inmediata de protocolo de protección.";

                        notificacionService.notificarPorRol(
                                RolUsuario.ROLE_RECTOR,
                                alertaTitulo,
                                alertaMensaje,
                                TipoNotificacion.CRITICA,
                                SeveridadNotificacion.ALTA,
                                "/rectoria/incidentes"
                        );

                        notificacionService.notificarPorRol(
                                RolUsuario.ROLE_ORIENTADOR,
                                alertaTitulo,
                                alertaMensaje,
                                TipoNotificacion.CRITICA,
                                SeveridadNotificacion.ALTA,
                                "/orientador/expedientes"
                        );
                    }
                }
            }
        }
    }
}
