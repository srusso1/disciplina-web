package com.disciplina.dto.citacion;

import com.disciplina.domain.enums.EstadoCitacion;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ActualizarEstadoCitacionDTO {
    @NotNull
    private EstadoCitacion estado;

    @Size(max = 500)
    private String motivo;
}
