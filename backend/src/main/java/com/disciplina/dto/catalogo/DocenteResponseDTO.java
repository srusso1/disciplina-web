package com.disciplina.dto.catalogo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String areaDesempeno;
}
