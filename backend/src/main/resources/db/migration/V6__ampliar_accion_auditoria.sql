-- V6: Ampliar longitud de columna accion en auditoria_sistema
-- Permite nombres descriptivos de acciones forenses (ej. REGISTRAR_SEGUIMIENTO, ACTUALIZAR_DESCARGO)

ALTER TABLE auditoria_sistema ALTER COLUMN accion TYPE VARCHAR(50);
