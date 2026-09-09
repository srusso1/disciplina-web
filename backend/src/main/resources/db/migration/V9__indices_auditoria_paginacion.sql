-- V9__indices_auditoria_paginacion.sql
-- Índices para optimizar la paginación a nivel de base de datos y filtros en la bitácora de auditoría forense

CREATE INDEX IF NOT EXISTS idx_auditoria_created_at ON auditoria_sistema(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_auditoria_accion ON auditoria_sistema(accion);
