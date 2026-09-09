package com.disciplina.dto.plan;

import com.disciplina.domain.enums.EstadoPlanIntervencion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarPlanIntervencionDTO {
    private String diagnosticoSituacional;
    private String recomendacionesIa;
    private String accionesAcordadas;
    private String compromisoPadres;
    private LocalDate fechaProximoSeguimiento;
    private EstadoPlanIntervencion estado;
}
