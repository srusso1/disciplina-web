package com.disciplina.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class BCryptHashTest {

    @Test
    void generateAndVerifyBCryptHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String rawPassword = "Password123!";
        String hash = encoder.encode(rawPassword);
        System.out.println("BCRYPT_HASH_FACTOR_12=" + hash);
        assertTrue(encoder.matches(rawPassword, hash));
    }
}
