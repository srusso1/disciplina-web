CREATE TABLE citaciones (
    id BIGSERIAL PRIMARY KEY,
    incidente_id INT NOT NULL REFERENCES incidentes(id) ON DELETE RESTRICT,
    estudiante_id INT NOT NULL REFERENCES estudiantes(id) ON DELETE RESTRICT,
    lugar_cita_id INT NOT NULL REFERENCES lugares(id) ON DELETE RESTRICT,
    creado_por_id INT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    asunto TEXT NOT NULL,
    observaciones TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'ENVIADA', 'CONFIRMADA', 'NO_ASISTIO', 'CANCELADA')),
    wa_message_id VARCHAR(100),
    wa_estado_envio VARCHAR(20) DEFAULT 'NO_ENVIADO' CHECK (wa_estado_envio IN ('NO_ENVIADO', 'ENVIADO', 'ENTREGADO', 'LEIDO', 'FALLIDO')),
    wa_error_detalle TEXT,
    wa_enviado_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_citaciones_incidente ON citaciones(incidente_id);
CREATE INDEX idx_citaciones_estudiante ON citaciones(estudiante_id);
CREATE INDEX idx_citaciones_fecha ON citaciones(fecha_cita DESC);
