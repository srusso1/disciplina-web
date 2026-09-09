package com.disciplina.dto.rectoria;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LugarMetricaDTO {
    private Integer lugarId;
    private String nombreLugar;
    private long cantidad;
    private double porcentaje;
}
