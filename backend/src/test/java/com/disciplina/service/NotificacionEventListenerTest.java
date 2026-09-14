package com.disciplina.service;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.enums.RolEstudianteIncidente;
import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.enums.SeveridadNotificacion;
import com.disciplina.domain.enums.TipoNotificacion;
import com.disciplina.domain.repository.IncidenteEstudianteRepository;
import com.disciplina.event.IncidenteRegistradoEvent;
import com.disciplina.service.notificacion.NotificacionEventListener;
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
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificacionEventListenerTest {

    @Mock
    private NotificacionService notificacionService;

    @Mock
    private IncidenteEstudianteRepository incidenteEstudianteRepository;

    @InjectMocks
    private NotificacionEventListener listener;

    @Test
    @DisplayName("Debe emitir alerta critica a Rector si el incidente contiene falta Tipo III")
    void onIncidenteRegistrado_conTipoIII() {
        IncidenteRegistradoEvent event = IncidenteRegistradoEvent.builder()
                .incidenteId(50)
                .fechaIncidente(LocalDate.now())
                .contieneTipoIII(true)
                .involucrados(List.of(
                        IncidenteRegistradoEvent.InvolucradoResumen.builder()
                                .estudianteId(1)
                                .estudianteNombre("Pedro Perez")
                                .rol(RolEstudianteIncidente.AGRESOR_PRINCIPAL)
                                .clasificacionLey(ClasificacionLey.TIPO_III)
                                .build()
                ))
                .build();

        listener.onIncidenteRegistrado(event);

        verify(notificacionService).notificarPorRol(
                eq(RolUsuario.ROLE_RECTOR),
                contains("Ruta Integral Tipo III"),
                contains("Incidente #50"),
                eq(TipoNotificacion.CRITICA),
                eq(SeveridadNotificacion.CRITICA),
                eq("/rectoria/faltas-graves")
        );

        verify(notificacionService).notificarPorRol(
                eq(RolUsuario.ROLE_ORIENTADOR),
                contains("Nuevo Incidente"),
                contains("#50"),
                eq(TipoNotificacion.INFORMATIVA),
                eq(SeveridadNotificacion.MEDIA),
                eq("/orientador/incidentes")
        );
    }

    @Test
    @DisplayName("Debe alertar de presunto acoso si la victima acumula >= 2 registros en 6 semanas")
    void onIncidenteRegistrado_victimaReincidente() {
        IncidenteRegistradoEvent event = IncidenteRegistradoEvent.builder()
                .incidenteId(51)
                .fechaIncidente(LocalDate.now())
                .contieneTipoIII(false)
                .involucrados(List.of(
                        IncidenteRegistradoEvent.InvolucradoResumen.builder()
                                .estudianteId(9)
                                .estudianteNombre("Ana Gomez")
                                .rol(RolEstudianteIncidente.VICTIMA)
                                .clasificacionLey(null)
                                .build()
                ))
                .build();

        when(incidenteEstudianteRepository.countByEstudianteIdAndRolEstudianteAndFechaIncidenteAfter(
                eq(9), eq(RolEstudianteIncidente.VICTIMA), any(LocalDate.class)
        )).thenReturn(2L);

        listener.onIncidenteRegistrado(event);

        verify(notificacionService).notificarPorRol(
                eq(RolUsuario.ROLE_RECTOR),
                contains("Acoso Escolar"),
                contains("Ana Gomez"),
                eq(TipoNotificacion.CRITICA),
                eq(SeveridadNotificacion.ALTA),
                eq("/rectoria/incidentes")
        );

        verify(notificacionService).notificarPorRol(
                eq(RolUsuario.ROLE_ORIENTADOR),
                contains("Acoso Escolar"),
                contains("Ana Gomez"),
                eq(TipoNotificacion.CRITICA),
                eq(SeveridadNotificacion.ALTA),
                eq("/orientador/expedientes")
        );
    }
}
