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
import com.disciplina.domain.repository.PlanIntervencionRepository;
import com.disciplina.domain.repository.UsuarioRepository;
import com.disciplina.domain.repository.HistorialEstadoIncidenteRepository;
import com.disciplina.service.notificacion.DiasClaseService;
import com.disciplina.service.notificacion.NotificacionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VerificacionDebidoProcesoSchedulerTest {

    @Mock
    private IncidenteRepository incidenteRepository;

    @Mock
    private PlanIntervencionRepository planIntervencionRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private HistorialEstadoIncidenteRepository historialEstadoIncidenteRepository;

    @Mock
    private DiasClaseService diasClaseService;

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

        scheduler.verificarTerminosDebidoProceso();

        verify(notificacionService).notificarPorRol(
                eq(RolUsuario.ROLE_RECTOR),
                anyString(),
                contains("#42"),
                eq(TipoNotificacion.TERMINO_LEGAL),
                eq(SeveridadNotificacion.ALTA),
                eq("/rectoria/faltas-graves"),
                eq("INCIDENTE"), eq("42"), eq("termino:incidente:42")
        );

        verify(notificacionService).notificarPorRol(
                eq(RolUsuario.ROLE_ORIENTADOR),
                anyString(),
                contains("#42"),
                eq(TipoNotificacion.TERMINO_LEGAL),
                eq(SeveridadNotificacion.ALTA),
                eq("/orientador/incidentes"),
                eq("INCIDENTE"), eq("42"), eq("termino:incidente:42")
        );
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

        scheduler.verificarSeguimientosPlanes();

        verify(notificacionService).crearNotificacion(
                eq(5),
                anyString(),
                contains("#15"),
                eq(TipoNotificacion.SEGUIMIENTO),
                eq(SeveridadNotificacion.ALTA),
                eq("/orientador/planes"),
                eq("PLAN"), eq("15"), eq("seguimiento:plan:15:fecha:" + plan.getFechaProximoSeguimiento())
        );
    }

    @Test
    void inactividadIdentificaCadaOrientadorYSuUltimoRegistro() {
        Usuario orientador = Usuario.builder().id(5).nombres("Ana").apellidos("Gomez")
                .createdAt(OffsetDateTime.parse("2026-09-01T00:00:00-05:00")).build();
        when(usuarioRepository.findByRolAndActivoTrue(RolUsuario.ROLE_ORIENTADOR)).thenReturn(List.of(orientador));
        when(diasClaseService.retrocederDiasClase(any(), eq(2))).thenReturn(LocalDate.now().minusDays(2));
        when(incidenteRepository.fechasUltimoRegistroPorUsuarios(List.of(5)))
                .thenReturn(java.util.Collections.singletonList(new Object[]{5, Instant.parse("2026-09-01T05:00:00Z")}));
        scheduler.verificarInactividadOrientadores();
        verify(notificacionService).notificarPorRol(eq(RolUsuario.ROLE_RECTOR), anyString(), contains("Ana Gomez"),
                eq(TipoNotificacion.INFORMATIVA), eq(SeveridadNotificacion.MEDIA), anyString(),
                eq("USUARIO"), eq("5"), org.mockito.ArgumentMatchers.startsWith("inactividad:orientador:5:desde:"));
    }

    @Test
    void registroRecienteEvitaAlertaDeInactividad() {
        Usuario orientador = Usuario.builder().id(6).nombres("Luis").apellidos("Perez")
                .createdAt(OffsetDateTime.parse("2026-09-01T00:00:00-05:00")).build();
        when(usuarioRepository.findByRolAndActivoTrue(RolUsuario.ROLE_ORIENTADOR)).thenReturn(List.of(orientador));
        when(diasClaseService.retrocederDiasClase(any(), eq(2))).thenReturn(LocalDate.now().minusDays(2));
        when(incidenteRepository.fechasUltimoRegistroPorUsuarios(List.of(6)))
                .thenReturn(java.util.Collections.singletonList(new Object[]{6, Instant.now()}));

        scheduler.verificarInactividadOrientadores();

        verify(notificacionService, org.mockito.Mockito.never()).notificarPorRol(any(), any(), any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    void estadoVencidoUsaUltimoCambioEnClave() {
        Incidente incidente = Incidente.builder().id(42).estadoProceso(EstadoProceso.EN_INDAGACION).build();
        when(diasClaseService.retrocederDiasClase(any(), eq(5))).thenReturn(LocalDate.now().minusDays(7));
        when(incidenteRepository.findIncidentesSinCambioEstadoDesde(any())).thenReturn(List.of(incidente));
        when(historialEstadoIncidenteRepository.obtenerUltimosIds(List.of(42)))
                .thenReturn(java.util.Collections.singletonList(new Object[]{42, 9L}));
        scheduler.verificarEstadosSinActualizar();
        verify(notificacionService).notificarPorRol(eq(RolUsuario.ROLE_RECTOR), anyString(), contains("#42"),
                eq(TipoNotificacion.SEGUIMIENTO), eq(SeveridadNotificacion.ALTA), anyString(),
                eq("INCIDENTE"), eq("42"), eq("estado-pendiente:incidente:42:cambio:9"));
    }
}
