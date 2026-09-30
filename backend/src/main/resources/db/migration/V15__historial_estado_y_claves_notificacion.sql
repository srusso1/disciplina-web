ALTER TABLE notificaciones ADD COLUMN recurso_tipo VARCHAR(40);
ALTER TABLE notificaciones ADD COLUMN recurso_id VARCHAR(80);
ALTER TABLE notificaciones ADD COLUMN evento_clave VARCHAR(160);

CREATE UNIQUE INDEX uq_notificaciones_usuario_evento
    ON notificaciones (usuario_id, evento_clave) WHERE evento_clave IS NOT NULL;
CREATE INDEX idx_notificaciones_historial
    ON notificaciones (usuario_id, created_at DESC, id DESC);

CREATE TABLE historial_estado_incidente (
    id BIGSERIAL PRIMARY KEY,
    incidente_id INT NOT NULL REFERENCES incidentes(id),
    estado_anterior VARCHAR(30),
    estado_nuevo VARCHAR(30) NOT NULL,
    usuario_id INT REFERENCES usuarios(id),
    fecha_cambio TIMESTAMP WITH TIME ZONE NOT NULL,
    es_linea_base BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_historial_estado_incidente_fecha
    ON historial_estado_incidente (incidente_id, fecha_cambio DESC, id DESC);

-- Los incidentes existentes no tienen transiciones reconstruibles; conservar solo una linea base.
INSERT INTO historial_estado_incidente (incidente_id, estado_nuevo, fecha_cambio, es_linea_base)
SELECT id, estado_proceso, CURRENT_TIMESTAMP, TRUE FROM incidentes;
