package com.disciplina.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class LoginRateLimiterService {

    private final int maxAttempts;
    private final long blockDurationMinutes;
    private final ConcurrentHashMap<String, AttemptData> attemptsCache = new ConcurrentHashMap<>();

    public LoginRateLimiterService(
            @Value("${app.security.login.max-attempts:5}") int maxAttempts,
            @Value("${app.security.login.block-duration-minutes:15}") long blockDurationMinutes) {
        this.maxAttempts = maxAttempts > 0 ? maxAttempts : 5;
        this.blockDurationMinutes = blockDurationMinutes > 0 ? blockDurationMinutes : 15;
    }

    public boolean isBlocked(String key) {
        limpiarExpirados();
        AttemptData data = attemptsCache.get(key);
        if (data == null) {
            return false;
        }
        if (data.attempts >= maxAttempts) {
            long diffSeconds = Instant.now().getEpochSecond() - data.lastAttempt.getEpochSecond();
            long blockSeconds = blockDurationMinutes * 60;
            if (diffSeconds < blockSeconds) {
                return true;
            } else {
                attemptsCache.remove(key);
                return false;
            }
        }
        return false;
    }

    public void registrarIntentoFallido(String key) {
        limpiarExpirados();
        attemptsCache.compute(key, (k, v) -> {
            if (v == null) {
                return new AttemptData(1, Instant.now());
            }
            return new AttemptData(v.attempts + 1, Instant.now());
        });
        AttemptData current = attemptsCache.get(key);
        log.warn("Intento fallido registrado para clave [{}]. Total intentos: {} de {}",
                key, current != null ? current.attempts : 1, maxAttempts);
    }

    public void registrarLoginExitoso(String key) {
        attemptsCache.remove(key);
    }

    public long getSegundosRestantesBloqueo(String key) {
        AttemptData data = attemptsCache.get(key);
        if (data == null) {
            return 0;
        }
        long diffSeconds = Instant.now().getEpochSecond() - data.lastAttempt.getEpochSecond();
        long blockSeconds = blockDurationMinutes * 60;
        return Math.max(0, blockSeconds - diffSeconds);
    }

    public void resetParaPruebas() {
        attemptsCache.clear();
    }

    private void limpiarExpirados() {
        if (attemptsCache.size() > 500) {
            Instant ahora = Instant.now();
            long blockSeconds = blockDurationMinutes * 60;
            attemptsCache.entrySet().removeIf(entry ->
                    (ahora.getEpochSecond() - entry.getValue().lastAttempt.getEpochSecond()) > blockSeconds);
        }
    }

    private record AttemptData(int attempts, Instant lastAttempt) {}
}
