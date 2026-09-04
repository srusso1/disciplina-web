package com.disciplina.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {

    private String token;

    @Builder.Default
    private String type = "Bearer";

    private String username;

    private String nombres;

    private String apellidos;

    private String email;

    private String rol;

    private Long expiresIn;
}
