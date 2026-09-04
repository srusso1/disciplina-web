package com.disciplina.dto.incidente;

import com.disciplina.domain.enums.RolEstudianteIncidente;
import com.disciplina.dto.catalogo.CatalogoFaltaResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvolucradoResponseDTO {
    private Integer id;
    private Integer estudianteId;
    private String estudianteDocumento;
    private String estudianteNombreCompleto;
    private Integer anioLectivo;
    private String gradoMomento;
    private String grupoMomento;
    private RolEstudianteIncidente rolEstudiante;
    private CatalogoFaltaResponseDTO falta;
    private String descargoEstudiante;
    private String compromisoIndividual;
}
