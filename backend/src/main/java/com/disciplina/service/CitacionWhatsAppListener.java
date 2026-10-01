package com.disciplina.service;

import com.disciplina.domain.model.Citacion;
import com.disciplina.domain.repository.CitacionRepository;
import com.disciplina.event.CitacionPendienteEnvioEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/** Ejecuta la integración externa sin mantener abierta la transacción de negocio. */
@Slf4j
@Component
@RequiredArgsConstructor
public class CitacionWhatsAppListener {

    private final CitacionRepository citacionRepository;
    private final WhatsAppService whatsAppService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void enviar(CitacionPendienteEnvioEvent event) {
        Citacion citacion = citacionRepository.findByIdForWhatsApp(event.citacionId())
                .orElse(null);
        if (citacion == null) {
            log.warn("No se encontró la citación {} para el envío posterior a commit", event.citacionId());
            return;
        }

        WhatsAppEnvioResultado resultado = whatsAppService.enviarCitacion(citacion);
        citacion.setWaEstadoEnvio(resultado.exitoso() ? "ENVIADO" : "FALLIDO");
        citacion.setWaMessageId(resultado.messageId());
        citacion.setWaErrorDetalle(resultado.errorDetalle());
        if (resultado.exitoso()) {
            citacion.setWaEnviadoAt(java.time.Instant.now());
        }
        citacionRepository.save(citacion);
    }
}
