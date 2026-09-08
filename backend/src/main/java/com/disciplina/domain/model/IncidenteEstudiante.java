package com.disciplina.domain.model;

import com.disciplina.domain.enums.RolEstudianteIncidente;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "incidente_estudiantes", uniqueConstraints = {
    @UniqueConstraint(name = "uq_incidente_estudiante", columnNames = {"incidente_id", "estudiante_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidenteEstudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incidente_id", nullable = false)
    private Incidente incidente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "catalogo_falta_id")
    private CatalogoFalta catalogoFalta;

    @Column(name = "anio_lectivo", nullable = false)
    private Integer anioLectivo;

    @Column(name = "grado_momento", nullable = false, length = 10)
    private String gradoMomento;

    @Column(name = "grupo_momento", nullable = false, length = 10)
    private String grupoMomento;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol_estudiante", nullable = false, length = 20)
    private RolEstudianteIncidente rolEstudiante;

    @Column(name = "descargo_estudiante", columnDefinition = "TEXT")
    private String descargoEstudiante;

    @Column(name = "compromiso_individual", columnDefinition = "TEXT")
    private String compromisoIndividual;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Version
    @Column(name = "version", nullable = false)
    @Builder.Default
    private Long version = 0L;

    @PrePersist
    @PreUpdate
    public void normalizarDatos() {
        this.gradoMomento = com.disciplina.common.util.GradoEscolarUtil.normalizarGrado(this.gradoMomento);
        this.grupoMomento = com.disciplina.common.util.GradoEscolarUtil.normalizarGrupo(this.grupoMomento);
    }
}
