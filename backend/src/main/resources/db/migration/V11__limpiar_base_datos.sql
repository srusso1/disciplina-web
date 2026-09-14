-- V11: Limpieza completa de registros transaccionales y de prueba
-- Deja la base de datos vacía conservando únicamente las cuentas principales de acceso (rector y orientador)

TRUNCATE TABLE
    auditoria_sistema,
    seguimientos_caso,
    planes_intervencion,
    incidente_estudiantes,
    incidentes,
    matriculas_estudiante,
    estudiantes,
    docentes,
    lugares,
    catalogo_faltas,
    usuarios
RESTART IDENTITY CASCADE;

-- Re-sembrar credenciales maestras de acceso institucional (password: Password123! con BCrypt factor 12)
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
