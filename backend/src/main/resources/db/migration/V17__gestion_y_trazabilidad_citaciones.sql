ALTER TABLE citaciones DROP CONSTRAINT IF EXISTS citaciones_estado_check;

UPDATE citaciones
SET estado = 'PROGRAMADA'
WHERE estado IN ('PENDIENTE', 'ENVIADA');

ALTER TABLE citaciones
    ALTER COLUMN estado SET DEFAULT 'PROGRAMADA',
    ADD CONSTRAINT citaciones_estado_check
        CHECK (estado IN ('PROGRAMADA', 'CONFIRMADA', 'ASISTIO', 'NO_ASISTIO', 'CANCELADA')),
    ADD COLUMN wa_entregado_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN wa_leido_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN reprogramada_desde_id BIGINT REFERENCES citaciones(id) ON DELETE RESTRICT;

CREATE TABLE historial_estado_citacion (
    id BIGSERIAL PRIMARY KEY,
    citacion_id BIGINT NOT NULL REFERENCES citaciones(id) ON DELETE RESTRICT,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    accion VARCHAR(30) NOT NULL,
    motivo TEXT,
    usuario_id INT REFERENCES usuarios(id) ON DELETE RESTRICT,
    fecha_cambio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_historial_citacion_citacion
    ON historial_estado_citacion(citacion_id, fecha_cambio DESC);

CREATE INDEX idx_citaciones_reprogramada_desde
    ON citaciones(reprogramada_desde_id);
