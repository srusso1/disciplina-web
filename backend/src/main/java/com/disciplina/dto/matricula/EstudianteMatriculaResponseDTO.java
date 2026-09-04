package com.disciplina.dto.matricula;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstudianteMatriculaResponseDTO {
    private Integer id;
    private String documento;
    private String nombres;
    private String apellidos;
    private String nombreCompleto;
    private String nombreAcudiente;
    private String telefonoAcudiente;
    private String grado;
    private String grupo;
    private String jornada;
    private Integer anioLectivo;
    private String estadoMatricula;
}
