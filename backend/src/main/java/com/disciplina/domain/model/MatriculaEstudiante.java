package com.disciplina.domain.model;

import com.disciplina.domain.enums.EstadoMatricula;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "matriculas_estudiante", uniqueConstraints = {
    @UniqueConstraint(name = "uq_estudiante_anio", columnNames = {"estudiante_id", "anio_lectivo"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatriculaEstudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    @Column(name = "anio_lectivo", nullable = false)
    private Integer anioLectivo;

    @Column(nullable = false, length = 10)
    private String grado;

    @Column(nullable = false, length = 10)
    private String grupo;

    @Builder.Default
    @Column(nullable = false, length = 20)
    private String jornada = "MANANA";

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_matricula", nullable = false, length = 20)
    private EstadoMatricula estadoMatricula = EstadoMatricula.ACTIVO;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
