package com.disciplina.service;

import com.disciplina.config.WhatsAppProperties;
import com.disciplina.domain.model.Citacion;
import com.disciplina.domain.repository.MatriculaEstudianteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WhatsAppService {
    private final WhatsAppProperties properties;
    private final MatriculaEstudianteRepository matriculaRepository;
    private final RestClient.Builder restClientBuilder;

    public WhatsAppEnvioResultado enviarCitacion(Citacion citacion) {
        String configurationError = validarConfiguracion();
        if (configurationError != null) {
            return new WhatsAppEnvioResultado(false, null, configurationError);
        }

        try {
            String phone = normalizarTelefono(citacion.getEstudiante().getTelefonoAcudiente());
            var matricula = matriculaRepository.findByEstudianteAndAnioLectivo(
                    citacion.getEstudiante(), LocalDate.now().getYear());
            String grado = matricula.map(value -> value.getGrado() + " - " + value.getGrupo())
                    .orElse("Sin matrícula registrada");
            String rol = citacion.getCreadoPor().getRol().name().equals("ROLE_RECTOR")
                    ? "Rectoría y Convivencia Escolar" : "Orientación Escolar";
            String falta = citacion.getIncidente().getInvolucrados().stream()
                    .filter(value -> value.getEstudiante().getId().equals(citacion.getEstudiante().getId())
                            && value.getCatalogoFalta() != null)
                    .findFirst()
                    .map(value -> value.getCatalogoFalta().getClasificacionLey() + " - "
                            + value.getCatalogoFalta().getGravedadInstitucional())
                    .orElse("No especificada");

            List<String> params = List.of(
                    citacion.getEstudiante().getNombreAcudiente(), rol,
                    citacion.getEstudiante().getNombreCompleto(), grado,
                    "#INC-" + citacion.getIncidente().getId(), falta,
                    citacion.getFechaCita().format(DateTimeFormatter.ofPattern(
                            "dd 'de' MMMM 'de' yyyy", new Locale("es", "CO"))),
                    citacion.getHoraCita().format(DateTimeFormatter.ofPattern("hh:mm a", Locale.US)),
                    citacion.getLugarCita().getNombre(), citacion.getAsunto());

            Map<String, Object> body = Map.of(
                    "messaging_product", "whatsapp", "to", phone, "type", "template",
                    "template", Map.of(
                            "name", properties.getTemplateName(),
                            "language", Map.of("code", properties.getTemplateLanguage()),
                            "components", List.of(Map.of(
                                    "type", "body",
                                    "parameters", params.stream()
                                            .map(value -> Map.of("type", "text", "text", value))
                                            .toList()))));

            Map<?, ?> response = restClientBuilder.build().post()
                    .uri(properties.getApiUrl() + "/" + properties.getPhoneNumberId() + "/messages")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getAccessToken())
                    .contentType(MediaType.APPLICATION_JSON).body(body).retrieve().body(Map.class);

            Object messages = response == null ? null : response.get("messages");
            String messageId = messages instanceof List<?> list && !list.isEmpty()
                    && list.get(0) instanceof Map<?, ?> first ? String.valueOf(first.get("id")) : null;
            return messageId == null
                    ? new WhatsAppEnvioResultado(false, null, "Meta no retornó un identificador de mensaje.")
                    : new WhatsAppEnvioResultado(true, messageId, null);
        } catch (RestClientResponseException exception) {
            String detail = "Meta WhatsApp respondió HTTP " + exception.getStatusCode().value()
                    + ": " + exception.getResponseBodyAsString();
            log.warn("No se pudo enviar la citación por WhatsApp: {}", detail);
            return new WhatsAppEnvioResultado(false, null, detail);
        } catch (Exception exception) {
            log.error("Error inesperado enviando la citación por WhatsApp", exception);
            return new WhatsAppEnvioResultado(false, null, exception.getMessage());
        }
    }

    private String validarConfiguracion() {
        if (isBlank(properties.getApiUrl())) return "Falta configurar WHATSAPP_API_URL.";
        if (isBlank(properties.getAccessToken())) return "Falta configurar WHATSAPP_ACCESS_TOKEN.";
        if (isBlank(properties.getPhoneNumberId())) return "Falta configurar WHATSAPP_PHONE_NUMBER_ID.";
        if (isBlank(properties.getTemplateName())) return "Falta configurar WHATSAPP_TEMPLATE_NAME.";
        if (isBlank(properties.getTemplateLanguage())) return "Falta configurar WHATSAPP_TEMPLATE_LANGUAGE.";
        return null;
    }

    private String normalizarTelefono(String value) {
        String phone = value == null ? "" : value.replaceAll("\\D", "");
        if (phone.length() == 10) phone = "57" + phone;
        if (phone.length() < 11 || phone.length() > 15) {
            throw new IllegalArgumentException("El teléfono del acudiente no tiene un formato internacional válido.");
        }
        return phone;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
