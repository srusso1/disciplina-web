package com.disciplina.dto.ia;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropuestaIntervencionIADTO {
    private Integer estudianteId;
    private String estudianteNombre;
    private Integer incidenteOrigenId;
    private String diagnosticoSituacional;
    private String recomendacionesIa;
    private String accionesAcordadasSugeridas;
    private String compromisoPadresSugerido;
    private Integer semanasSeguimientoSugeridas;
    private boolean asistidoPorIa;
    private String advertenciaGobierno;
}
