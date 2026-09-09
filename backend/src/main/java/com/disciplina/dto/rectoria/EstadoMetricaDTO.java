package com.disciplina.dto.rectoria;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstadoMetricaDTO {
    private String estado;
    private String etiqueta;
    private long cantidad;
    private double porcentaje;
}
