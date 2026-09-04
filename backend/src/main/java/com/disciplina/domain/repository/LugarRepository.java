package com.disciplina.domain.repository;

import com.disciplina.domain.model.Lugar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LugarRepository extends JpaRepository<Lugar, Integer> {
    List<Lugar> findByActivoTrueOrderByNombreAsc();
}
