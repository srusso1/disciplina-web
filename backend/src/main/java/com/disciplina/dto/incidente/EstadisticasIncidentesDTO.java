package com.disciplina.dto.incidente;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasIncidentesDTO {
    private long totalIncidentes;
    private long tipoI;
    private long tipoII;
    private long tipoIII;
    private long enSeguimiento;
    private long cerrados;
}
