package com.disciplina.domain.repository;
import com.disciplina.domain.model.Citacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface CitacionRepository extends JpaRepository<Citacion, Long> {
    List<Citacion> findByIncidenteIdOrderByCreatedAtDesc(Integer incidenteId);
    List<Citacion> findByEstudianteIdOrderByFechaCitaDesc(Integer estudianteId);
    List<Citacion> findByEstudianteIdInOrderByFechaCitaDesc(List<Integer> estudianteIds);
    Optional<Citacion> findByWaMessageId(String waMessageId);
}
