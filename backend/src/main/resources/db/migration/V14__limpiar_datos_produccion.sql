-- V14: Limpieza integral de datos de prueba y re-siembra oficial para Producción / Beta
-- Deja las tablas transaccionales en CERO y re-siembra la configuración legal estatutaria

-- 1. Vaciar todas las tablas transaccionales y de prueba
TRUNCATE TABLE
    auditoria_sistema,
    notificaciones,
    seguimientos_caso,
    planes_intervencion,
    incidente_estudiantes,
    incidentes,
    matriculas_estudiante,
    estudiantes,
    docentes,
    lugares,
    catalogo_faltas,
    areas_desempeno,
    usuarios
RESTART IDENTITY CASCADE;

-- 2. Cuentas directivas institucionales maestras (Password: Password123! con BCrypt factor 12)
INSERT INTO usuarios (username, password_hash, nombres, apellidos, email, rol, activo)
VALUES
(
    'rector',
    '$2a$12$TTvJz8KOOZLee7Zs7c7rTuxVAWFn5ygx0qL53XimiicmJuEDUGa4W',
    'Carlos Alberto',
    'Restrepo Restrepo',
    'rector@disciplina.edu.co',
    'ROLE_RECTOR',
    TRUE
),
(
    'orientador',
    '$2a$12$TTvJz8KOOZLee7Zs7c7rTuxVAWFn5ygx0qL53XimiicmJuEDUGa4W',
    'Gloria Esperanza',
    'Gómez Morales',
    'orientador@disciplina.edu.co',
    'ROLE_ORIENTADOR',
    TRUE
);

-- 3. Catálogo Estatutario Oficial de Faltas (Marco Nacional Ley 1620 de 2013 y Decreto 1965)
INSERT INTO catalogo_faltas (codigo, clasificacion_ley, gravedad_institucional, descripcion, procedimiento_sugerido, activo)
VALUES
(
    'ART-101-T1',
    'TIPO_I',
    'LEVE',
    'Conflictos manejados inadecuadamente y situaciones esporádicas que inciden negativamente en el clima escolar, sin generar daños al cuerpo o a la salud física o mental.',
    'Procedimiento formativo inmediato: mediación pedagógica, diálogo reflexivo en aula, acuerdos de autorregulación y consignación de compromisos formativos.',
    TRUE
),
(
    'ART-201-T2',
    'TIPO_II',
    'GRAVE',
    'Situaciones de agresión escolar, acoso escolar (bullying) y ciberacoso (ciberbullying), que no revistan las características de la comisión de un delito y que se presenten de manera repetida o causen daño al cuerpo o salud física o mental sin incapacidad médica.',
    'Protocolo institucional Ley 1620: atención y protección a las partes, remisión formal a Orientación Escolar, notificación inmediata a padres o acudientes, registro de descargos con debido proceso y formulación de plan de intervención pedagógico.',
    TRUE
),
(
    'ART-301-T3',
    'TIPO_III',
    'GRAVISIMA',
    'Situaciones de agresión escolar que sean constitutivas de presuntos delitos contra la libertad, integridad y formación sexual, o cualquier otro delito establecido en la ley penal colombiana vigente, o agresiones que generen incapacidad médica o lesiones personales.',
    'Activación inmediata de la Ruta de Atención Integral: atención médica de urgencia si procede, comunicación inmediata a padres o acudientes, reporte formal e indelegable a ICBF, Policía de Infancia y Adolescencia o Fiscalía General de la Nación, y remisión prioritaria a Comité de Convivencia y Rectoría.',
    TRUE
);

-- 4. Áreas Curriculares Oficiales de Desempeño Docente
INSERT INTO areas_desempeno (nombre, descripcion, activo)
VALUES
('Matemáticas', 'Área de ciencias exactas, álgebra, cálculo y geometría', TRUE),
('Humanidades y Lengua Castellana', 'Lenguaje, comunicación, comprensión lectora y literatura', TRUE),
('Ciencias Naturales y Educación Ambiental', 'Biología, física, química y ecología', TRUE),
('Ciencias Sociales', 'Historia, geografía, democracia y constitución política', TRUE),
('Educación Física, Recreación y Deportes', 'Actividad motriz, desarrollo corporal y deportivo', TRUE),
('Educación Artística y Cultural', 'Artes plásticas, expresión visual y música', TRUE),
('Tecnología e Informática', 'Sistemas, computación y competencias tecnológicas', TRUE),
('Idioma Extranjero (Inglés)', 'Bilingüismo, comprensión y expresión en lengua extranjera', TRUE),
('Orientación / Convivencia', 'Equipo interdisciplinario de apoyo escolar y convivencia', TRUE),
('PENDIENTE POR REGISTRO', 'Área académica pendiente por asignar al docente', TRUE);

-- 5. Lugares Institucionales Comunes del Plantel Educativo
INSERT INTO lugares (nombre, descripcion, activo)
VALUES
('Aula de Clase', 'Salón de clase y ambientes académicos ordinarios', TRUE),
('Patio Central / Zona de Recreo', 'Área principal de recreo, descanso y formación cívica', TRUE),
('Canchas Deportivas', 'Canchas multifuncionales y escenarios deportivos', TRUE),
('Cafetería Escolar', 'Zona común de alimentación y estancia en descansos', TRUE),
('Biblioteca Institucional', 'Sala de lectura, consulta, estudio e investigación', TRUE),
('Laboratorio de Ciencias', 'Laboratorio integrado de química, física y biología', TRUE),
('Pasillos y Graderías', 'Áreas comunes de tránsito peatonal y acceso a aulas', TRUE),
('Entorno Exterior Inmediato del Plantel', 'Vías públicas, andenes y alrededores de acceso a la institución', TRUE);
