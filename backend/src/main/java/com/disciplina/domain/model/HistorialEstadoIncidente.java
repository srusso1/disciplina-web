package com.disciplina.domain.model;

import com.disciplina.domain.enums.EstadoProceso;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "historial_estado_incidente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorialEstadoIncidente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incidente_id", nullable = false)
    private Incidente incidente;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_anterior", length = 30)
    private EstadoProceso estadoAnterior;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_nuevo", nullable = false, length = 30)
    private EstadoProceso estadoNuevo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "fecha_cambio", nullable = false)
    private Instant fechaCambio;

    @Column(name = "es_linea_base", nullable = false)
    private boolean esLineaBase;

    public boolean isLineaBase() {
        return esLineaBase;
    }
}
