package com.disciplina.service.notificacion;

import com.disciplina.domain.enums.RolEstudianteIncidente;
import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.enums.SeveridadNotificacion;
import com.disciplina.domain.enums.TipoNotificacion;
import com.disciplina.domain.repository.IncidenteEstudianteRepository;
import com.disciplina.event.IncidenteRegistradoEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificacionEventListener {

    private final NotificacionService notificacionService;
    private final IncidenteEstudianteRepository incidenteEstudianteRepository;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onIncidenteRegistrado(IncidenteRegistradoEvent event) {
        try {
            log.info("Procesando notificaciones para IncidenteRegistradoEvent #{}" , event.getIncidenteId());

            // 1. Si se registra un incidente con presunta falta Tipo III:
            // Notificar inmediatamente al Rector
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

            // 2. Notificar a los orientadores del registro de un nuevo incidente
            notificacionService.notificarPorRol(
                    RolUsuario.ROLE_ORIENTADOR,
                    "Nuevo Incidente Registrado",
                    "Nuevo incidente #" + event.getIncidenteId() + " registrado en el sistema.",
                    TipoNotificacion.INFORMATIVA,
                    SeveridadNotificacion.MEDIA,
                    "/orientador/incidentes"
            );

            // 3. Alerta de presunto acoso si la víctima acumula >= 2 faltas en 6 semanas
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
                                    "/rectoria/faltas-graves"
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
        } catch (Exception e) {
            // Salvaguarda: el fallo en la generacion de una notificacion secundaria nunca debe romper la transaccion principal
            log.error("Error no bloqueante procesando notificaciones para incidente #{}", event.getIncidenteId(), e);
        }
    }
}
