-- Tabla principal de notificaciones
CREATE TABLE notificaciones (
    id BIGSERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(120) NOT NULL,
    mensaje VARCHAR(300) NOT NULL,
    tipo VARCHAR(30) NOT NULL,       -- 'CRITICA', 'TERMINO_LEGAL', 'SEGUIMIENTO', 'INFORMATIVA'
    severidad VARCHAR(15) NOT NULL DEFAULT 'MEDIA', -- 'BAJA', 'MEDIA', 'ALTA', 'CRITICA'
    ruta_enlace VARCHAR(200),        -- Redirección interna en frontend (ej: '/rectoria/faltas-graves', '/orientador/planes')
    leida BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_lectura TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de alto rendimiento para conteos de no leídas y paginación
CREATE INDEX idx_notificaciones_usuario_leida ON notificaciones(usuario_id, leida, created_at DESC);
CREATE INDEX idx_notificaciones_usuario_created_at ON notificaciones(usuario_id, created_at DESC);
CREATE INDEX idx_notificaciones_created_at ON notificaciones(created_at DESC);
