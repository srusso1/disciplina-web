package com.disciplina.dto.incidente;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarDescargoDTO {

    @NotBlank(message = "El descargo del estudiante es obligatorio")
    private String descargoEstudiante;

    private String compromisoIndividual;
}
