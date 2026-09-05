package com.disciplina.dto.incidente;

import com.disciplina.domain.enums.RolEstudianteIncidente;
import com.disciplina.dto.catalogo.CatalogoFaltaResponseDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("documento")
    public String getDocumento() {
        return estudianteDocumento;
    }

    @JsonProperty("nombreCompleto")
    public String getNombreCompleto() {
        return estudianteNombreCompleto;
    }

    @JsonProperty("descargo")
    public String getDescargo() {
        return descargoEstudiante;
    }

    @JsonProperty("compromisos")
    public String getCompromisos() {
        return compromisoIndividual;
    }

    @JsonProperty("tieneDescargo")
    public boolean isTieneDescargo() {
        return descargoEstudiante != null && !descargoEstudiante.isBlank();
    }

    @JsonProperty("tieneCompromisos")
    public boolean isTieneCompromisos() {
        return compromisoIndividual != null && !compromisoIndividual.isBlank();
    }
}
