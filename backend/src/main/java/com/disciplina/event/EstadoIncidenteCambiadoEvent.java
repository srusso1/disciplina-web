package com.disciplina.event;

import com.disciplina.domain.enums.EstadoProceso;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstadoIncidenteCambiadoEvent {
    private Integer incidenteId;
    private EstadoProceso estadoAnterior;
    private EstadoProceso nuevoEstado;
}
