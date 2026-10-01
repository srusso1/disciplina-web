package com.disciplina.domain.repository;
import com.disciplina.domain.model.Citacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.*;
public interface CitacionRepository extends JpaRepository<Citacion, Long> {
    List<Citacion> findByIncidenteIdOrderByCreatedAtDesc(Integer incidenteId);
    List<Citacion> findByEstudianteIdOrderByFechaCitaDesc(Integer estudianteId);
    List<Citacion> findByEstudianteIdInOrderByFechaCitaDesc(List<Integer> estudianteIds);
    Optional<Citacion> findByWaMessageId(String waMessageId);

    @Query("""
        SELECT c FROM Citacion c
        JOIN FETCH c.incidente i
        JOIN FETCH c.estudiante e
        JOIN FETCH c.lugarCita l
        JOIN FETCH c.creadoPor u
        WHERE c.id = :id
        """)
    Optional<Citacion> findByIdForWhatsApp(@Param("id") Long id);
}
