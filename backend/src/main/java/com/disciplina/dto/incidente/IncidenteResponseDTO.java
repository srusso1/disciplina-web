package com.disciplina.dto.incidente;

import com.disciplina.domain.enums.EstadoProceso;
import com.disciplina.dto.catalogo.DocenteResponseDTO;
import com.disciplina.dto.catalogo.LugarResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidenteResponseDTO {
    private Integer id;
    private DocenteResponseDTO docenteReporta;
    private LugarResponseDTO lugar;
    private String usuarioRegistro;
    private LocalDate fechaIncidente;
    private LocalTime horaIncidente;
    private String descripcionHechos;
    private EstadoProceso estadoProceso;
    private Instant createdAt;
    private Instant updatedAt;

    @Builder.Default
    private List<InvolucradoResponseDTO> involucrados = new ArrayList<>();
}
