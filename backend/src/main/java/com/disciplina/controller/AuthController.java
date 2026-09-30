package com.disciplina.controller;

import com.disciplina.common.exception.DemasiadasPeticionesException;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.UsuarioRepository;
import com.disciplina.dto.auth.JwtResponse;
import com.disciplina.dto.auth.LoginRequest;
import com.disciplina.security.JwtTokenProvider;
import com.disciplina.security.LoginRateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioRepository usuarioRepository;
    private final LoginRateLimiterService loginRateLimiterService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest loginRequest,
                                            HttpServletRequest request,
                                            HttpServletResponse httpResponse) {
        String normalizedUsername = loginRequest.getUsername().trim();
        String clientIp = obtenerIpCliente(request);
        String rateLimitKey = clientIp + "_" + normalizedUsername.toLowerCase();

        if (loginRateLimiterService.isBlocked(rateLimitKey)) {
            long segundosRestantes = loginRateLimiterService.getSegundosRestantesBloqueo(rateLimitKey);
            long minutos = Math.max(1, (segundosRestantes / 60) + 1);
            throw new DemasiadasPeticionesException(
                    "Demasiados intentos fallidos de inicio de sesion. Acceso temporalmente bloqueado por seguridad. Intente nuevamente en " + minutos + " minutos.",
                    segundosRestantes
            );
        }

        log.info("Intento de inicio de sesion para usuario: {} desde IP: {}", normalizedUsername, clientIp);

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            normalizedUsername,
                            loginRequest.getPassword()
                    )
            );
        } catch (Exception ex) {
            loginRateLimiterService.registrarIntentoFallido(rateLimitKey);
            throw ex;
        }

        loginRateLimiterService.registrarLoginExitoso(rateLimitKey);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtTokenProvider.generateToken(authentication);

        Usuario usuario = usuarioRepository.findByUsernameIgnoreCase(normalizedUsername)
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

        boolean esConexionSegura = request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));
        ResponseCookie cookie = ResponseCookie.from("disciplina_token", jwt)
                .httpOnly(true)
                .secure(esConexionSegura)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofMillis(jwtTokenProvider.getExpirationMs()))
                .build();
        httpResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        log.info("Inicio de sesion exitoso para usuario: {} con rol: {}", usuario.getUsername(), usuario.getRol());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse httpResponse) {
        boolean esConexionSegura = request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));
        ResponseCookie cookie = ResponseCookie.from("disciplina_token", "")
                .httpOnly(true)
                .secure(esConexionSegura)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
        httpResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.noContent().build();
    }

    private String obtenerIpCliente(HttpServletRequest request) {
        return com.disciplina.common.util.ClienteIpUtil.obtenerIpCliente(request);
    }
}
