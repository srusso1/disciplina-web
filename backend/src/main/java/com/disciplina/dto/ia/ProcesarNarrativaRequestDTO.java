package com.disciplina.dto.ia;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcesarNarrativaRequestDTO {

    @NotBlank(message = "El relato o narrativa no puede estar vacío")
    @Size(min = 10, max = 5000, message = "El relato debe contener entre 10 y 5000 caracteres")
    private String relato;

    private Integer anioLectivo;
}
