package com.disciplina.dto.configuracion;

import com.disciplina.domain.enums.RolUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequestDTO {

    @NotBlank
    @Size(max = 50)
    private String username;

    /** En creación es obligatorio; en actualización, si viene vacío se conserva la contraseña existente. */
    @Size(min = 8, max = 128)
    private String password;

    @NotBlank
    @Size(max = 100)
    private String nombres;

    @NotBlank
    @Size(max = 100)
    private String apellidos;

    @NotBlank
    @Email
    @Size(max = 120)
    private String email;

    @NotNull
    private RolUsuario rol;

    @Builder.Default
    private Boolean activo = true;
}
