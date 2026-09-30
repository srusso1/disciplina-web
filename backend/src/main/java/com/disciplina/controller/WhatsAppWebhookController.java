package com.disciplina.controller;

import com.disciplina.config.WhatsAppProperties;
import com.disciplina.service.CitacionService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Slf4j
@RestController
@RequestMapping("/api/v1/whatsapp/webhook")
@RequiredArgsConstructor
public class WhatsAppWebhookController {
    private final WhatsAppProperties properties;
    private final CitacionService citacionService;
    private final ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<String> verify(
            @RequestParam(name = "hub.mode", required = false) String mode,
            @RequestParam(name = "hub.verify_token", required = false) String token,
            @RequestParam(name = "hub.challenge", required = false) String challenge) {
        boolean valid = "subscribe".equals(mode)
                && !isBlank(properties.getWebhookVerifyToken())
                && MessageDigest.isEqual(bytes(token), bytes(properties.getWebhookVerifyToken()));
        return valid ? ResponseEntity.ok(challenge) : ResponseEntity.status(403).build();
    }

    @PostMapping
    public ResponseEntity<Void> receive(
            @RequestHeader(value = "X-Hub-Signature-256", required = false) String signature,
            @RequestBody String body) {
        try {
            if (!validSignature(signature, body)) {
                log.warn("Webhook de WhatsApp rechazado por firma inválida o App Secret ausente.");
                return ResponseEntity.status(401).build();
            }
            JsonNode entries = objectMapper.readTree(body).path("entry");
            for (JsonNode entry : entries) {
                for (JsonNode change : entry.path("changes")) {
                    for (JsonNode status : change.path("value").path("statuses")) {
                        String messageId = status.path("id").asText();
                        String state = status.path("status").asText();
                        if (!messageId.isBlank() && !state.isBlank()) {
                            citacionService.procesarWebhookEstado(messageId, state);
                        }
                    }
                }
            }
            return ResponseEntity.ok().build();
        } catch (Exception exception) {
            log.error("No fue posible procesar el webhook de WhatsApp.", exception);
            return ResponseEntity.badRequest().build();
        }
    }

    private boolean validSignature(String signature, String body) throws Exception {
        if (isBlank(properties.getAppSecret()) || signature == null || !signature.startsWith("sha256=")) {
            return false;
        }
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(bytes(properties.getAppSecret()), "HmacSHA256"));
        StringBuilder hash = new StringBuilder("sha256=");
        for (byte value : mac.doFinal(body.getBytes(StandardCharsets.UTF_8))) {
            hash.append(String.format("%02x", value));
        }
        return MessageDigest.isEqual(bytes(hash.toString()), bytes(signature));
    }

    private static byte[] bytes(String value) {
        return value == null ? new byte[0] : value.getBytes(StandardCharsets.UTF_8);
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
