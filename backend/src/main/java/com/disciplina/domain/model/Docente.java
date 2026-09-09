package com.disciplina.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "docentes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Docente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 25)
    private String documento;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(name = "area_desempeno", length = 100)
    private String areaDesempeno;

    @Builder.Default
    @Column(nullable = false)
    private Boolean activo = true;

    public String getNombreCompleto() {
        return (nombres + " " + apellidos).trim();
    }
}
