package com.disciplina.dto.rectoria;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradoMetricaDTO {
    private String grado;
    private long cantidad;
    private double porcentaje;
}
