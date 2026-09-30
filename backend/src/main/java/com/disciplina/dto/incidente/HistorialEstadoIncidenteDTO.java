package com.disciplina.dto.incidente;

import com.disciplina.domain.enums.EstadoProceso;
import java.time.Instant;

public record HistorialEstadoIncidenteDTO(Long id, EstadoProceso estadoAnterior,
        EstadoProceso estadoNuevo, String usuario, Instant fechaCambio, boolean lineaBase) {
}
