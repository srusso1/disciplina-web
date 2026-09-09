package com.disciplina.dto.expediente;

import com.disciplina.domain.enums.EstadoProceso;
import com.disciplina.domain.enums.RolEstudianteIncidente;
import com.disciplina.dto.catalogo.CatalogoFaltaResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidenteHistorialEstudianteDTO {
    private Integer incidenteId;
    private LocalDate fechaIncidente;
    private LocalTime horaIncidente;
    private String lugarNombre;
    private String docenteReportaNombre;
    private EstadoProceso estadoProceso;
    private String descripcionHechos;
    private RolEstudianteIncidente rolEstudiante;
    private Integer anioLectivoSnapshot;
    private String gradoMomento;
    private String grupoMomento;
    private CatalogoFaltaResponseDTO falta;
    private String descargoEstudiante;
    private String compromisoIndividual;
    private Instant createdAt;
}
