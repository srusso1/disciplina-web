CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Usuarios del Sistema (Solo Orientacion y Rectoria)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    rol VARCHAR(30) NOT NULL CHECK (rol IN ('ROLE_RECTOR', 'ROLE_ORIENTADOR')),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Lugares del Plantel
CREATE TABLE lugares (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. Identidad del Estudiante (Sin grado volatil)
CREATE TABLE estudiantes (
    id SERIAL PRIMARY KEY,
    documento VARCHAR(25) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    nombre_acudiente VARCHAR(150),
    telefono_acudiente VARCHAR(30),
    email_acudiente VARCHAR(120),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Matriculas Anuales (Gestion Academica Temporal)
CREATE TABLE matriculas_estudiante (
    id SERIAL PRIMARY KEY,
    estudiante_id INT NOT NULL REFERENCES estudiantes(id) ON DELETE RESTRICT,
    anio_lectivo INT NOT NULL,
    grado VARCHAR(10) NOT NULL,
    grupo VARCHAR(10) NOT NULL,
    jornada VARCHAR(20) NOT NULL DEFAULT 'MANANA',
    estado_matricula VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado_matricula IN ('ACTIVO', 'GRADUADO', 'RETIRADO')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_estudiante_anio UNIQUE (estudiante_id, anio_lectivo)
);

-- 5. Docentes (Informantes)
CREATE TABLE docentes (
    id SERIAL PRIMARY KEY,
    documento VARCHAR(25) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    area_desempeno VARCHAR(100),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 6. Catalogo del Manual de Convivencia
CREATE TABLE catalogo_faltas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    clasificacion_ley VARCHAR(10) NOT NULL CHECK (clasificacion_ley IN ('TIPO_I', 'TIPO_II', 'TIPO_III')),
    gravedad_institucional VARCHAR(20) NOT NULL CHECK (gravedad_institucional IN ('LEVE', 'GRAVE', 'GRAVISIMA')),
    descripcion TEXT NOT NULL,
    procedimiento_sugerido TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 7. Incidentes Facticos
CREATE TABLE incidentes (
    id SERIAL PRIMARY KEY,
    docente_reporta_id INT NOT NULL REFERENCES docentes(id) ON DELETE RESTRICT,
    lugar_id INT NOT NULL REFERENCES lugares(id) ON DELETE RESTRICT,
    usuario_registro_id INT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    fecha_incidente DATE NOT NULL,
    hora_incidente TIME,
    descripcion_hechos TEXT NOT NULL,
    estado_proceso VARCHAR(30) NOT NULL DEFAULT 'REPORTADO' 
        CHECK (estado_proceso IN ('REPORTADO', 'EN_INDAGACION', 'CITACION_PADRES', 'EN_INTERVENCION', 'CERRADO')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Participantes del Incidente (Soporte Colectivo + Snapshot)
CREATE TABLE incidente_estudiantes (
    id SERIAL PRIMARY KEY,
    incidente_id INT NOT NULL REFERENCES incidentes(id) ON DELETE CASCADE,
    estudiante_id INT NOT NULL REFERENCES estudiantes(id) ON DELETE RESTRICT,
    catalogo_falta_id INT REFERENCES catalogo_faltas(id) ON DELETE RESTRICT,
    
    -- SNAPSHOT HISTORICO INMUTABLE
    anio_lectivo INT NOT NULL,
    grado_momento VARCHAR(10) NOT NULL,
    grupo_momento VARCHAR(10) NOT NULL,
    
    rol_estudiante VARCHAR(20) NOT NULL CHECK (rol_estudiante IN ('AGRESOR_PRINCIPAL', 'PARTICIPE', 'VICTIMA', 'TESTIGO')),
    descargo_estudiante TEXT,
    compromiso_individual TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_incidente_estudiante UNIQUE (incidente_id, estudiante_id)
);

-- 9. Planes de Intervencion Pedagogica
CREATE TABLE planes_intervencion (
    id SERIAL PRIMARY KEY,
    estudiante_id INT NOT NULL REFERENCES estudiantes(id) ON DELETE RESTRICT,
    incidente_origen_id INT REFERENCES incidentes(id) ON DELETE SET NULL,
    orientador_id INT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    diagnostico_situacional TEXT NOT NULL,
    recomendaciones_ia TEXT,
    acciones_acordadas TEXT NOT NULL,
    compromiso_padres TEXT,
    fecha_proximo_seguimiento DATE,
    estado VARCHAR(25) NOT NULL DEFAULT 'EN_SEGUIMIENTO' 
        CHECK (estado IN ('BORRADOR', 'EN_SEGUIMIENTO', 'CUMPLIDO', 'INCUMPLIDO')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Seguimientos a Planes
CREATE TABLE seguimientos_caso (
    id SERIAL PRIMARY KEY,
    plan_id INT NOT NULL REFERENCES planes_intervencion(id) ON DELETE CASCADE,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    observacion TEXT NOT NULL,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Auditoria Transaccional Global
CREATE TABLE auditoria_sistema (
    id BIGSERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(20) NOT NULL,
    entidad VARCHAR(50) NOT NULL,
    entidad_id VARCHAR(50) NOT NULL,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_origen VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices de Rendimiento
CREATE INDEX idx_matriculas_anio_grado ON matriculas_estudiante(anio_lectivo, grado, grupo);
CREATE INDEX idx_incidentes_fecha ON incidentes(fecha_incidente);
CREATE INDEX idx_incidente_part_snapshot ON incidente_estudiantes(anio_lectivo, grado_momento);
CREATE INDEX idx_auditoria_entidad ON auditoria_sistema(entidad, entidad_id);