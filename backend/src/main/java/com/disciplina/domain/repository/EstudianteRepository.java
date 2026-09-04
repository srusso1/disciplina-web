package com.disciplina.domain.repository;

import com.disciplina.domain.model.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Integer> {

    Optional<Estudiante> findByDocumento(String documento);

    boolean existsByDocumento(String documento);

    @Query("SELECT e FROM Estudiante e WHERE " +
           "LOWER(e.nombres) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
           "LOWER(e.apellidos) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
           "e.documento LIKE CONCAT('%', :filtro, '%')")
    List<Estudiante> buscarPorFiltro(@Param("filtro") String filtro);
}
