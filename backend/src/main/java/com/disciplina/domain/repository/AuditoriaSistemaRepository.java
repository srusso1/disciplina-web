package com.disciplina.domain.repository;

import com.disciplina.domain.model.AuditoriaSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditoriaSistemaRepository extends JpaRepository<AuditoriaSistema, Long>, JpaSpecificationExecutor<AuditoriaSistema> {

    @Query("""
        SELECT a FROM AuditoriaSistema a
        LEFT JOIN FETCH a.usuario u
        WHERE a.entidad = :entidad AND a.entidadId = :entidadId
        ORDER BY a.createdAt DESC
        """)
    List<AuditoriaSistema> findByEntidadAndEntidadIdOrderByCreatedAtDesc(
            @Param("entidad") String entidad,
            @Param("entidadId") String entidadId);
}
