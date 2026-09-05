package com.disciplina.domain.repository;

import com.disciplina.domain.model.SeguimientoCaso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeguimientoCasoRepository extends JpaRepository<SeguimientoCaso, Integer> {

    @Query("""
        SELECT s FROM SeguimientoCaso s
        JOIN FETCH s.usuario u
        WHERE s.plan.id = :planId
        ORDER BY s.fechaRegistro ASC
        """)
    List<SeguimientoCaso> findByPlanIdConUsuario(@Param("planId") Integer planId);
}
