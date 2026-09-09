package com.disciplina.domain.model;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.enums.GravedadInstitucional;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "catalogo_faltas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatalogoFalta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Enumerated(EnumType.STRING)
    @Column(name = "clasificacion_ley", nullable = false, length = 10)
    private ClasificacionLey clasificacionLey;

    @Enumerated(EnumType.STRING)
    @Column(name = "gravedad_institucional", nullable = false, length = 20)
    private GravedadInstitucional gravedadInstitucional;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "procedimiento_sugerido", columnDefinition = "TEXT")
    private String procedimientoSugerido;

    @Builder.Default
    @Column(nullable = false)
    private Boolean activo = true;
}
