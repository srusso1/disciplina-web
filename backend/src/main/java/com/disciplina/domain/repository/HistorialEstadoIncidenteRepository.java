package com.disciplina.domain.repository;

import com.disciplina.domain.model.HistorialEstadoIncidente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Collection;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HistorialEstadoIncidenteRepository extends JpaRepository<HistorialEstadoIncidente, Long> {
    List<HistorialEstadoIncidente> findByIncidenteIdOrderByFechaCambioDescIdDesc(Integer incidenteId);

    @Query("SELECT h.incidente.id, MAX(h.id) FROM HistorialEstadoIncidente h WHERE h.incidente.id IN :ids GROUP BY h.incidente.id")
    List<Object[]> obtenerUltimosIds(@Param("ids") Collection<Integer> ids);
}
