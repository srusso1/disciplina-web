package com.disciplina.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private final String secret = "c2VjcmV0X3Bhc3N3b3JkX2Rpc2NpcGxpbmFfd2ViXzIwMjZfaG1hY19zaGEyNTZfc2VjdXJlX2tleV9mb3Jfand0X2F1dGhlbnRpY2F0aW9u";
    private final long expirationMs = 28800000L;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", secret);
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationMs", expirationMs);
        tokenProvider.initKey();
    }

    @Test
    @DisplayName("Debe generar un token JWT valido y extraer sus claims")
    void testGenerateAndParseToken() {
        String username = "rector";
        String role = "ROLE_RECTOR";

        String token = tokenProvider.generateToken(username, role);

        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals(username, tokenProvider.getUsernameFromToken(token));
        assertEquals(role, tokenProvider.getRoleFromToken(token));
    }

    @Test
    @DisplayName("Debe rechazar un token manipulado o invalido")
    void testInvalidToken() {
        String invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.payload";
        assertFalse(tokenProvider.validateToken(invalidToken));
    }

    @Test
    @DisplayName("Debe rechazar tokens nulos o vacios")
    void testNullOrEmptyToken() {
        assertFalse(tokenProvider.validateToken(null));
        assertFalse(tokenProvider.validateToken("   "));
    }

    @Test
    @DisplayName("Debe fallar al iniciar si la clave secreta es menor a 256 bits (fail-fast)")
    void testFailFastOnWeakKey() {
        JwtTokenProvider weakProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(weakProvider, "jwtSecret", "short_weak_key_123");
        ReflectionTestUtils.setField(weakProvider, "jwtExpirationMs", 3600000L);

        assertThrows(IllegalStateException.class, weakProvider::initKey);
    }
}
