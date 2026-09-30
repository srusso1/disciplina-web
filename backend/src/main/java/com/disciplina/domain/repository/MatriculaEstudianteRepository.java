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
           "AND (:datosPendientes IS NULL OR :datosPendientes = '' " +
           "     OR (:datosPendientes = 'ACUDIENTE' AND (e.nombreAcudiente IS NULL OR TRIM(e.nombreAcudiente) = '' OR UPPER(TRIM(e.nombreAcudiente)) = 'PENDIENTE POR REGISTRAR')) " +
           "     OR (:datosPendientes = 'TELEFONO' AND (e.telefonoAcudiente IS NULL OR TRIM(e.telefonoAcudiente) = '' OR UPPER(TRIM(e.telefonoAcudiente)) = 'SIN REGISTRO'))) " +
           "AND (:filtro IS NULL OR :filtro = '' OR " +
           "     LOWER(e.nombres) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
           "     LOWER(e.apellidos) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
           "     e.documento LIKE CONCAT('%', :filtro, '%')) " +
           "ORDER BY e.apellidos ASC, e.nombres ASC",
           countQuery = "SELECT count(m) FROM MatriculaEstudiante m JOIN m.estudiante e " +
           "WHERE m.anioLectivo = :anioLectivo " +
           "AND (:grado IS NULL OR :grado = '' OR m.grado = :grado) " +
           "AND (:grupo IS NULL OR :grupo = '' OR m.grupo = :grupo) " +
           "AND (:datosPendientes IS NULL OR :datosPendientes = '' " +
           "     OR (:datosPendientes = 'ACUDIENTE' AND (e.nombreAcudiente IS NULL OR TRIM(e.nombreAcudiente) = '' OR UPPER(TRIM(e.nombreAcudiente)) = 'PENDIENTE POR REGISTRAR')) " +
           "     OR (:datosPendientes = 'TELEFONO' AND (e.telefonoAcudiente IS NULL OR TRIM(e.telefonoAcudiente) = '' OR UPPER(TRIM(e.telefonoAcudiente)) = 'SIN REGISTRO'))) " +
           "AND (:filtro IS NULL OR :filtro = '' OR " +
           "     LOWER(e.nombres) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
           "     LOWER(e.apellidos) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
           "     e.documento LIKE CONCAT('%', :filtro, '%'))")
    Page<MatriculaEstudiante> buscarMatriculasPaginadas(
            @Param("anioLectivo") Integer anioLectivo,
            @Param("grado") String grado,
            @Param("grupo") String grupo,
            @Param("filtro") String filtro,
            @Param("datosPendientes") String datosPendientes,
            Pageable pageable);

    long countByAnioLectivo(Integer anioLectivo);

    @Query(value = """
            SELECT
                COUNT(*) AS totalMatriculados,
                COUNT(*) FILTER (
                    WHERE e.nombre_acudiente IS NULL
                       OR BTRIM(e.nombre_acudiente) = ''
                       OR UPPER(BTRIM(e.nombre_acudiente)) = 'PENDIENTE POR REGISTRAR'
                ) AS sinAcudiente,
                COUNT(*) FILTER (
                    WHERE e.telefono_acudiente IS NULL
                       OR BTRIM(e.telefono_acudiente) = ''
                       OR UPPER(BTRIM(e.telefono_acudiente)) = 'SIN REGISTRO'
                ) AS sinTelefonoContacto
            FROM matriculas_estudiante m
            JOIN estudiantes e ON e.id = m.estudiante_id
            WHERE m.anio_lectivo = :anioLectivo
            """, nativeQuery = true)
    ResumenMatriculasProjection obtenerResumenPorAnio(@Param("anioLectivo") Integer anioLectivo);
}
