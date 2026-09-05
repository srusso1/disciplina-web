package com.disciplina.dto.expediente;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpedienteEstudianteDTO {
    private Integer id;
    private String documento;
    private String nombres;
    private String apellidos;
    private String nombreCompleto;
    private String nombreAcudiente;
    private String telefonoAcudiente;
    private String emailAcudiente;
    private boolean activo;

    private MatriculaHistorialDTO matriculaActual;
    private List<MatriculaHistorialDTO> historialMatriculas;

    private ResumenConvivenciaDTO resumenConvivencia;
    private List<IncidenteHistorialEstudianteDTO> historialIncidentes;
}
