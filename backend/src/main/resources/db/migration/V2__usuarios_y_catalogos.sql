-- 1. Usuarios Directivos Iniciales (Password: Password123! con BCrypt factor 12)
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
    'Gomez Morales', 
    'orientador@disciplina.edu.co', 
    'ROLE_ORIENTADOR', 
    TRUE
);

-- 2. Lugares Iniciales del Plantel
INSERT INTO lugares (nombre, descripcion, activo)
VALUES 
('Aula de Clase 101', 'Salon de ensenanza basica bloque academico piso 1', TRUE),
('Aula de Clase 201', 'Salon de ensenanza media bloque academico piso 2', TRUE),
('Patio Central', 'Area principal de recreo y formacion civica', TRUE),
('Cafeteria Escolar', 'Zona comun de alimentacion y descanso', TRUE),
('Canchas Deportivas', 'Area de deportes y actividades de educacion fisica', TRUE),
('Biblioteca Institucional', 'Sala de lectura, consulta e investigacion', TRUE),
('Laboratorio de Ciencias', 'Laboratorio de quimica, fisica y biologia', TRUE),
('Pasillos y Graderias', 'Areas de transito peatonal comun', TRUE);

-- 3. Tipologia Legal Inicial del Catalogo de Faltas
INSERT INTO catalogo_faltas (codigo, clasificacion_ley, gravedad_institucional, descripcion, procedimiento_sugerido, activo)
VALUES 
(
    'ART-101-T1',
    'TIPO_I',
    'LEVE',
    'Uso no autorizado de dispositivos electronicos en clase o interrupcion del ambiente pedagogico ordinario.',
    'Amonestacion verbal formativa, dialogo reflexivo en el aula con el docente y consignacion de compromiso en el cuaderno de campo.',
    TRUE
),
(
    'ART-201-T2',
    'TIPO_II',
    'GRAVE',
    'Agresion verbal continuada, acoso escolar (bullying), dano intencional a bienes ajenos o afectacion al clima institucional sin lesiones fisicas incapacitantes.',
    'Remision a orientacion escolar, apertura de bitacora de debido proceso, notificacion inmediata y citacion a acudientes, registro formal de descargos y formulacion de plan de intervencion pedagogico.',
    TRUE
),
(
    'ART-301-T3',
    'TIPO_III',
    'GRAVISIMA',
    'Porte o uso de armas, comercializacion o consumo de sustancias psicoactivas, o agresiones fisicas que ocasionen lesiones personales.',
    'Atencion medica prioritaria si procede, activacion de la Ruta de Atencion Integral (remision a ICBF y Policia de Infancia), suspension preventiva y traslado inmediato a Comite de Convivencia y Rectoria.',
    TRUE
);