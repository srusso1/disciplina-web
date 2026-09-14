CREATE TABLE areas_desempeno (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar áreas comunes del currículo
INSERT INTO areas_desempeno (nombre, descripcion) VALUES
('Matemáticas', 'Área de ciencias exactas y cálculo'),
('Humanidades y Lengua Castellana', 'Lenguaje, comunicación y literatura'),
('Ciencias Naturales y Educación Ambiental', 'Biología, física y química'),
('Ciencias Sociales', 'Historia, geografía y constitución política'),
('Educación Física, Recreación y Deportes', 'Actividad motriz y deportiva'),
('Educación Artística y Cultural', 'Artes plásticas y música'),
('Tecnología e Informática', 'Sistemas y competencias tecnológicas'),
('Idioma Extranjero (Inglés)', 'Bilingüismo y comprensión en lengua extranjera'),
('Orientación / Convivencia', 'Equipo interdisciplinario de apoyo escolar'),
('PENDIENTE POR REGISTRO', 'Área académica pendiente por asignar')
ON CONFLICT (nombre) DO NOTHING;

-- Agregar FK en docentes
ALTER TABLE docentes ADD COLUMN IF NOT EXISTS area_desempeno_id INT REFERENCES areas_desempeno(id) ON DELETE SET NULL;

-- Vincular docentes existentes con sus áreas si coinciden
UPDATE docentes d
SET area_desempeno_id = a.id
FROM areas_desempeno a
WHERE d.area_desempeno_id IS NULL AND (
    LOWER(TRIM(d.area_desempeno)) = LOWER(TRIM(a.nombre))
    OR (LOWER(d.area_desempeno) LIKE '%matem%' AND a.nombre = 'Matemáticas')
    OR (LOWER(d.area_desempeno) LIKE '%lengua%' AND a.nombre = 'Humanidades y Lengua Castellana')
    OR (LOWER(d.area_desempeno) LIKE '%social%' AND a.nombre = 'Ciencias Sociales')
    OR (LOWER(d.area_desempeno) LIKE '%natural%' AND a.nombre = 'Ciencias Naturales y Educación Ambiental')
    OR (LOWER(d.area_desempeno) LIKE '%física%' AND a.nombre = 'Educación Física, Recreación y Deportes')
    OR (LOWER(d.area_desempeno) LIKE '%fisica%' AND a.nombre = 'Educación Física, Recreación y Deportes')
    OR (LOWER(d.area_desempeno) LIKE '%art%' AND a.nombre = 'Educación Artística y Cultural')
    OR (LOWER(d.area_desempeno) LIKE '%tecnolog%' AND a.nombre = 'Tecnología e Informática')
    OR (LOWER(d.area_desempeno) LIKE '%ingl%' AND a.nombre = 'Idioma Extranjero (Inglés)')
    OR (LOWER(d.area_desempeno) LIKE '%orienta%' AND a.nombre = 'Orientación / Convivencia')
    OR (LOWER(d.area_desempeno) LIKE '%pendiente%' AND a.nombre = 'PENDIENTE POR REGISTRO')
);
