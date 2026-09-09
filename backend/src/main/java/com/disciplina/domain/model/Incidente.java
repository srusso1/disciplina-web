package com.disciplina.domain.model;

import com.disciplina.domain.enums.EstadoProceso;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "incidentes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incidente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_reporta_id", nullable = false)
    private Docente docenteReporta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lugar_id", nullable = false)
    private Lugar lugar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_registro_id", nullable = false)
    private Usuario usuarioRegistro;

    @Column(name = "fecha_incidente", nullable = false)
    private LocalDate fechaIncidente;

    @Column(name = "hora_incidente")
    private LocalTime horaIncidente;

    @Column(name = "descripcion_hechos", nullable = false, columnDefinition = "TEXT")
    private String descripcionHechos;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_proceso", nullable = false, length = 30)
    @Builder.Default
    private EstadoProceso estadoProceso = EstadoProceso.REPORTADO;

    @OneToMany(mappedBy = "incidente", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<IncidenteEstudiante> involucrados = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Version
    @Column(name = "version", nullable = false)
    @Builder.Default
    private Long version = 0L;

    public void agregarInvolucrado(IncidenteEstudiante involucrado) {
        involucrados.add(involucrado);
        involucrado.setIncidente(this);
    }
}
