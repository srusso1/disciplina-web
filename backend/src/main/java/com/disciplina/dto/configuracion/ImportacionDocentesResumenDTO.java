package com.disciplina.dto.configuracion;

import com.disciplina.dto.matricula.AdvertenciaFilaDTO;
import com.disciplina.dto.matricula.ErrorFilaDTO;
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
public class ImportacionDocentesResumenDTO {
    private int totalFilas;
    private int docentesCreados;
    private int docentesActualizados;
    @Builder.Default
    private List<AdvertenciaFilaDTO> advertencias = new ArrayList<>();
    @Builder.Default
    private List<ErrorFilaDTO> errores = new ArrayList<>();
    private long tiempoMs;
}
