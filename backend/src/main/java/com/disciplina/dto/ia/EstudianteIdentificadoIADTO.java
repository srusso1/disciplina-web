package com.disciplina.dto.ia;

import com.disciplina.domain.enums.RolEstudianteIncidente;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstudianteIdentificadoIADTO {
    private String nombreMencionado;
    private Integer estudianteId;
    private String documento;
    private String nombreCompleto;
    private String gradoMomento;
    private String grupoMomento;
    private RolEstudianteIncidente rolSugerido;
    private Integer catalogoFaltaId;
    private String faltaCodigo;
    private String justificacionRol;
}
