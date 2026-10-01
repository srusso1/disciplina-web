package com.disciplina.event;

/** Evento de dominio publicado antes del commit y atendido solo tras confirmarlo. */
public record CitacionPendienteEnvioEvent(Long citacionId) {
}
