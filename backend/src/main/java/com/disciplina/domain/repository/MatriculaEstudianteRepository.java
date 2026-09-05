package com.disciplina.domain.repository;

import com.disciplina.domain.model.Estudiante;
import com.disciplina.domain.model.MatriculaEstudiante;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatriculaEstudianteRepository extends JpaRepository<MatriculaEstudiante, Integer> {

    Optional<MatriculaEstudiante> findByEstudianteAndAnioLectivo(Estudiante estudiante, Integer anioLectivo);

    Optional<MatriculaEstudiante> findByEstudianteIdAndAnioLectivo(Integer estudianteId, Integer anioLectivo);

    List<MatriculaEstudiante> findByEstudianteIdOrderByAnioLectivoDesc(Integer estudianteId);

    @Query("SELECT m FROM MatriculaEstudiante m JOIN FETCH m.estudiante WHERE m.anioLectivo = :anioLectivo")
    List<MatriculaEstudiante> findByAnioLectivoConEstudiante(@Param("anioLectivo") Integer anioLectivo);

    @Query("SELECT m FROM MatriculaEstudiante m JOIN FETCH m.estudiante WHERE m.anioLectivo = :anioLectivo AND m.grado = :grado")
    List<MatriculaEstudiante> findByAnioLectivoYGrado(@Param("anioLectivo") Integer anioLectivo, @Param("grado") String grado);

    @Query("SELECT m FROM MatriculaEstudiante m JOIN FETCH m.estudiante WHERE m.anioLectivo = :anioLectivo AND m.grado = :grado AND m.grupo = :grupo")
    List<MatriculaEstudiante> findByAnioLectivoYGradoYGrupo(
            @Param("anioLectivo") Integer anioLectivo,
            @Param("grado") String grado,
            @Param("grupo") String grupo);

    @Query(value = "SELECT m FROM MatriculaEstudiante m JOIN FETCH m.estudiante e " +
           "WHERE m.anioLectivo = :anioLectivo " +
           "AND (:grado IS NULL OR :grado = '' OR m.grado = :grado) " +
           "AND (:grupo IS NULL OR :grupo = '' OR m.grupo = :grupo) " +
           "AND (:filtro IS NULL OR :filtro = '' OR " +
           "     LOWER(e.nombres) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
           "     LOWER(e.apellidos) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
           "     e.documento LIKE CONCAT('%', :filtro, '%')) " +
           "ORDER BY e.apellidos ASC, e.nombres ASC",
           countQuery = "SELECT count(m) FROM MatriculaEstudiante m JOIN m.estudiante e " +
           "WHERE m.anioLectivo = :anioLectivo " +
           "AND (:grado IS NULL OR :grado = '' OR m.grado = :grado) " +
           "AND (:grupo IS NULL OR :grupo = '' OR m.grupo = :grupo) " +
           "AND (:filtro IS NULL OR :filtro = '' OR " +
           "     LOWER(e.nombres) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
           "     LOWER(e.apellidos) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
           "     e.documento LIKE CONCAT('%', :filtro, '%'))")
    Page<MatriculaEstudiante> buscarMatriculasPaginadas(
            @Param("anioLectivo") Integer anioLectivo,
            @Param("grado") String grado,
            @Param("grupo") String grupo,
            @Param("filtro") String filtro,
            Pageable pageable);

    long countByAnioLectivo(Integer anioLectivo);
}