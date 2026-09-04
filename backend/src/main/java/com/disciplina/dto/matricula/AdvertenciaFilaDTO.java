package com.disciplina.dto.matricula;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdvertenciaFilaDTO {
    private int fila;
    private String codigo;
    private String estudiante;
    private String motivo;
    private String accionTomada;
}
