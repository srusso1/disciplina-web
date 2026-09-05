package com.disciplina.dto.expediente;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumenConvivenciaDTO {
    private long totalIncidentes;
    private long comoAgresorPrincipal;
    private long comoParticipe;
    private long comoVictima;
    private long comoTestigo;
    private long faltasTipoI;
    private long faltasTipoII;
    private long faltasTipoIII;
    private boolean reincidente;
}
