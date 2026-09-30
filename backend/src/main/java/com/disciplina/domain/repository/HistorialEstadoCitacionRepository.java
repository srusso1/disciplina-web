package com.disciplina.domain.repository;

import com.disciplina.domain.model.HistorialEstadoCitacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialEstadoCitacionRepository extends JpaRepository<HistorialEstadoCitacion, Long> {
    List<HistorialEstadoCitacion> findByCitacionIdOrderByFechaCambioDescIdDesc(Long citacionId);
}
