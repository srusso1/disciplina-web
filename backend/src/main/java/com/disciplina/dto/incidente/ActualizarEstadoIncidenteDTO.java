package com.disciplina.dto.incidente;

import com.disciplina.domain.enums.EstadoProceso;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarEstadoIncidenteDTO {

    @NotNull(message = "El nuevo estado del proceso es obligatorio")
    private EstadoProceso estadoProceso;
}
