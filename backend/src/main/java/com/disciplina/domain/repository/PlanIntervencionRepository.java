package com.disciplina.domain.repository;

import com.disciplina.domain.enums.EstadoPlanIntervencion;
import com.disciplina.domain.model.PlanIntervencion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanIntervencionRepository extends JpaRepository<PlanIntervencion, Integer> {

    @Query("""
        SELECT p FROM PlanIntervencion p
        JOIN FETCH p.estudiante e
        JOIN FETCH p.orientador o
        LEFT JOIN FETCH p.incidenteOrigen io
        WHERE p.id = :id
        """)
    Optional<PlanIntervencion> findByIdConDetalles(@Param("id") Integer id);

    @Query("""
        SELECT p FROM PlanIntervencion p
        JOIN FETCH p.estudiante e
        JOIN FETCH p.orientador o
        LEFT JOIN FETCH p.incidenteOrigen io
        WHERE p.estudiante.id = :estudianteId
        ORDER BY p.createdAt DESC
        """)
    List<PlanIntervencion> findByEstudianteIdConDetalles(@Param("estudianteId") Integer estudianteId);

    @Query(value = """
        SELECT p FROM PlanIntervencion p
        JOIN FETCH p.estudiante e
        JOIN FETCH p.orientador o
        LEFT JOIN FETCH p.incidenteOrigen io
        WHERE (:estado IS NULL OR p.estado = :estado)
          AND (:busqueda IS NULL OR :busqueda = '' OR
               LOWER(e.nombres) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR
               LOWER(e.apellidos) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR
               e.documento LIKE CONCAT('%', :busqueda, '%'))
        ORDER BY p.createdAt DESC
        """,
        countQuery = """
        SELECT count(p) FROM PlanIntervencion p
        JOIN p.estudiante e
        WHERE (:estado IS NULL OR p.estado = :estado)
          AND (:busqueda IS NULL OR :busqueda = '' OR
               LOWER(e.nombres) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR
               LOWER(e.apellidos) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR
               e.documento LIKE CONCAT('%', :busqueda, '%'))
        """)
    Page<PlanIntervencion> buscarPlanesPaginados(
            @Param("estado") EstadoPlanIntervencion estado,
            @Param("busqueda") String busqueda,
            Pageable pageable);

    @Query("""
        SELECT p FROM PlanIntervencion p
        JOIN FETCH p.estudiante e
        JOIN FETCH p.orientador o
        WHERE p.estado = com.disciplina.domain.enums.EstadoPlanIntervencion.EN_SEGUIMIENTO
          AND p.fechaProximoSeguimiento <= :fecha
        ORDER BY p.fechaProximoSeguimiento ASC
        """)
    java.util.List<PlanIntervencion> findPlanesParaSeguimiento(@Param("fecha") java.time.LocalDate fecha);
}
