# Especificación Formal de Requisitos y Arquitectura de Software (SRS/SAD)
## Sistema de Gestión de la Convivencia Escolar y Analítica Disciplinaria (Disciplina Web)

**Versión:** 3.0.0-ENTERPRISE-SPEC  
**Estado:** Documento de Especificación Definitivo (Base para Construcción)  
**Clasificación:** Confidencial / Institucional  

---

## 1. Introducción
El presente documento consolida la especificación de ingeniería de software para el proyecto **Disciplina Web**, una solución orientada a modernizar y centralizar la gestión de la convivencia y el seguimiento de faltas disciplinarias en el entorno escolar. Este documento fusiona los requerimientos del sistema (SRS), la especificación de arquitectura (SAD), el modelo de datos relacional, las pautas de gobierno de Inteligencia Artificial y el plan de verificación y calidad de software.

---

## 2. Planteamiento del Problema
Tradicionalmente, las instituciones educativas registran los incidentes disciplinarios mediante observadores en papel o herramientas de escritorio locales aisladas (como la versión anterior del software en JavaFX + SQLite). Esta modalidad presenta problemáticas operativas y legales críticas:

* **Pérdida y fragmentación de información:** Inexistencia de un expediente único centralizado por estudiante que consolide antecedentes entre grados y años lectivos sucesivos.
* **Falta de concurrencia y bloqueos:** Dificultad para que múltiples dependencias (orientadores de distintas sedes/jornadas y equipo directivo) registren y consulten información simultáneamente sin corromper la base de datos local.
* **Riesgo de vulneración del debido proceso:** Omisión en la recolección estricta de descargos, evidencias y trazabilidad cronológica requerida por los manuales de convivencia y las leyes de convivencia escolar (como la Ley 1620 de Colombia).
* **Ausencia de analítica predictiva institucional:** Imposibilidad de que Rectoría visualice en tiempo real mapas de calor de conflictividad, focos de agresión o eficacia de las sanciones formativas aplicadas.

---

## 3. Justificación
La transición a un entorno web moderno cliente-servidor (Spring Boot + PostgreSQL + React) garantiza la inmutabilidad de los registros, alta disponibilidad y acceso controlado mediante autenticación criptográfica robusta. La incorporación de modelos de lenguaje natural (LLM vía Google Gemini) automatiza la transformación de relatos informales en actas de incidentes estructuradas y aporta un motor de razonamiento pedagógico que sugiere planes de intervención individualizados, transitando de un enfoque puramente punitivo a uno formativo y restaurativo.

---

## 4. Objetivos del Sistema

### 4.1 Objetivo General
Desarrollar e implementar una plataforma web centralizada y segura para el registro, trazabilidad de debido proceso, analítica directiva y generación de intervenciones pedagógicas asistidas por inteligencia artificial en el contexto de la convivencia escolar.

### 4.2 Objetivos Específicos
* Diseñar e implementar un esquema relacional normalizado en PostgreSQL con soporte para incidentes colectivos y snapshots inmutables que resuelvan la coherencia temporal de las matrículas año a año.
* Construir una API RESTful segura en Spring Boot 3 con control de acceso basado en roles (RBAC) exclusivo para directivos y orientadores escolares.
* Desarrollar un servicio de ingesta masiva de estudiantes y matrículas mediante procesamiento de hojas de cálculo (`.xlsx` / `.csv`).
* Integrar la API de Google Gemini como asistente de procesamiento de lenguaje natural (PLN) para la estandarización de hechos y la sugerencia de planes de intervención formativos.
* Diseñar una interfaz responsiva en React y Tailwind CSS que ofrezca paneles diferenciados de orientación (operativo) y rectoría (analítico).
* Implementar un motor de reportes documentales en memoria para la emisión de actas y consolidados disciplinarios en formato PDF.

---

## 5. Alcance del Sistema
* Gestión de catálogos institucionales: lugares del plantel y tipificación del manual de convivencia (Faltas Tipo I, II y III).
* Importación y actualización masiva por lotes de estudiantes y matrículas por año lectivo.
* Registro detallado de incidentes individuales y colectivos con asignación de roles a participantes (agresor, partícipe, víctima, testigo).
* Bitácora de debido proceso: registro de descargos, compromisos individuales y cambios de estado del caso.
* Asistencia de IA para la extracción de entidades desde narrativas informales y generación de borradores de intervención pedagógica.
* Tablero analítico directivo con mapas de calor y tasas de reincidencia.
* Auditoría transaccional de modificaciones sobre registros disciplinarios.

---

## 6. Fuera de Alcance (Out of Scope)
Para evitar la dispersión del alcance del proyecto, se delimita explícitamente que el sistema **NO**:
* Gestionará calificaciones académicas, boletines de notas ni planes de estudio curriculares.
* Administrará la asistencia diaria al aula (control de ausentismo ordinario).
* Permitirá acceso directo a estudiantes, padres de familia o docentes de aula (actúan solo como sujetos de información o notificables).
* Realizará cobros de matrículas, pensiones ni gestión financiera escolar.
* Tomará decisiones sancionatorias de forma automatizada mediante IA (la IA actúa exclusivamente como asistente consultivo bajo supervisión humana).

---

## 7. Actores del Sistema

| Actor | Tipo | Descripción y Responsabilidad |
| :--- | :--- | :--- |
| **Rector / Directivo** | Humano (Usuario) | Consulta tableros analíticos, supervisa el cumplimiento del debido proceso, audita incidentes graves/gravísimos y descarga informes ejecutivos oficiales. |
| **Orientador Escolar** | Humano (Usuario) | Registra incidentes, administra participantes, redacta o valida descargos, formula planes de intervención, registra seguimiento de casos y emite actas oficiales. |
| **Docente** | Humano (Entidad Externa) | Sujeto informante. No tiene usuario ni contraseña en el software; su nombre y documento se asocian al reporte como docente que remite el caso. |
| **Estudiante** | Humano (Entidad Externa) | Sujeto del proceso formativo. No interactúa con el software; sus datos biográficos y académicos son administrados institucionalmente. |
| **Acudiente** | Humano (Entidad Externa) | Sujeto de notificación y firma de compromisos. No accede directamente a la plataforma. |
| **Motor de IA (Gemini)** | Sistema Externo | Servicio de inferencia que asiste en la extracción de datos desde texto libre y formula recomendaciones pedagógicas estructuradas bajo solicitud del Orientador. |

---

## 8. Requisitos Funcionales (RF)
* **RF-01 (Autenticación y RBAC):** Autenticación mediante credenciales con hash BCrypt y emisión de JSON Web Tokens (JWT) con expiración controlada.
* **RF-02 (Carga Masiva de Matrículas):** Procesamiento de archivos `.xlsx` y `.csv` para registrar o actualizar estudiantes y asociarlos a su año lectivo, grado y grupo correspondiente sin promoción automática.
* **RF-03 (Registro de Incidentes Colectivos):** Creación de un incidente con fecha, hora, lugar, docente reportante y asociación de múltiples alumnos con roles diferenciados y captura del snapshot del salón al momento del hecho.
* **RF-04 (Gestión del Debido Proceso):** Registro de descargos del estudiante, compromisos adquiridos y transición de estados del incidente (`REPORTADO`, `EN_INDAGACION`, `CITACION_PADRES`, `EN_INTERVENCION`, `CERRADO`).
* **RF-05 (Asistente PLN de Redacción):** Interfaz para procesar texto informal y mapear automáticamente estudiantes, lugares y tipología preliminar en un formulario editable.
* **RF-06 (Generador de Planes de Intervención):** Consulta del expediente histórico y generación estructurada de diagnósticos formativos, compromisos familiares y tareas restaurativas.
* **RF-07 (Dashboard Analítico):** Cálculo en tiempo real de incidentes por tipología, lugares más frecuentes, franjas horarias críticas e índice de efectividad de las intervenciones.
* **RF-08 (Generación Documental en PDF):** Generación en memoria de actas de descargos, compromisos disciplinarios y consolidados anuales directivos.

---

## 9. Requisitos No Funcionales (RNF)
* **RNF-01 (Seguridad y Privacidad):** Cifrado de contraseñas con factor de coste 12. Los prompts enviados a modelos externos deben excluir números de identificación personal y datos de salud de los menores.
* **RNF-02 (Rendimiento Transaccional):** Tiempo de respuesta menor a 250 ms en consultas CRUD ordinarias (percentil 95).
* **RNF-03 (Concurrencia e Integridad):** Soporte multiusuario con transacciones ACID en PostgreSQL y pool de conexiones HikariCP configurado entre 10 y 30 conexiones activas.
* **RNF-04 (Tolerancia a Fallos en IA):** Timeout de 8 segundos en llamadas a Gemini. Si la API no responde, el sistema permitirá el diligenciamiento manual tradicional sin bloquear la interfaz.
* **RNF-05 (Mantenibilidad y Arquitectura Limpia):** Backend desacoplado por capas funcionales y frontend estructurado bajo arquitectura por módulos/features en TypeScript.

---

## 10. Casos de Uso del Sistema (CU)

```text
                      ┌──────────────────────┐
                      │  Sistema Disciplina  │
                      │         Web          │
                      └──────────┬───────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
   [Orientador]                                       [Rector]
         │                                               │
         ├─► CU-01: Iniciar Sesión                       ├─► CU-01: Iniciar Sesión
         ├─► CU-02: Cargar Matrículas (Excel)            ├─► CU-08: Consultar Expediente
         ├─► CU-03: Registrar Incidente Colectivo         ├─► CU-10: Consultar Dashboard
         ├─► CU-04: Registrar Descargos y Proceso        └─► CU-11: Generar Reporte PDF
         ├─► CU-05: Procesar Narrativa con PLN (IA)
         ├─► CU-06: Generar Plan de Intervención (IA)
         ├─► CU-07: Registrar Seguimiento de Caso
         ├─► CU-08: Consultar Expediente de Estudiante
         └─► CU-11: Generar Reporte PDF (Acta)
```

* **CU-01 (Iniciar Sesión):** Autentica usuario y contraseña, emitiendo el token JWT según el rol asignado.
* **CU-02 (Cargar Matrículas):** Sube archivo `.xlsx`, valida cabeceras y tipos de datos, e inserta o actualiza la relación estudiante-año lectivo.
* **CU-03 (Registrar Incidente):** Ingresa lugar, fecha, hora, docente informante y añade estudiantes involucrados con su respectivo rol de participación.
* **CU-04 (Gestionar Debido Proceso):** Registra versiones de descargos de cada estudiante y cambia el estado del trámite disciplinario.
* **CU-05 (Procesar Narrativa PLN):** Envía texto informal a Gemini y autocompleta el formulario de incidente para validación humana.
* **CU-06 (Generar Intervención IA):** Envía historial disciplinario anonimizado a Gemini y obtiene una propuesta pedagógica restaurativa estructurada.
* **CU-07 (Registrar Seguimiento):** Agrega notas de cumplimiento o incumplimiento a un plan de intervención activo.
* **CU-08 (Consultar Expediente):** Muestra el historial cronológico completo de un alumno a lo largo de todos sus años cursados.
* **CU-10 (Consultar Dashboard):** Visualiza mapas de calor, incidentes por grado y métricas globales del plantel.
* **CU-11 (Generar Reporte PDF):** Emite documento formal en memoria listo para descarga e impresión.

---

## 11. Criterios de Aceptación (Formato BDD)

### Criterio 1: Snapshot Inmutable en Incidentes
* **Dado** un estudiante registrado en el año lectivo 2026 en el grado 6-01.
* **Cuando** el orientador registra un incidente disciplinario contra dicho alumno en 2026.
* **Entonces** el sistema debe almacenar de forma fija `grado_momento = '6'` y `grupo_momento = '01'`, y dicho registro debe conservar esos valores incluso si el estudiante es matriculado en 7-01 en el año 2027.

### Criterio 2: Resiliencia del Asistente de IA
* **Dado** que un orientador envía un texto informal para procesamiento con PLN.
* **Cuando** el servicio de Gemini excede el timeout de 8 segundos o devuelve un código de error de red.
* **Entonces** la aplicación debe mostrar una alerta no bloqueante informando de la indisponibilidad de la IA y permitir el llenado manual de los campos sin pérdida de datos en el formulario.

### Criterio 3: Integridad de Auditoría
* **Dado** un incidente previamente registrado y almacenado en la base de datos.
* **Cuando** cualquier usuario con rol autorizado modifica la tipología o descripción del hecho.
* **Entonces** la base de datos debe generar un registro automático en la tabla `auditoria_sistema` guardando el identificador del usuario, fecha, hora, estado anterior y nuevo en formato JSONB.

---

## 12. Arquitectura del Sistema
El sistema adopta una arquitectura cliente-servidor desacoplada:

* **Capa de Presentación (Frontend):** Aplicación de una sola página (SPA) desarrollada en React 18 con TypeScript y empaquetada con Vite. Utiliza Tailwind CSS para la interfaz visual y TanStack Query para el consumo eficiente de la API REST.
* **Capa de Aplicación y Dominio (Backend):** Arquitectura en capas limpia sobre Spring Boot 3 (Java 17/21 LTS). Los controladores exponen contratos RESTful asegurados por Spring Security con filtros JWT. La lógica de negocio reside en servicios transaccionales aislados de la infraestructura.
* **Capa de Persistencia:** PostgreSQL 16 configurado con aislamiento transaccional estándar (*Read Committed*), administrado mediante migraciones versionadas con Flyway.
* **Capa de Integración Cognitiva:** Cliente HTTP no bloqueante que se comunica de forma cifrada con los endpoints de Google Gemini mediante API Keys almacenadas en variables de entorno del servidor.

---

## 13. Tecnologías Seleccionadas y Justificación
* **Java 21 / Spring Boot 3.3:** Estabilidad corporativa, tipado estático robusto, excelente manejo de concurrencia y framework de seguridad líder (Spring Security).
* **PostgreSQL 16:** Motor de bases de datos relacional de clase mundial, soporte nativo de tipos JSONB para auditoría y capacidades de indexación avanzada.
* **React 18 & TypeScript:** Ecosistema maduro, desarrollo de interfaces reactivas por componentes y seguridad en tiempo de compilación para prevenir errores de tipo.
* **Tailwind CSS:** Diseño utilitario responsivo, ideal para dashboards directivos limpios y formularios densos de orientación.
* **Apache POI:** Estándar de la industria para la lectura y escritura confiable de archivos binarios de Microsoft Excel (`.xlsx`).
* **OpenPDF / iText:** Librerías para generación de reportes vectoriales en PDF de alta fidelidad directamente en flujos de memoria (`StreamingResponseBody`).
* **Google Gemini Pro:** Modelo fundacional con capacidades avanzadas de extracción sintáctica y cumplimiento determinista de formatos JSON Schema.

---

## 14. Diseño Detallado de la Base de Datos (PostgreSQL DDL)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Usuarios del Sistema (Solo Orientación y Rectoría)
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

-- 3. Identidad del Estudiante (Sin grado volátil)
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

-- 4. Matrículas Anuales (Gestión Académica Temporal)
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

-- 6. Catálogo del Manual de Convivencia
CREATE TABLE catalogo_faltas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    clasificacion_ley VARCHAR(10) NOT NULL CHECK (clasificacion_ley IN ('TIPO_I', 'TIPO_II', 'TIPO_III')),
    gravedad_institucional VARCHAR(20) NOT NULL CHECK (gravedad_institucional IN ('LEVE', 'GRAVE', 'GRAVISIMA')),
    descripcion TEXT NOT NULL,
    procedimiento_sugerido TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 7. Incidentes Fácticos
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
    
    -- SNAPSHOT HISTÓRICO INMUTABLE
    anio_lectivo INT NOT NULL,
    grado_momento VARCHAR(10) NOT NULL,
    grupo_momento VARCHAR(10) NOT NULL,
    
    rol_estudiante VARCHAR(20) NOT NULL CHECK (rol_estudiante IN ('AGRESOR_PRINCIPAL', 'PARTICIPE', 'VICTIMA', 'TESTIGO')),
    descargo_estudiante TEXT,
    compromiso_individual TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_incidente_estudiante UNIQUE (incidente_id, estudiante_id)
);

-- 9. Planes de Intervención Pedagógica
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

-- 11. Auditoría Transaccional Global
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

-- Índices de Rendimiento
CREATE INDEX idx_matriculas_anio_grado ON matriculas_estudiante(anio_lectivo, grado, grupo);
CREATE INDEX idx_incidentes_fecha ON incidentes(fecha_incidente);
CREATE INDEX idx_incidente_part_snapshot ON incidente_estudiantes(anio_lectivo, grado_momento);
CREATE INDEX idx_auditoria_entidad ON auditoria_sistema(entidad, entidad_id);
```

---

## 15. Diseño de la API RESTful

| Método | Ruta | Acceso | Descripción Funcional |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Público | Autentica credenciales y emite token Bearer JWT. |
| `POST` | `/api/v1/matriculas/importar-masivo` | Rector / Orientador | Recibe archivo `.xlsx`/`.csv` y registra matrículas anuales. |
| `GET` | `/api/v1/incidentes` | Orientador / Rector | Búsqueda paginada con filtros por fecha, grado snapshot o tipología. |
| `POST` | `/api/v1/incidentes` | Orientador | Registra incidente colectivo con lista de participantes y captura de snapshots. |
| `PATCH` | `/api/v1/incidentes/{id}/estado` | Orientador / Rector | Actualiza el estado de debido proceso de un caso. |
| `POST` | `/api/v1/ia/procesar-narrativa` | Orientador | Procesa texto libre con Gemini y extrae entidades para el formulario. |
| `POST` | `/api/v1/ia/generar-intervencion` | Orientador | Genera propuesta pedagógica y restaurativa estructurada en JSON. |
| `GET` | `/api/v1/rectoria/metricas-dashboard` | Solo Rector | Provee datos consolidados para gráficas y mapas de calor. |
| `GET` | `/api/v1/reportes/pdf/incidente/{id}` | Orientador / Rector | Descarga en streaming el acta formal de descargos. |

---

## 16. Arquitectura, Gobierno y Límites de la Inteligencia Artificial

### 16.1 Principio Rector: Human-in-the-Loop (El Humano Decide)
El sistema establece de forma explícita que:
* La inteligencia artificial **NO** toma decisiones disciplinarias ni impone sanciones.
* La clasificación de tipología o gravedad sugerida por la IA es de carácter estrictamente preliminar e informativo.
* La IA no tiene permisos directos de escritura en la base de datos. Sus respuestas se proyectan en el frontend de React para que el Orientador las revise, edite o descarte.
* La IA no puede transicionar estados de un incidente ni cerrar expedientes de debido proceso.

### 16.2 Flujo de Datos y Privacidad
* El backend recibe la solicitud y filtra los datos personales sensibles antes de contactar con la API externa (omisión de número de documento y antecedentes médicos).
* Se utiliza el modo estructurado de Gemini (`response_mime_type: "application/json"`) con esquemas JSON rígidos.
* En la tabla de planes de intervención, queda registrado mediante una bandera booleana (`fue_asistido_por_ia`) y el texto sugerido original para trazabilidad de auditoría.

---

## 17. Seguridad del Sistema
* **Autenticación Stateless:** Tokens JWT firmados criptográficamente que no guardan estado en servidor, permitiendo escalabilidad horizontal.
* **Autorización Granular (RBAC):** Uso de anotaciones `@PreAuthorize("hasRole('ROLE_RECTOR')")` en controladores para blindar endpoints analíticos y directivos frente a intentos de acceso no permitidos.
* **Control de Inyección y Sanitización:** Consultas parametrizadas en JPA/Hibernate previniendo inyecciones SQL, y sanitización de cadenas en inputs de texto frente a ataques XSS.

---

## 18. Auditoría y Trazabilidad Forense
Mediante un interceptor de persistencia en Spring Data JPA (o escuchador de entidades `@EntityListeners`), cada operación de inserción, actualización o baja lógica sobre las tablas centrales (`incidentes`, `incidente_estudiantes`, `planes_intervencion`) genera una entrada asíncrona en `auditoria_sistema`.  
Se registra el identificador del usuario actor, la dirección IP de origen, el timestamp y la comparación del estado previo y posterior en columnas de tipo JSONB.

---

## 19. Plan de Pruebas y Aseguramiento de Calidad (QA)
* **Pruebas Unitarias (JUnit 5 + Mockito):** Validación de lógica de negocio en servicios, cálculo de snapshots, parsing de archivos Excel y evaluadores de permisos de usuario.
* **Pruebas de Integración (Testcontainers + PostgreSQL):** Verificación de repositorios JPA y restricciones relacionales sobre un contenedor real de PostgreSQL levantado dinámicamente en memoria.
* **Pruebas de Simulación de Fallos de IA (Mocking WireMock):** Verificación del comportamiento del sistema ante caídas de red de Google Gemini, respuestas truncadas, timeouts de 8 segundos o JSON malformados.
* **Pruebas de Seguridad (Spring Security Test):** Intentos de ataque simulados con tokens expirados, firmas manipuladas y orientadores intentando invocar endpoints exclusivos de Rectoría.
* **Pruebas de Frontend (Playwright / Cypress):** Pruebas de extremo a extremo (E2E) validando el flujo de carga masiva de Excel y el correcto autocompletado del modal de asistencia con IA.

---

## 20. Roadmap de Implementación y Fases

```text
[Sprint 1: Core] ────► [Sprint 2: Matrículas] ────► [Sprint 3: Incidentes]
 (Infra + Auth)         (Apache POI Excel)            (Casos Colectivos)
                                                              │
[Sprint 6: Entrega] ◄─── [Sprint 5: Frontend] ◄──── [Sprint 4: IA Engine]
 (Dashboards + PDF)      (Vite + Tailwind UI)          (Gemini API + PLN)
```

* **Sprint 1:** Infraestructura y Autenticación
* **Sprint 2:** Importador Masivo y Matrículas
* **Sprint 3:** Incidentes Colectivos y Debido Proceso
* **Sprint 4:** Motor de Integración de IA
* **Sprint 5:** Interfaz Web de Orientación
* **Sprint 6:** Panel de Rectoría, Generador PDF y Despliegue

---

## 21. Matriz de Entregables por Sprint

| Sprint | Entregable Técnico Verificable | Criterio de Finalización (*Definition of Done*) |
| :--- | :--- | :--- |
| **Sprint 1** | Monorepo base, contenedor Docker con PostgreSQL 16 y API funcional de Login con JWT. | Pruebas unitarias de autenticación en verde y scripts Flyway aplicados sin error. |
| **Sprint 2** | Endpoint y vista funcional para la subida de planillas Excel (`.xlsx`) y persistencia en `matriculas_estudiante`. | Capacidad de importar un archivo de 500 alumnos en menos de 3 segundos reportando inconsistencias. |
| **Sprint 3** | CRUD transaccional de incidentes colectivos con captura probada de snapshots de grado y roles de alumno. | Creación de un incidente con 3 alumnos y verificación de que los grados inmutables se grabaron correctamente. |
| **Sprint 4** | Integración del SDK de Gemini en Spring Boot y endpoints de parseo textual de narrativas informales. | Inyección de 10 narrativas de prueba con extracción precisa de entidades y manejo correcto de fallbacks. |
| **Sprint 5** | Interfaz SPA completa para Orientador en React: formulario interactivo asistido por IA y consulta de expedientes. | Orientador puede redactar un caso, validarlo en pantalla y almacenarlo sin consultar la consola técnica. |
| **Sprint 6** | Dashboard de Rectoría con Recharts, motor OpenPDF de actas en memoria y `docker-compose.yml` de despliegue. | Descarga exitosa de acta en PDF de un caso real y dashboard mostrando métricas agregadas correctas. |

---

## 22. Matriz de Gestión de Riesgos

| Riesgo Identificado | Probabilidad | Impacto | Estrategia de Mitigación |
| :--- | :---: | :---: | :--- |
| **Agotamiento de cuota o latencia en API de Gemini** | Media | Medio | Implementación de fallback automático a registro manual sin bloquear la experiencia de usuario. |
| **Inconsistencias en formato de Excel de matrícula** | Alta | Medio | Validación estricta celda por celda antes de iniciar la transacción de base de datos; rechazo atómico con informe de errores por fila. |
| **Alteración de registros disciplinarios cerrados** | Baja | Crítico | Restricción a nivel de base de datos (`TRIGGER` o reglas de servicio) que impide la edición de incidentes en estado `CERRADO`. |
| **Filtración de datos sensibles de menores** | Baja | Crítico | Sanitización de prompts en backend (anonimización) y almacenamiento seguro de claves API fuera del código fuente. |
