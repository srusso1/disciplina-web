package com.disciplina.dto.notificacion;

import com.disciplina.domain.enums.SeveridadNotificacion;
import com.disciplina.domain.enums.TipoNotificacion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificacionResponseDTO {
    private Long id;
    private String titulo;
    private String mensaje;
    private TipoNotificacion tipo;
    private SeveridadNotificacion severidad;
    private String rutaEnlace;
    private boolean leida;
    private Instant createdAt;
}
