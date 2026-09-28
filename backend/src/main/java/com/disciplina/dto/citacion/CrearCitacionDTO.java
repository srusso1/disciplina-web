package com.disciplina.dto.citacion;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CrearCitacionDTO { @NotNull private Integer incidenteId; @NotNull private Integer estudianteId; @NotNull private Integer lugarCitaId; @NotNull @FutureOrPresent private LocalDate fechaCita; @NotNull private LocalTime horaCita; @NotBlank @Size(max=500) private String asunto; private String observaciones; }
