package com.disciplina.dto.configuracion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AreaDesempenoResponseDTO {
    private Integer id;
    private String nombre;
    private String descripcion;
    private Boolean activo;
    private OffsetDateTime createdAt;
}
