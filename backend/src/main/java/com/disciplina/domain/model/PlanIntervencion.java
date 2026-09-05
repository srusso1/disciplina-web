package com.disciplina.domain.model;

import com.disciplina.domain.enums.EstadoPlanIntervencion;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "planes_intervencion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanIntervencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incidente_origen_id")
    private Incidente incidenteOrigen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orientador_id", nullable = false)
    private Usuario orientador;

    @Column(name = "diagnostico_situacional", nullable = false, columnDefinition = "TEXT")
    private String diagnosticoSituacional;

    @Column(name = "recomendaciones_ia", columnDefinition = "TEXT")
    private String recomendacionesIa;

    @Column(name = "acciones_acordadas", nullable = false, columnDefinition = "TEXT")
    private String accionesAcordadas;

    @Column(name = "compromiso_padres", columnDefinition = "TEXT")
    private String compromisoPadres;

    @Column(name = "fecha_proximo_seguimiento")
    private LocalDate fechaProximoSeguimiento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    @Builder.Default
    private EstadoPlanIntervencion estado = EstadoPlanIntervencion.EN_SEGUIMIENTO;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SeguimientoCaso> seguimientos = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
