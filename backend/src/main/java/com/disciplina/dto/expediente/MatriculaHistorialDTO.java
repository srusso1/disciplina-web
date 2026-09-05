package com.disciplina.dto.expediente;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatriculaHistorialDTO {
    private Integer id;
    private Integer anioLectivo;
    private String grado;
    private String grupo;
    private String jornada;
    private String estadoMatricula;
}
