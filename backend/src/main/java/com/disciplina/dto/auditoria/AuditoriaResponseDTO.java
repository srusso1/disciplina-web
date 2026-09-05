package com.disciplina.dto.auditoria;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditoriaResponseDTO {
    private Long id;
    private Integer usuarioId;
    private String usuarioUsername;
    private String usuarioNombreCompleto;
    private String usuarioRol;
    private String accion;
    private String entidad;
    private String entidadId;
    private String datosAnteriores;
    private String datosNuevos;
    private String ipOrigen;
    private Instant createdAt;
}
