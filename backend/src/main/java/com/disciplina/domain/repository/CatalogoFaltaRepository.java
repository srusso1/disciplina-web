package com.disciplina.domain.repository;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.model.CatalogoFalta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CatalogoFaltaRepository extends JpaRepository<CatalogoFalta, Integer> {
    List<CatalogoFalta> findByActivoTrueOrderByClasificacionLeyAscCodigoAsc();
    List<CatalogoFalta> findByActivoTrueAndClasificacionLey(ClasificacionLey clasificacionLey);
}
