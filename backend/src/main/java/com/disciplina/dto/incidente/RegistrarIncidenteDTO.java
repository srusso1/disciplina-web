package com.disciplina.dto.incidente;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrarIncidenteDTO {

    @NotNull(message = "El docente que reporta el hecho es obligatorio")
    private Integer docenteReportaId;

    @NotNull(message = "El lugar del incidente es obligatorio")
    private Integer lugarId;

    @NotNull(message = "La fecha del incidente es obligatoria")
    @PastOrPresent(message = "La fecha del incidente no puede ser futura")
    private LocalDate fechaIncidente;

    private LocalTime horaIncidente;

    @NotBlank(message = "La descripción fáctica de los hechos es obligatoria")
    @Size(min = 10, max = 5000, message = "La descripción debe tener entre 10 y 5000 caracteres")
    private String descripcionHechos;

    @NotEmpty(message = "Debe registrar al menos un estudiante involucrado")
    @Valid
    private List<InvolucradoRequestDTO> involucrados;
}
