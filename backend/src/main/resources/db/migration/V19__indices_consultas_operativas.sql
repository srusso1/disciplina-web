-- Índices aditivos para claves foráneas y filtros operativos frecuentes.
-- Evitan escaneos completos al consultar expedientes, citaciones y estados.
CREATE INDEX IF NOT EXISTS idx_incidentes_estado_fecha
    ON incidentes(estado_proceso, fecha_incidente DESC);

CREATE INDEX IF NOT EXISTS idx_incidentes_usuario_registro
    ON incidentes(usuario_registro_id);

CREATE INDEX IF NOT EXISTS idx_incidentes_lugar
    ON incidentes(lugar_id);

CREATE INDEX IF NOT EXISTS idx_incidentes_docente_reporta
    ON incidentes(docente_reporta_id);

CREATE INDEX IF NOT EXISTS idx_citaciones_incidente_created
    ON citaciones(incidente_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_citaciones_estudiante_fecha
    ON citaciones(estudiante_id, fecha_cita DESC);

CREATE INDEX IF NOT EXISTS idx_citaciones_wa_message_id
    ON citaciones(wa_message_id)
    WHERE wa_message_id IS NOT NULL;
