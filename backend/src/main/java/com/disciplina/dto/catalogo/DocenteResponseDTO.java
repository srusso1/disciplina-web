package com.disciplina.dto.catalogo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.disciplina.dto.configuracion.AreaDesempenoResponseDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocenteResponseDTO {
    private Integer id;
    private String documento;
    private String nombres;
    private String apellidos;
    private String nombreCompleto;
    private Integer areaDesempenoId;
    private String areaDesempeno;
    private AreaDesempenoResponseDTO areaDesempenoDetalle;
    private Boolean activo;
}
