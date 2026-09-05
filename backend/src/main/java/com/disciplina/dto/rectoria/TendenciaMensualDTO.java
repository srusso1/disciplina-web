package com.disciplina.dto.rectoria;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TendenciaMensualDTO {
    private String mes;
    private int mesNumero;
    private int anio;
    private long cantidad;
}
