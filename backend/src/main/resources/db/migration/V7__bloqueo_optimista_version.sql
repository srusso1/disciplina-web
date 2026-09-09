-- V7: Soporte de bloqueo optimista para prevenir sobreescrituras concurrentes (Lost Updates)
ALTER TABLE incidentes ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
ALTER TABLE incidente_estudiantes ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
ALTER TABLE planes_intervencion ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
