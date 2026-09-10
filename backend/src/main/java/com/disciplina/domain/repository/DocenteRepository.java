package com.disciplina.domain.repository;

import com.disciplina.domain.model.Docente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Integer> {
    List<Docente> findByActivoTrueOrderByApellidosAscNombresAsc();
    Optional<Docente> findByDocumento(String documento);
    boolean existsByDocumento(String documento);

    // Búsqueda paginada para el módulo de configuración (incluye inactivos)
    Page<Docente> findByNombresContainingIgnoreCaseOrApellidosContainingIgnoreCaseOrDocumentoContainingIgnoreCase(
            String nombres, String apellidos, String documento, Pageable pageable);
}

