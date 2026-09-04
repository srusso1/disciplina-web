package com.disciplina.dto.matricula;

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
public class ImportacionMatriculasResumenDTO {
    private int totalFilasLeidas;
    private int estudiantesCreados;
    private int estudiantesActualizados;
    private int matriculasCreadas;
    private int matriculasActualizadas;
    private int anioLectivo;
    private long tiempoProcesamientoMs;

    @Builder.Default
    private List<AdvertenciaFilaDTO> advertencias = new ArrayList<>();

    @Builder.Default
    private List<ErrorFilaDTO> errores = new ArrayList<>();
}
