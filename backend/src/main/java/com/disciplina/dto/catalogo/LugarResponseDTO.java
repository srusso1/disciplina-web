package com.disciplina.dto.catalogo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LugarResponseDTO {
    private Integer id;
    private String nombre;
    private String descripcion;
    private Boolean activo;
}
