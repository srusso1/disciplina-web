package com.disciplina.dto.incidente;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("descargoEstudiante")
    @JsonAlias({"descargo", "descargoTexto"})
    private String descargoEstudiante;

    @JsonProperty("compromisoIndividual")
    @JsonAlias({"compromisos", "compromiso", "compromisoTexto"})
    private String compromisoIndividual;
}
