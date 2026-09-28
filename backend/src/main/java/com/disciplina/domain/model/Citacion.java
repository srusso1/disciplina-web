package com.disciplina.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.*;

@Entity @Table(name = "citaciones") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Citacion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "incidente_id", nullable = false) private Incidente incidente;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "estudiante_id", nullable = false) private Estudiante estudiante;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "lugar_cita_id", nullable = false) private Lugar lugarCita;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "creado_por_id", nullable = false) private Usuario creadoPor;
    @Column(name = "fecha_cita", nullable = false) private LocalDate fechaCita;
    @Column(name = "hora_cita", nullable = false) private LocalTime horaCita;
    @Column(nullable = false, columnDefinition = "TEXT") private String asunto;
    @Column(columnDefinition = "TEXT") private String observaciones;
    @Column(nullable = false, length = 20) @Builder.Default private String estado = "PENDIENTE";
    @Column(name = "wa_message_id", length = 100) private String waMessageId;
    @Column(name = "wa_estado_envio", length = 20) @Builder.Default private String waEstadoEnvio = "NO_ENVIADO";
    @Column(name = "wa_error_detalle", columnDefinition = "TEXT") private String waErrorDetalle;
    @Column(name = "wa_enviado_at") private Instant waEnviadoAt;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private Instant updatedAt;
}
