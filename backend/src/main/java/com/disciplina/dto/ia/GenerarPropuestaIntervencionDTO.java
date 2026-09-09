package com.disciplina.dto.ia;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerarPropuestaIntervencionDTO {

    @NotNull(message = "El ID del estudiante es obligatorio")
    private Integer estudianteId;

    private Integer incidenteOrigenId;
}
