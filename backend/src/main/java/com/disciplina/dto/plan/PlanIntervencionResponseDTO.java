package com.disciplina.dto.plan;

import com.disciplina.domain.enums.EstadoPlanIntervencion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanIntervencionResponseDTO {
    private Integer id;
    private Integer estudianteId;
    private String estudianteDocumento;
    private String estudianteNombre;
    private Integer incidenteOrigenId;
    private Integer orientadorId;
    private String orientadorNombre;
    private String diagnosticoSituacional;
    private String recomendacionesIa;
    private String accionesAcordadas;
    private String compromisoPadres;
    private LocalDate fechaProximoSeguimiento;
    private EstadoPlanIntervencion estado;
    
    @Builder.Default
    private List<SeguimientoCasoResponseDTO> seguimientos = new ArrayList<>();
    
    private Instant createdAt;
    private Instant updatedAt;
}
