package com.disciplina.dto.plan;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeguimientoCasoResponseDTO {
    private Integer id;
    private Integer planId;
    private Integer usuarioId;
    private String usuarioNombre;
    private String usuarioRol;
    private String observacion;
    private Instant fechaRegistro;
}
