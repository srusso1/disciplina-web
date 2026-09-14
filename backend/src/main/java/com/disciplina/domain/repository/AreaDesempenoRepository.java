package com.disciplina.domain.repository;

import com.disciplina.domain.model.AreaDesempeno;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AreaDesempenoRepository extends JpaRepository<AreaDesempeno, Integer> {
    List<AreaDesempeno> findByActivoTrueOrderByNombreAsc();
    Optional<AreaDesempeno> findByNombreIgnoreCase(String nombre);
    boolean existsByNombreIgnoreCase(String nombre);
    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Integer id);
    Page<AreaDesempeno> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
}
