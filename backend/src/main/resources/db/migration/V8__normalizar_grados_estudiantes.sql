-- V8__normalizar_grados_estudiantes.sql
-- Normalización canónica de grados y grupos escolares para eliminar discrepancias entre datos precargados,
-- importaciones SIMAT y reportes institucionales (p.ej. '08' -> '8', '0801' -> '1').

-- 1. Normalizar grados en matriculas_estudiante (remover ceros a la izquierda)
UPDATE matriculas_estudiante
SET grado = TRIM(LEADING '0' FROM grado)
WHERE grado ~ '^0[0-9]+';

-- 2. Normalizar grupos de 4 dígitos SIMAT (ej: 0801 -> 1, 0802 -> 2)
UPDATE matriculas_estudiante
SET grupo = TRIM(LEADING '0' FROM SUBSTRING(grupo FROM 3))
WHERE LENGTH(grupo) = 4 AND grupo ~ '^[0-9]{4}$';

-- 3. Normalizar grupos con ceros a la izquierda simples (ej: 01 -> 1, 02 -> 2)
UPDATE matriculas_estudiante
SET grupo = TRIM(LEADING '0' FROM grupo)
WHERE grupo ~ '^0[0-9]+';

-- 4. Normalizar snapshot histórico en incidente_estudiantes (grado_momento)
UPDATE incidente_estudiantes
SET grado_momento = TRIM(LEADING '0' FROM grado_momento)
WHERE grado_momento ~ '^0[0-9]+';

-- 5. Normalizar grupos históricos en incidente_estudiantes (grupo_momento)
UPDATE incidente_estudiantes
SET grupo_momento = TRIM(LEADING '0' FROM SUBSTRING(grupo_momento FROM 3))
WHERE LENGTH(grupo_momento) = 4 AND grupo_momento ~ '^[0-9]{4}$';

UPDATE incidente_estudiantes
SET grupo_momento = TRIM(LEADING '0' FROM grupo_momento)
WHERE grupo_momento ~ '^0[0-9]+';
