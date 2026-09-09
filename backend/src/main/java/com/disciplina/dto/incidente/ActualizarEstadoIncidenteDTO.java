package com.disciplina.dto.incidente;

import com.disciplina.domain.enums.EstadoProceso;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("estadoProceso")
    @JsonAlias({"nuevoEstado", "estado"})
    private EstadoProceso estadoProceso;

    @JsonProperty("observaciones")
    @JsonAlias({"observacion", "nota"})
    private String observaciones;

    public ActualizarEstadoIncidenteDTO(EstadoProceso estadoProceso) {
        this.estadoProceso = estadoProceso;
    }
}
