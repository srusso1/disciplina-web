package com.disciplina.config;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
@Getter @Setter @Configuration @ConfigurationProperties(prefix = "app.whatsapp")
public class WhatsAppProperties {
    private String apiUrl;
    private String accessToken;
    private String phoneNumberId;
    private String businessAccountId;
    private String webhookVerifyToken;
    private String appSecret;
    private String templateName = "citacion_incidente_convivencia";
    private String templateLanguage = "es_CO";
}
