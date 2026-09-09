package com.disciplina.dto.catalogo;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.enums.GravedadInstitucional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CatalogoFaltaResponseDTO {
    private Integer id;
    private String codigo;
    private ClasificacionLey clasificacionLey;
    private GravedadInstitucional gravedadInstitucional;
    private String descripcion;
    private String procedimientoSugerido;
}
