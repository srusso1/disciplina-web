package com.disciplina.scheduler;

import com.disciplina.domain.enums.EstadoProceso;
import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.enums.SeveridadNotificacion;
import com.disciplina.domain.enums.TipoNotificacion;
import com.disciplina.domain.model.Estudiante;
import com.disciplina.domain.model.Incidente;
import com.disciplina.domain.model.PlanIntervencion;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.IncidenteRepository;
import com.disciplina.domain.repository.NotificacionRepository;
import com.disciplina.domain.repository.PlanIntervencionRepository;
import com.disciplina.service.notificacion.NotificacionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VerificacionDebidoProcesoSchedulerTest {

    @Mock
    private IncidenteRepository incidenteRepository;

    @Mock
    private PlanIntervencionRepository planIntervencionRepository;

    @Mock
    private NotificacionRepository notificacionRepository;

    @Mock
    private NotificacionService notificacionService;

    @InjectMocks
    private VerificacionDebidoProcesoScheduler scheduler;

    @Test
    @DisplayName("Debe notificar a Rector y Orientadores cuando hay incidentes con termino legal vencido")
    void verificarTerminosDebidoProceso_conIncidentesVencidos() {
        Incidente inc = Incidente.builder()
                .id(42)
                .estadoProceso(EstadoProceso.REPORTADO)
                .fechaIncidente(LocalDate.now().minusDays(10))
                .build();

        when(incidenteRepository.findIncidentesConTerminoVencido(any(LocalDate.class)))
                .thenReturn(List.of(inc));
        when(notificacionRepository.existeNotificacionPendienteGlobal(eq(TipoNotificacion.TERMINO_LEGAL), eq("#42")))
                .thenReturn(false);

        scheduler.verificarTerminosDebidoProceso();

        verify(notificacionService).notificarPorRol(
                eq(RolUsuario.ROLE_RECTOR),
                anyString(),
                contains("#42"),
                eq(TipoNotificacion.TERMINO_LEGAL),
                eq(SeveridadNotificacion.ALTA),
                eq("/rectoria/faltas-graves")
        );

        verify(notificacionService).notificarPorRol(
                eq(RolUsuario.ROLE_ORIENTADOR),
                anyString(),
                contains("#42"),
                eq(TipoNotificacion.TERMINO_LEGAL),
                eq(SeveridadNotificacion.ALTA),
                eq("/orientador/incidentes")
        );
    }

    @Test
    @DisplayName("Debe omitir notificaciones de termino si ya existe alerta pendiente no leida (idempotencia)")
    void verificarTerminosDebidoProceso_omiteSiYaExisteAlertaPendiente() {
        Incidente inc = Incidente.builder()
                .id(42)
                .estadoProceso(EstadoProceso.REPORTADO)
                .fechaIncidente(LocalDate.now().minusDays(10))
                .build();

        when(incidenteRepository.findIncidentesConTerminoVencido(any(LocalDate.class)))
                .thenReturn(List.of(inc));
        when(notificacionRepository.existeNotificacionPendienteGlobal(eq(TipoNotificacion.TERMINO_LEGAL), eq("#42")))
                .thenReturn(true);

        scheduler.verificarTerminosDebidoProceso();

        verify(notificacionService, never()).notificarPorRol(any(), any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Debe notificar al orientador correspondiente cuando hay seguimientos programados")
    void verificarSeguimientosPlanes_conPlanesProgramados() {
        Usuario orientador = Usuario.builder().id(5).username("orientador").build();
        Estudiante estudiante = Estudiante.builder().id(12).nombres("Carlos").apellidos("Gomez").build();

        PlanIntervencion plan = PlanIntervencion.builder()
                .id(15)
                .estudiante(estudiante)
                .orientador(orientador)
                .fechaProximoSeguimiento(LocalDate.now())
                .build();

        when(planIntervencionRepository.findPlanesParaSeguimiento(any(LocalDate.class)))
                .thenReturn(List.of(plan));
        when(notificacionService.existeNotificacionNoLeida(5, TipoNotificacion.SEGUIMIENTO, "#15"))
                .thenReturn(false);

        scheduler.verificarSeguimientosPlanes();

        verify(notificacionService).crearNotificacion(
                eq(5),
                anyString(),
                contains("#15"),
                eq(TipoNotificacion.SEGUIMIENTO),
                eq(SeveridadNotificacion.ALTA),
                eq("/orientador/planes")
        );
    }

    @Test
    @DisplayName("Debe omitir notificacion de seguimiento si el orientador ya tiene una alerta activa no leida")
    void verificarSeguimientosPlanes_omiteSiYaExisteAlertaPendiente() {
        Usuario orientador = Usuario.builder().id(5).username("orientador").build();
        Estudiante estudiante = Estudiante.builder().id(12).nombres("Carlos").apellidos("Gomez").build();

        PlanIntervencion plan = PlanIntervencion.builder()
                .id(15)
                .estudiante(estudiante)
                .orientador(orientador)
                .fechaProximoSeguimiento(LocalDate.now())
                .build();

        when(planIntervencionRepository.findPlanesParaSeguimiento(any(LocalDate.class)))
                .thenReturn(List.of(plan));
        when(notificacionService.existeNotificacionNoLeida(5, TipoNotificacion.SEGUIMIENTO, "#15"))
                .thenReturn(true);

        scheduler.verificarSeguimientosPlanes();

        verify(notificacionService, never()).crearNotificacion(anyInt(), any(), any(), any(), any(), any());
    }
}
