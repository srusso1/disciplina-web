-- V5: Indices de Rendimiento para Consultas de Expediente y Busquedas
-- Soporte para consultas frecuentes por estudiante_id y busquedas por nombre

-- 1. Consultas historicas del expediente del estudiante
CREATE INDEX IF NOT EXISTS idx_incidente_estudiantes_estudiante 
    ON incidente_estudiantes(estudiante_id);

CREATE INDEX IF NOT EXISTS idx_planes_intervencion_estudiante 
    ON planes_intervencion(estudiante_id);

CREATE INDEX IF NOT EXISTS idx_seguimientos_caso_plan 
    ON seguimientos_caso(plan_id);

-- 2. Busqueda de estudiantes por apellidos y nombres en censo
CREATE INDEX IF NOT EXISTS idx_estudiantes_apellidos_nombres 
    ON estudiantes(apellidos, nombres);
