package com.disciplina.controller;

import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.UsuarioRepository;
import com.disciplina.dto.auth.JwtResponse;
import com.disciplina.dto.auth.LoginRequest;
import com.disciplina.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping({"/auth", "/api/v1/auth"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Intento de inicio de sesion para usuario: {}", loginRequest.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername().trim(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtTokenProvider.generateToken(authentication);

        Usuario usuario = usuarioRepository.findByUsername(loginRequest.getUsername().trim())
                .orElseThrow(() -> new IllegalStateException("Usuario autenticado no encontrado en base de datos"));

        JwtResponse response = JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .username(usuario.getUsername())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .email(usuario.getEmail())
                .rol(usuario.getRol().name())
                .expiresIn(jwtTokenProvider.getExpirationMs())
                .build();

        log.info("Inicio de sesion exitoso para usuario: {} con rol: {}", usuario.getUsername(), usuario.getRol());
        return ResponseEntity.ok(response);
    }
}
