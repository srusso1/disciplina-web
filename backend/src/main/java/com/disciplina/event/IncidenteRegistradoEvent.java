package com.disciplina.event;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.enums.RolEstudianteIncidente;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidenteRegistradoEvent {
    private Integer incidenteId;
    private LocalDate fechaIncidente;
    private boolean contieneTipoIII;
    /**
     * Una situación exclusivamente Tipo I se registra para trazabilidad, pero se
     * cierra de inmediato porque su atención corresponde al docente en el aula.
     */
    private boolean exclusivamenteTipoI;
    private String docenteReportanteNombre;
    private String orientadorRegistroNombre;
    private List<InvolucradoResumen> involucrados;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvolucradoResumen {
        private Integer estudianteId;
        private String estudianteNombre;
        private RolEstudianteIncidente rol;
        private ClasificacionLey clasificacionLey;
    }
}
