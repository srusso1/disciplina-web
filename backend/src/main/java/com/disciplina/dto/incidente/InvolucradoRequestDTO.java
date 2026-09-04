package com.disciplina.dto.incidente;

import com.disciplina.domain.enums.RolEstudianteIncidente;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvolucradoRequestDTO {

    @NotNull(message = "El ID del estudiante es obligatorio")
    private Integer estudianteId;

    private Integer catalogoFaltaId;

    @NotNull(message = "El rol del estudiante es obligatorio (AGRESOR_PRINCIPAL, PARTICIPE, VICTIMA, TESTIGO)")
    private RolEstudianteIncidente rolEstudiante;

    private String descargoEstudiante;

    private String compromisoIndividual;
}
