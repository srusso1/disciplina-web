package com.disciplina.dto.configuracion;

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
public class IncidenteAdminResponseDTO {

    private Integer id;
    private LocalDate fechaIncidente;
    private LocalTime horaIncidente;
    private String docenteReportaNombre;
    private String lugarNombre;
    private String estadoProceso;
    private int involucradosCount;
    private Instant createdAt;
}
