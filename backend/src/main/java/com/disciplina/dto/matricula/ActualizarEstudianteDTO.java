package com.disciplina.dto.matricula;

import com.disciplina.domain.enums.EstadoMatricula;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarEstudianteDTO {

    @NotBlank(message = "El documento de identidad es obligatorio")
    @Size(max = 25, message = "El documento no puede superar 25 caracteres")
    private String documento;

    @NotBlank(message = "Los nombres son obligatorios")
    @Size(max = 100, message = "Los nombres no pueden superar 100 caracteres")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100, message = "Los apellidos no pueden superar 100 caracteres")
    private String apellidos;

    @NotBlank(message = "El nombre del acudiente es obligatorio")
    @Size(max = 150, message = "El nombre del acudiente no puede superar 150 caracteres")
    private String nombreAcudiente;

    @NotBlank(message = "El teléfono de contacto del acudiente es obligatorio")
    @Pattern(regexp = "^3\\d{9}$", message = "El teléfono debe ser un número celular colombiano válido de 10 dígitos (ej. 3101234567)")
    private String telefonoAcudiente;

    @NotBlank(message = "El grado es obligatorio")
    private String grado;

    @NotBlank(message = "El grupo es obligatorio")
    private String grupo;

    private String jornada;

    private EstadoMatricula estadoMatricula;

    private Integer anioLectivo;
}