package com.disciplina.dto.notificacion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConteoNotificacionesDTO {
    private long noLeidas;

    public static ConteoNotificacionesDTO of(long noLeidas) {
        return new ConteoNotificacionesDTO(noLeidas);
    }
}
