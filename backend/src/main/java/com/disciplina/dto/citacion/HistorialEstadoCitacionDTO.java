package com.disciplina.dto.citacion;

import com.disciplina.domain.enums.EstadoCitacion;

import java.time.Instant;

public record HistorialEstadoCitacionDTO(
        Long id,
        EstadoCitacion estadoAnterior,
        EstadoCitacion estadoNuevo,
        String accion,
        String motivo,
        String usuario,
        Instant fechaCambio) {
}
