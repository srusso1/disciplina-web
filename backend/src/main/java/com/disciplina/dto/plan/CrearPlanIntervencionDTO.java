package com.disciplina.dto.plan;

import com.disciplina.domain.enums.EstadoPlanIntervencion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrearPlanIntervencionDTO {

    @NotNull(message = "El estudianteId es obligatorio")
    private Integer estudianteId;

    @NotNull(message = "El incidenteOrigenId es obligatorio para formular un plan de intervención formativa")
    private Integer incidenteOrigenId;

    @NotBlank(message = "El diagnóstico situacional es obligatorio")
    private String diagnosticoSituacional;

    private String recomendacionesIa;

    @NotBlank(message = "Las acciones formativas acordadas son obligatorias")
    private String accionesAcordadas;

    private String compromisoPadres;

    private LocalDate fechaProximoSeguimiento;

    @Builder.Default
    private EstadoPlanIntervencion estado = EstadoPlanIntervencion.EN_SEGUIMIENTO;
}
