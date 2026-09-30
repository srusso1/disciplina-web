INSERT INTO historial_estado_citacion (
    citacion_id,
    estado_anterior,
    estado_nuevo,
    accion,
    motivo,
    usuario_id,
    fecha_cambio
)
SELECT
    c.id,
    NULL,
    c.estado,
    'LINEA_BASE',
    'Estado incorporado al habilitar la trazabilidad de citaciones.',
    c.creado_por_id,
    COALESCE(c.created_at, CURRENT_TIMESTAMP)
FROM citaciones c
WHERE NOT EXISTS (
    SELECT 1
    FROM historial_estado_citacion h
    WHERE h.citacion_id = c.id
);
