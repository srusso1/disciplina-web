package com.disciplina.domain.repository;

import com.disciplina.domain.model.Estudiante;
import com.disciplina.domain.model.MatriculaEstudiante;
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

    @Query("SELECT m FROM MatriculaEstudiante m JOIN FETCH m.estudiante WHERE m.anioLectivo = :anioLectivo")
    List<MatriculaEstudiante> findByAnioLectivoConEstudiante(@Param("anioLectivo") Integer anioLectivo);

    @Query("SELECT m FROM MatriculaEstudiante m JOIN FETCH m.estudiante WHERE m.anioLectivo = :anioLectivo AND m.grado = :grado")
    List<MatriculaEstudiante> findByAnioLectivoYGrado(@Param("anioLectivo") Integer anioLectivo, @Param("grado") String grado);

    @Query("SELECT m FROM MatriculaEstudiante m JOIN FETCH m.estudiante WHERE m.anioLectivo = :anioLectivo AND m.grado = :grado AND m.grupo = :grupo")
    List<MatriculaEstudiante> findByAnioLectivoYGradoYGrupo(
            @Param("anioLectivo") Integer anioLectivo,
            @Param("grado") String grado,
            @Param("grupo") String grupo);

    long countByAnioLectivo(Integer anioLectivo);
}
