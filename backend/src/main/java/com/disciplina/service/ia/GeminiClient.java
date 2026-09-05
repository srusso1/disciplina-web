package com.disciplina.service.ia;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.Optional;

@Component
@Slf4j
public class GeminiClient {

    private final String apiKey;
    private final String model;
    private final int timeoutSeconds;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GeminiClient(
            @Value("${app.gemini.api-key:}") String apiKey,
            @Value("${app.gemini.model:gemini-3.5-flash-lite}") String model,
            @Value("${app.gemini.timeout-seconds:8}") int timeoutSeconds,
            ObjectMapper objectMapper) {
        this.apiKey = (apiKey != null) ? apiKey.trim() : "";
        this.model = (model != null && !model.isBlank()) ? model.trim() : "gemini-3.5-flash-lite";
        this.timeoutSeconds = timeoutSeconds > 0 ? timeoutSeconds : 8;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(this.timeoutSeconds))
                .build();
    }

    public boolean isConfigurado() {
        return !apiKey.isEmpty();
    }

    public Optional<String> generarContenidoEstructurado(String promptSistema, String contenidoUsuario) {
        if (!isConfigurado()) {
            log.warn("Gemini API Key no configurada. Se omitira la inferencia remota y se activara fallback local.");
            return Optional.empty();
        }

        String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                model, apiKey
        );

        try {
            Map<String, Object> requestBody = Map.of(
                    "contents", new Object[]{
                            Map.of("role", "user", "parts", new Object[]{Map.of("text", contenidoUsuario)})
                    },
                    "systemInstruction", Map.of(
                            "parts", new Object[]{Map.of("text", promptSistema)}
                    ),
                    "generationConfig", Map.of(
                            "responseMimeType", "application/json",
                            "temperature", 0.1
                    )
            );

            String jsonPayload = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(timeoutSeconds))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode textNode = root.at("/candidates/0/content/parts/0/text");
                if (!textNode.isMissingNode()) {
                    return Optional.of(textNode.asText());
                }
            } else {
                log.error("Error devuelto por la API de Google Gemini (HTTP {}): {}", response.statusCode(), response.body());
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Llamada a Google Gemini interrumpida: {}", e.getMessage());
        } catch (Exception e) {
            log.warn("Fallo o timeout al conectar con Google Gemini ({}): {}", e.getClass().getSimpleName(), e.getMessage());
        }

        return Optional.empty();
    }
}
