package com.disciplina.domain.repository;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.model.IncidenteEstudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncidenteEstudianteRepository extends JpaRepository<IncidenteEstudiante, Integer> {

    @Query("""
        SELECT ie FROM IncidenteEstudiante ie
        JOIN FETCH ie.estudiante e
        LEFT JOIN FETCH ie.catalogoFalta cf
        WHERE ie.incidente.id = :incidenteId
        ORDER BY ie.rolEstudiante ASC
        """)
    List<IncidenteEstudiante> findByIncidenteIdConDetalles(@Param("incidenteId") Integer incidenteId);

    @Query("""
        SELECT ie FROM IncidenteEstudiante ie
        JOIN FETCH ie.incidente i
        JOIN FETCH i.lugar l
        JOIN FETCH i.docenteReporta d
        LEFT JOIN FETCH ie.catalogoFalta cf
        WHERE ie.estudiante.id = :estudianteId
        ORDER BY i.fechaIncidente DESC
        """)
    List<IncidenteEstudiante> findByEstudianteIdConIncidente(@Param("estudianteId") Integer estudianteId);

    Optional<IncidenteEstudiante> findByIncidenteIdAndEstudianteId(Integer incidenteId, Integer estudianteId);

    @Query("""
        SELECT count(DISTINCT ie.incidente.id) FROM IncidenteEstudiante ie
        WHERE ie.catalogoFalta.clasificacionLey = :clasificacionLey
        """)
    long countDistinctIncidentesByClasificacionLey(@Param("clasificacionLey") ClasificacionLey clasificacionLey);
}
