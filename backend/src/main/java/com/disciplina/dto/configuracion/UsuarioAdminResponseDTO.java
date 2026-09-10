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
public class UsuarioAdminResponseDTO {

    private Integer id;
    private String username;
    private String nombres;
    private String apellidos;
    private String email;
    /** Nombre del enum RolUsuario (ej: ROLE_RECTOR). */
    private String rol;
    private Boolean activo;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
