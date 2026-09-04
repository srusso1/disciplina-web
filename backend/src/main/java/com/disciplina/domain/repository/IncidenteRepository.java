package com.disciplina.domain.repository;

import com.disciplina.domain.enums.EstadoProceso;
import com.disciplina.domain.model.Incidente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface IncidenteRepository extends JpaRepository<Incidente, Integer> {

    @Query(value = """
        SELECT DISTINCT i FROM Incidente i
        JOIN FETCH i.docenteReporta d
        JOIN FETCH i.lugar l
        JOIN FETCH i.usuarioRegistro u
        LEFT JOIN i.involucrados inv
        LEFT JOIN inv.estudiante e
        WHERE (:estado IS NULL OR i.estadoProceso = :estado)
          AND (:fechaDesde IS NULL OR i.fechaIncidente >= :fechaDesde)
          AND (:fechaHasta IS NULL OR i.fechaIncidente <= :fechaHasta)
          AND (:busqueda IS NULL OR :busqueda = '' OR
               LOWER(i.descripcionHechos) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR
               LOWER(e.nombres) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR
               LOWER(e.apellidos) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR
               e.documento LIKE CONCAT('%', :busqueda, '%'))
        ORDER BY i.fechaIncidente DESC, i.createdAt DESC
        """,
        countQuery = """
        SELECT count(DISTINCT i) FROM Incidente i
        LEFT JOIN i.involucrados inv
        LEFT JOIN inv.estudiante e
        WHERE (:estado IS NULL OR i.estadoProceso = :estado)
          AND (:fechaDesde IS NULL OR i.fechaIncidente >= :fechaDesde)
          AND (:fechaHasta IS NULL OR i.fechaIncidente <= :fechaHasta)
          AND (:busqueda IS NULL OR :busqueda = '' OR
               LOWER(i.descripcionHechos) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR
               LOWER(e.nombres) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR
               LOWER(e.apellidos) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR
               e.documento LIKE CONCAT('%', :busqueda, '%'))
        """)
    Page<Incidente> buscarIncidentesPaginados(
            @Param("estado") EstadoProceso estado,
            @Param("fechaDesde") LocalDate fechaDesde,
            @Param("fechaHasta") LocalDate fechaHasta,
            @Param("busqueda") String busqueda,
            Pageable pageable);

    @Query("""
        SELECT i FROM Incidente i
        JOIN FETCH i.docenteReporta d
        JOIN FETCH i.lugar l
        JOIN FETCH i.usuarioRegistro u
        WHERE i.id = :id
        """)
    Optional<Incidente> findByIdWithDetails(@Param("id") Integer id);

    long countByEstadoProceso(EstadoProceso estadoProceso);
}
