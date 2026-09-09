package com.disciplina.dto.ia;

import com.disciplina.domain.enums.ClasificacionLey;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NarrativaProcesadaDTO {
    private String hechosEstandarizados;
    private Integer lugarSugeridoId;
    private String lugarNombre;
    private Integer docenteReportaId;
    private String docenteReportaNombre;
    private ClasificacionLey clasificacionLeySugerida;
    private String fechaSugerida;
    private String horaSugerida;
    @Builder.Default
    private List<EstudianteIdentificadoIADTO> estudiantes = new ArrayList<>();
    private boolean asistidoPorIa;
    private String mensajeAsistente;
}
