package com.disciplina.dto.plan;

import com.disciplina.domain.enums.EstadoPlanIntervencion;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrarSeguimientoDTO {

    @NotBlank(message = "La observación o nota de seguimiento es obligatoria")
    private String observacion;

    private EstadoPlanIntervencion nuevoEstadoPlan;

    private LocalDate nuevaFechaProximoSeguimiento;
}
