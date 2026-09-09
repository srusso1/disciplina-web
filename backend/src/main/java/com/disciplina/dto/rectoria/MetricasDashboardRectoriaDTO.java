package com.disciplina.dto.rectoria;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetricasDashboardRectoriaDTO {
    private long totalIncidentes;
    private long tipoI;
    private long tipoII;
    private long tipoIII;
    private long totalEstudiantesInvolucrados;
    private long totalEstudiantesReincidentes;
    private double tasaResolucion; // Porcentaje de CERRADO sobre total
    private long casosCerrados;
    private long casosEnTramite;

    private List<EstadoMetricaDTO> distribucionEstados;
    private List<LugarMetricaDTO> focosCriticosLugares;
    private List<GradoMetricaDTO> distribucionPorGrado;
    private List<FranjaHorariaDTO> franjasHorariasCriticas;
    private List<TendenciaMensualDTO> tendenciaMensual;
}
