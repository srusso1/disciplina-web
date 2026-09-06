--
-- PostgreSQL database dump
--

\restrict 7pnUNgB1tGDSUxADgm6tS2hqpmYJJy8utuWZ3LguvokoEggGDvNEUzRFyVxEC7e

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.seguimientos_caso DROP CONSTRAINT IF EXISTS seguimientos_caso_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seguimientos_caso DROP CONSTRAINT IF EXISTS seguimientos_caso_plan_id_fkey;
ALTER TABLE IF EXISTS ONLY public.planes_intervencion DROP CONSTRAINT IF EXISTS planes_intervencion_orientador_id_fkey;
ALTER TABLE IF EXISTS ONLY public.planes_intervencion DROP CONSTRAINT IF EXISTS planes_intervencion_incidente_origen_id_fkey;
ALTER TABLE IF EXISTS ONLY public.planes_intervencion DROP CONSTRAINT IF EXISTS planes_intervencion_estudiante_id_fkey;
ALTER TABLE IF EXISTS ONLY public.matriculas_estudiante DROP CONSTRAINT IF EXISTS matriculas_estudiante_estudiante_id_fkey;
ALTER TABLE IF EXISTS ONLY public.incidentes DROP CONSTRAINT IF EXISTS incidentes_usuario_registro_id_fkey;
ALTER TABLE IF EXISTS ONLY public.incidentes DROP CONSTRAINT IF EXISTS incidentes_lugar_id_fkey;
ALTER TABLE IF EXISTS ONLY public.incidentes DROP CONSTRAINT IF EXISTS incidentes_docente_reporta_id_fkey;
ALTER TABLE IF EXISTS ONLY public.incidente_estudiantes DROP CONSTRAINT IF EXISTS incidente_estudiantes_incidente_id_fkey;
ALTER TABLE IF EXISTS ONLY public.incidente_estudiantes DROP CONSTRAINT IF EXISTS incidente_estudiantes_estudiante_id_fkey;
ALTER TABLE IF EXISTS ONLY public.incidente_estudiantes DROP CONSTRAINT IF EXISTS incidente_estudiantes_catalogo_falta_id_fkey;
ALTER TABLE IF EXISTS ONLY public.auditoria_sistema DROP CONSTRAINT IF EXISTS auditoria_sistema_usuario_id_fkey;
DROP INDEX IF EXISTS public.idx_seguimientos_caso_plan;
DROP INDEX IF EXISTS public.idx_planes_intervencion_estudiante;
DROP INDEX IF EXISTS public.idx_matriculas_anio_grado;
DROP INDEX IF EXISTS public.idx_incidentes_fecha;
DROP INDEX IF EXISTS public.idx_incidente_part_snapshot;
DROP INDEX IF EXISTS public.idx_incidente_estudiantes_estudiante;
DROP INDEX IF EXISTS public.idx_estudiantes_apellidos_nombres;
DROP INDEX IF EXISTS public.idx_auditoria_entidad;
DROP INDEX IF EXISTS public.flyway_schema_history_s_idx;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_username_key;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_email_key;
ALTER TABLE IF EXISTS ONLY public.incidente_estudiantes DROP CONSTRAINT IF EXISTS uq_incidente_estudiante;
ALTER TABLE IF EXISTS ONLY public.matriculas_estudiante DROP CONSTRAINT IF EXISTS uq_estudiante_anio;
ALTER TABLE IF EXISTS ONLY public.seguimientos_caso DROP CONSTRAINT IF EXISTS seguimientos_caso_pkey;
ALTER TABLE IF EXISTS ONLY public.planes_intervencion DROP CONSTRAINT IF EXISTS planes_intervencion_pkey;
ALTER TABLE IF EXISTS ONLY public.matriculas_estudiante DROP CONSTRAINT IF EXISTS matriculas_estudiante_pkey;
ALTER TABLE IF EXISTS ONLY public.lugares DROP CONSTRAINT IF EXISTS lugares_pkey;
ALTER TABLE IF EXISTS ONLY public.lugares DROP CONSTRAINT IF EXISTS lugares_nombre_key;
ALTER TABLE IF EXISTS ONLY public.incidentes DROP CONSTRAINT IF EXISTS incidentes_pkey;
ALTER TABLE IF EXISTS ONLY public.incidente_estudiantes DROP CONSTRAINT IF EXISTS incidente_estudiantes_pkey;
ALTER TABLE IF EXISTS ONLY public.flyway_schema_history DROP CONSTRAINT IF EXISTS flyway_schema_history_pk;
ALTER TABLE IF EXISTS ONLY public.estudiantes DROP CONSTRAINT IF EXISTS estudiantes_pkey;
ALTER TABLE IF EXISTS ONLY public.estudiantes DROP CONSTRAINT IF EXISTS estudiantes_documento_key;
ALTER TABLE IF EXISTS ONLY public.docentes DROP CONSTRAINT IF EXISTS docentes_pkey;
ALTER TABLE IF EXISTS ONLY public.docentes DROP CONSTRAINT IF EXISTS docentes_documento_key;
ALTER TABLE IF EXISTS ONLY public.catalogo_faltas DROP CONSTRAINT IF EXISTS catalogo_faltas_pkey;
ALTER TABLE IF EXISTS ONLY public.catalogo_faltas DROP CONSTRAINT IF EXISTS catalogo_faltas_codigo_key;
ALTER TABLE IF EXISTS ONLY public.auditoria_sistema DROP CONSTRAINT IF EXISTS auditoria_sistema_pkey;
ALTER TABLE IF EXISTS public.usuarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.seguimientos_caso ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.planes_intervencion ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.matriculas_estudiante ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.lugares ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.incidentes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.incidente_estudiantes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.estudiantes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.docentes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.catalogo_faltas ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.auditoria_sistema ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.usuarios_id_seq;
DROP TABLE IF EXISTS public.usuarios;
DROP SEQUENCE IF EXISTS public.seguimientos_caso_id_seq;
DROP TABLE IF EXISTS public.seguimientos_caso;
DROP SEQUENCE IF EXISTS public.planes_intervencion_id_seq;
DROP TABLE IF EXISTS public.planes_intervencion;
DROP SEQUENCE IF EXISTS public.matriculas_estudiante_id_seq;
DROP TABLE IF EXISTS public.matriculas_estudiante;
DROP SEQUENCE IF EXISTS public.lugares_id_seq;
DROP TABLE IF EXISTS public.lugares;
DROP SEQUENCE IF EXISTS public.incidentes_id_seq;
DROP TABLE IF EXISTS public.incidentes;
DROP SEQUENCE IF EXISTS public.incidente_estudiantes_id_seq;
DROP TABLE IF EXISTS public.incidente_estudiantes;
DROP TABLE IF EXISTS public.flyway_schema_history;
DROP SEQUENCE IF EXISTS public.estudiantes_id_seq;
DROP TABLE IF EXISTS public.estudiantes;
DROP SEQUENCE IF EXISTS public.docentes_id_seq;
DROP TABLE IF EXISTS public.docentes;
DROP SEQUENCE IF EXISTS public.catalogo_faltas_id_seq;
DROP TABLE IF EXISTS public.catalogo_faltas;
DROP SEQUENCE IF EXISTS public.auditoria_sistema_id_seq;
DROP TABLE IF EXISTS public.auditoria_sistema;
DROP EXTENSION IF EXISTS "uuid-ossp";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: admin_disciplina
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO admin_disciplina;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: admin_disciplina
--

COMMENT ON SCHEMA public IS '';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auditoria_sistema; Type: TABLE; Schema: public; Owner: admin_disciplina
--

CREATE TABLE public.auditoria_sistema (
    id bigint NOT NULL,
    usuario_id integer,
    accion character varying(50) NOT NULL,
    entidad character varying(50) NOT NULL,
    entidad_id character varying(50) NOT NULL,
    datos_anteriores jsonb,
    datos_nuevos jsonb,
    ip_origen character varying(45),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.auditoria_sistema OWNER TO admin_disciplina;

--
-- Name: auditoria_sistema_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_disciplina
--

CREATE SEQUENCE public.auditoria_sistema_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditoria_sistema_id_seq OWNER TO admin_disciplina;

--
-- Name: auditoria_sistema_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_disciplina
--

ALTER SEQUENCE public.auditoria_sistema_id_seq OWNED BY public.auditoria_sistema.id;


--
-- Name: catalogo_faltas; Type: TABLE; Schema: public; Owner: admin_disciplina
--

CREATE TABLE public.catalogo_faltas (
    id integer NOT NULL,
    codigo character varying(20) NOT NULL,
    clasificacion_ley character varying(10) NOT NULL,
    gravedad_institucional character varying(20) NOT NULL,
    descripcion text NOT NULL,
    procedimiento_sugerido text,
    activo boolean DEFAULT true NOT NULL,
    CONSTRAINT catalogo_faltas_clasificacion_ley_check CHECK (((clasificacion_ley)::text = ANY ((ARRAY['TIPO_I'::character varying, 'TIPO_II'::character varying, 'TIPO_III'::character varying])::text[]))),
    CONSTRAINT catalogo_faltas_gravedad_institucional_check CHECK (((gravedad_institucional)::text = ANY ((ARRAY['LEVE'::character varying, 'GRAVE'::character varying, 'GRAVISIMA'::character varying])::text[])))
);


ALTER TABLE public.catalogo_faltas OWNER TO admin_disciplina;

--
-- Name: catalogo_faltas_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_disciplina
--

CREATE SEQUENCE public.catalogo_faltas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_faltas_id_seq OWNER TO admin_disciplina;

--
-- Name: catalogo_faltas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_disciplina
--

ALTER SEQUENCE public.catalogo_faltas_id_seq OWNED BY public.catalogo_faltas.id;


--
-- Name: docentes; Type: TABLE; Schema: public; Owner: admin_disciplina
--

CREATE TABLE public.docentes (
    id integer NOT NULL,
    documento character varying(25) NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    area_desempeno character varying(100),
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.docentes OWNER TO admin_disciplina;

--
-- Name: docentes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_disciplina
--

CREATE SEQUENCE public.docentes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.docentes_id_seq OWNER TO admin_disciplina;

--
-- Name: docentes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_disciplina
--

ALTER SEQUENCE public.docentes_id_seq OWNED BY public.docentes.id;


--
-- Name: estudiantes; Type: TABLE; Schema: public; Owner: admin_disciplina
--

CREATE TABLE public.estudiantes (
    id integer NOT NULL,
    documento character varying(25) NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    nombre_acudiente character varying(150),
    telefono_acudiente character varying(30),
    email_acudiente character varying(120),
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.estudiantes OWNER TO admin_disciplina;

--
-- Name: estudiantes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_disciplina
--

CREATE SEQUENCE public.estudiantes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estudiantes_id_seq OWNER TO admin_disciplina;

--
-- Name: estudiantes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_disciplina
--

ALTER SEQUENCE public.estudiantes_id_seq OWNED BY public.estudiantes.id;


--
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: admin_disciplina
--

CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE public.flyway_schema_history OWNER TO admin_disciplina;

--
-- Name: incidente_estudiantes; Type: TABLE; Schema: public; Owner: admin_disciplina
--

CREATE TABLE public.incidente_estudiantes (
    id integer NOT NULL,
    incidente_id integer NOT NULL,
    estudiante_id integer NOT NULL,
    catalogo_falta_id integer,
    anio_lectivo integer NOT NULL,
    grado_momento character varying(10) NOT NULL,
    grupo_momento character varying(10) NOT NULL,
    rol_estudiante character varying(20) NOT NULL,
    descargo_estudiante text,
    compromiso_individual text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT incidente_estudiantes_rol_estudiante_check CHECK (((rol_estudiante)::text = ANY ((ARRAY['AGRESOR_PRINCIPAL'::character varying, 'PARTICIPE'::character varying, 'VICTIMA'::character varying, 'TESTIGO'::character varying])::text[])))
);


ALTER TABLE public.incidente_estudiantes OWNER TO admin_disciplina;

--
-- Name: incidente_estudiantes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_disciplina
--

CREATE SEQUENCE public.incidente_estudiantes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incidente_estudiantes_id_seq OWNER TO admin_disciplina;

--
-- Name: incidente_estudiantes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_disciplina
--

ALTER SEQUENCE public.incidente_estudiantes_id_seq OWNED BY public.incidente_estudiantes.id;


--
-- Name: incidentes; Type: TABLE; Schema: public; Owner: admin_disciplina
--

CREATE TABLE public.incidentes (
    id integer NOT NULL,
    docente_reporta_id integer NOT NULL,
    lugar_id integer NOT NULL,
    usuario_registro_id integer NOT NULL,
    fecha_incidente date NOT NULL,
    hora_incidente time without time zone,
    descripcion_hechos text NOT NULL,
    estado_proceso character varying(30) DEFAULT 'REPORTADO'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT incidentes_estado_proceso_check CHECK (((estado_proceso)::text = ANY ((ARRAY['REPORTADO'::character varying, 'EN_INDAGACION'::character varying, 'CITACION_PADRES'::character varying, 'EN_INTERVENCION'::character varying, 'CERRADO'::character varying])::text[])))
);


ALTER TABLE public.incidentes OWNER TO admin_disciplina;

--
-- Name: incidentes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_disciplina
--

CREATE SEQUENCE public.incidentes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incidentes_id_seq OWNER TO admin_disciplina;

--
-- Name: incidentes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_disciplina
--

ALTER SEQUENCE public.incidentes_id_seq OWNED BY public.incidentes.id;


--
-- Name: lugares; Type: TABLE; Schema: public; Owner: admin_disciplina
--

CREATE TABLE public.lugares (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.lugares OWNER TO admin_disciplina;

--
-- Name: lugares_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_disciplina
--

CREATE SEQUENCE public.lugares_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lugares_id_seq OWNER TO admin_disciplina;

--
-- Name: lugares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_disciplina
--

ALTER SEQUENCE public.lugares_id_seq OWNED BY public.lugares.id;


--
-- Name: matriculas_estudiante; Type: TABLE; Schema: public; Owner: admin_disciplina
--

CREATE TABLE public.matriculas_estudiante (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    anio_lectivo integer NOT NULL,
    grado character varying(10) NOT NULL,
    grupo character varying(10) NOT NULL,
    jornada character varying(20) DEFAULT 'MANANA'::character varying NOT NULL,
    estado_matricula character varying(20) DEFAULT 'ACTIVO'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT matriculas_estudiante_estado_matricula_check CHECK (((estado_matricula)::text = ANY ((ARRAY['ACTIVO'::character varying, 'GRADUADO'::character varying, 'RETIRADO'::character varying])::text[])))
);


ALTER TABLE public.matriculas_estudiante OWNER TO admin_disciplina;

--
-- Name: matriculas_estudiante_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_disciplina
--

CREATE SEQUENCE public.matriculas_estudiante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matriculas_estudiante_id_seq OWNER TO admin_disciplina;

--
-- Name: matriculas_estudiante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_disciplina
--

ALTER SEQUENCE public.matriculas_estudiante_id_seq OWNED BY public.matriculas_estudiante.id;


--
-- Name: planes_intervencion; Type: TABLE; Schema: public; Owner: admin_disciplina
--

CREATE TABLE public.planes_intervencion (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    incidente_origen_id integer,
    orientador_id integer NOT NULL,
    diagnostico_situacional text NOT NULL,
    recomendaciones_ia text,
    acciones_acordadas text NOT NULL,
    compromiso_padres text,
    fecha_proximo_seguimiento date,
    estado character varying(25) DEFAULT 'EN_SEGUIMIENTO'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT planes_intervencion_estado_check CHECK (((estado)::text = ANY ((ARRAY['BORRADOR'::character varying, 'EN_SEGUIMIENTO'::character varying, 'CUMPLIDO'::character varying, 'INCUMPLIDO'::character varying])::text[])))
);


ALTER TABLE public.planes_intervencion OWNER TO admin_disciplina;

--
-- Name: planes_intervencion_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_disciplina
--

CREATE SEQUENCE public.planes_intervencion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.planes_intervencion_id_seq OWNER TO admin_disciplina;

--
-- Name: planes_intervencion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_disciplina
--

ALTER SEQUENCE public.planes_intervencion_id_seq OWNED BY public.planes_intervencion.id;


--
-- Name: seguimientos_caso; Type: TABLE; Schema: public; Owner: admin_disciplina
--

CREATE TABLE public.seguimientos_caso (
    id integer NOT NULL,
    plan_id integer NOT NULL,
    usuario_id integer NOT NULL,
    observacion text NOT NULL,
    fecha_registro timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.seguimientos_caso OWNER TO admin_disciplina;

--
-- Name: seguimientos_caso_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_disciplina
--

CREATE SEQUENCE public.seguimientos_caso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seguimientos_caso_id_seq OWNER TO admin_disciplina;

--
-- Name: seguimientos_caso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_disciplina
--

ALTER SEQUENCE public.seguimientos_caso_id_seq OWNED BY public.seguimientos_caso.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: admin_disciplina
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    email character varying(120) NOT NULL,
    rol character varying(30) NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usuarios_rol_check CHECK (((rol)::text = ANY ((ARRAY['ROLE_RECTOR'::character varying, 'ROLE_ORIENTADOR'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO admin_disciplina;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: admin_disciplina
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO admin_disciplina;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin_disciplina
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: auditoria_sistema id; Type: DEFAULT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.auditoria_sistema ALTER COLUMN id SET DEFAULT nextval('public.auditoria_sistema_id_seq'::regclass);


--
-- Name: catalogo_faltas id; Type: DEFAULT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.catalogo_faltas ALTER COLUMN id SET DEFAULT nextval('public.catalogo_faltas_id_seq'::regclass);


--
-- Name: docentes id; Type: DEFAULT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.docentes ALTER COLUMN id SET DEFAULT nextval('public.docentes_id_seq'::regclass);


--
-- Name: estudiantes id; Type: DEFAULT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.estudiantes ALTER COLUMN id SET DEFAULT nextval('public.estudiantes_id_seq'::regclass);


--
-- Name: incidente_estudiantes id; Type: DEFAULT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.incidente_estudiantes ALTER COLUMN id SET DEFAULT nextval('public.incidente_estudiantes_id_seq'::regclass);


--
-- Name: incidentes id; Type: DEFAULT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.incidentes ALTER COLUMN id SET DEFAULT nextval('public.incidentes_id_seq'::regclass);


--
-- Name: lugares id; Type: DEFAULT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.lugares ALTER COLUMN id SET DEFAULT nextval('public.lugares_id_seq'::regclass);


--
-- Name: matriculas_estudiante id; Type: DEFAULT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.matriculas_estudiante ALTER COLUMN id SET DEFAULT nextval('public.matriculas_estudiante_id_seq'::regclass);


--
-- Name: planes_intervencion id; Type: DEFAULT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.planes_intervencion ALTER COLUMN id SET DEFAULT nextval('public.planes_intervencion_id_seq'::regclass);


--
-- Name: seguimientos_caso id; Type: DEFAULT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.seguimientos_caso ALTER COLUMN id SET DEFAULT nextval('public.seguimientos_caso_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: auditoria_sistema; Type: TABLE DATA; Schema: public; Owner: admin_disciplina
--

COPY public.auditoria_sistema (id, usuario_id, accion, entidad, entidad_id, datos_anteriores, datos_nuevos, ip_origen, created_at) FROM stdin;
1	15	CREAR	IncidenteTest	999d2dff779	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:28:10.23045+00
2	17	CREAR	IncidenteTest	9999047884e	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:28:12.561224+00
3	19	CREAR	IncidenteTest	999109b4449	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:28:13.787967+00
4	21	CREAR	IncidenteTest	9994c4a62ce	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:30:01.47713+00
5	23	CREAR	IncidenteTest	9994e82169b	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:30:03.441686+00
6	25	CREAR	IncidenteTest	99938920500	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:30:04.499508+00
7	27	CREAR	IncidenteTest	9994d868fdf	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:30:41.964093+00
8	29	CREAR	IncidenteTest	99934ea459e	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:30:43.637249+00
9	31	CREAR	IncidenteTest	99952919cb5	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:30:44.626208+00
10	8	CREAR	Incidente	145	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente con falta tipificada Tipo II para validar filtro de ley 1620."}	127.0.0.1	2026-09-05 20:30:49.786446+00
11	8	CREAR	Incidente	146	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para actualizar descargos formales en comite de convivencia."}	127.0.0.1	2026-09-05 20:30:50.598636+00
12	8	ACTUALIZAR_DESCARGO	IncidenteEstudiante	189	{"descargo": "", "compromiso": ""}	{"descargo": "El estudiante declara que no fue su intencion generar conflicto.", "compromiso": "Participar en el taller de resolucion pacifica de conflictos."}	127.0.0.1	2026-09-05 20:30:50.683037+00
13	8	CREAR	Incidente	147	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para validar alias nuevoEstado del frontend."}	127.0.0.1	2026-09-05 20:30:50.919045+00
14	8	CAMBIO_ESTADO	Incidente	147	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "EN_INDAGACION"}	127.0.0.1	2026-09-05 20:30:50.966378+00
15	8	CREAR	Incidente	148	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Situacion de conflicto para verificar la transicion de estados del debido proceso."}	127.0.0.1	2026-09-05 20:30:51.36999+00
16	8	CAMBIO_ESTADO	Incidente	148	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "EN_INDAGACION"}	127.0.0.1	2026-09-05 20:30:51.415173+00
17	7	CREAR	Incidente	149	\N	{"lugarId": 1, "involucrados": 3, "docenteReportaId": 1, "descripcionHechos": "Altercado verbal y agresion fisica durante el recreo escolar en el patio central."}	127.0.0.1	2026-09-05 20:30:51.674004+00
18	8	CREAR	Incidente	150	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "El estudiante es sorprendido destruyendo material institucional en el aula de clase."}	127.0.0.1	2026-09-05 20:30:51.832398+00
19	8	CREAR	Incidente	151	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para probar alias de descargo y compromisos."}	127.0.0.1	2026-09-05 20:30:51.984377+00
20	8	ACTUALIZAR_DESCARGO	IncidenteEstudiante	196	{"descargo": "", "compromiso": ""}	{"descargo": "El estudiante manifiesta su compromiso con la convivencia.", "compromiso": "Realizar actividad restaurativa."}	127.0.0.1	2026-09-05 20:30:52.039854+00
21	14	CREAR	PlanIntervencion	7	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Asistencia semanal a taller de mediación y acuerdos restaurativos."}	127.0.0.1	2026-09-05 20:30:57.797078+00
22	14	CREAR	PlanIntervencion	8	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Acciones iniciales"}	127.0.0.1	2026-09-05 20:30:57.893999+00
24	14	CREAR	PlanIntervencion	9	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Asistencia semanal a taller de mediación y acuerdos restaurativos."}	127.0.0.1	2026-09-05 20:31:56.593264+00
25	14	CREAR	PlanIntervencion	10	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Acciones iniciales"}	127.0.0.1	2026-09-05 20:31:56.739345+00
26	14	CREAR	PlanIntervencion	11	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Asistencia semanal a taller de mediación y acuerdos restaurativos."}	127.0.0.1	2026-09-05 20:33:28.861638+00
27	14	CREAR	PlanIntervencion	12	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Acciones iniciales"}	127.0.0.1	2026-09-05 20:33:28.972362+00
28	14	REGISTRAR_SEGUIMIENTO	PlanIntervencion	12	{"estadoAnterior": "EN_SEGUIMIENTO"}	{"nuevoEstado": "CUMPLIDO", "observacion": "El estudiante asistió puntualmente a las sesiones y presentó avances notables."}	127.0.0.1	2026-09-05 20:33:29.042345+00
29	33	CREAR	IncidenteTest	9990b5b6d17	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:33:56.836622+00
30	35	CREAR	IncidenteTest	999a16e24b2	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:33:57.987398+00
31	37	CREAR	IncidenteTest	999b6562ffb	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:33:58.660914+00
32	8	CREAR	Incidente	157	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente con falta tipificada Tipo II para validar filtro de ley 1620."}	127.0.0.1	2026-09-05 20:34:02.197332+00
33	8	CREAR	Incidente	158	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para actualizar descargos formales en comite de convivencia."}	127.0.0.1	2026-09-05 20:34:02.597541+00
34	8	ACTUALIZAR_DESCARGO	IncidenteEstudiante	203	{"descargo": "", "compromiso": ""}	{"descargo": "El estudiante declara que no fue su intencion generar conflicto.", "compromiso": "Participar en el taller de resolucion pacifica de conflictos."}	127.0.0.1	2026-09-05 20:34:02.64885+00
35	8	CREAR	Incidente	159	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para validar alias nuevoEstado del frontend."}	127.0.0.1	2026-09-05 20:34:02.809538+00
36	8	CAMBIO_ESTADO	Incidente	159	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "EN_INDAGACION"}	127.0.0.1	2026-09-05 20:34:02.839411+00
37	8	CREAR	Incidente	160	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Situacion de conflicto para verificar la transicion de estados del debido proceso."}	127.0.0.1	2026-09-05 20:34:03.130742+00
38	8	CAMBIO_ESTADO	Incidente	160	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "EN_INDAGACION"}	127.0.0.1	2026-09-05 20:34:03.155982+00
39	7	CREAR	Incidente	161	\N	{"lugarId": 1, "involucrados": 3, "docenteReportaId": 1, "descripcionHechos": "Altercado verbal y agresion fisica durante el recreo escolar en el patio central."}	127.0.0.1	2026-09-05 20:34:03.380646+00
40	8	CREAR	Incidente	162	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "El estudiante es sorprendido destruyendo material institucional en el aula de clase."}	127.0.0.1	2026-09-05 20:34:03.488134+00
41	8	CREAR	Incidente	163	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para probar alias de descargo y compromisos."}	127.0.0.1	2026-09-05 20:34:03.618612+00
42	8	ACTUALIZAR_DESCARGO	IncidenteEstudiante	210	{"descargo": "", "compromiso": ""}	{"descargo": "El estudiante manifiesta su compromiso con la convivencia.", "compromiso": "Realizar actividad restaurativa."}	127.0.0.1	2026-09-05 20:34:03.641128+00
43	14	CREAR	PlanIntervencion	13	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Asistencia semanal a taller de mediación y acuerdos restaurativos."}	127.0.0.1	2026-09-05 20:34:07.215732+00
44	14	CREAR	PlanIntervencion	14	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Acciones iniciales"}	127.0.0.1	2026-09-05 20:34:07.317636+00
45	14	REGISTRAR_SEGUIMIENTO	PlanIntervencion	14	{"estadoAnterior": "EN_SEGUIMIENTO"}	{"nuevoEstado": "CUMPLIDO", "observacion": "El estudiante asistió puntualmente a las sesiones y presentó avances notables."}	127.0.0.1	2026-09-05 20:34:07.364294+00
46	39	CREAR	IncidenteTest	9993c3b8dee	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:44:43.190939+00
47	41	CREAR	IncidenteTest	999c75935d3	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:44:44.211162+00
48	43	CREAR	IncidenteTest	99909fd313d	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:44:44.863776+00
49	45	CREAR	IncidenteTest	999f33f9fd4	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:48:08.402056+00
50	47	CREAR	IncidenteTest	99957fbdbde	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:48:09.479912+00
51	49	CREAR	IncidenteTest	999259c9dd1	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:48:10.123774+00
52	8	CREAR	Incidente	169	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente con falta tipificada Tipo II para validar filtro de ley 1620."}	127.0.0.1	2026-09-05 20:48:13.529352+00
53	8	CREAR	Incidente	170	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para actualizar descargos formales en comite de convivencia."}	127.0.0.1	2026-09-05 20:48:13.94839+00
54	8	ACTUALIZAR_DESCARGO	IncidenteEstudiante	217	{"descargo": "", "compromiso": ""}	{"descargo": "El estudiante declara que no fue su intencion generar conflicto.", "compromiso": "Participar en el taller de resolucion pacifica de conflictos."}	127.0.0.1	2026-09-05 20:48:14.00664+00
55	8	CREAR	Incidente	171	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para validar alias nuevoEstado del frontend."}	127.0.0.1	2026-09-05 20:48:14.158322+00
56	8	CAMBIO_ESTADO	Incidente	171	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "EN_INDAGACION"}	127.0.0.1	2026-09-05 20:48:14.199123+00
57	8	CREAR	Incidente	172	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Situacion de conflicto para verificar la transicion de estados del debido proceso."}	127.0.0.1	2026-09-05 20:48:14.516354+00
58	8	CAMBIO_ESTADO	Incidente	172	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "EN_INDAGACION"}	127.0.0.1	2026-09-05 20:48:14.550396+00
59	7	CREAR	Incidente	173	\N	{"lugarId": 1, "involucrados": 3, "docenteReportaId": 1, "descripcionHechos": "Altercado verbal y agresion fisica durante el recreo escolar en el patio central."}	127.0.0.1	2026-09-05 20:48:14.751913+00
60	8	CREAR	Incidente	174	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "El estudiante es sorprendido destruyendo material institucional en el aula de clase."}	127.0.0.1	2026-09-05 20:48:14.861384+00
61	8	CREAR	Incidente	175	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para probar alias de descargo y compromisos."}	127.0.0.1	2026-09-05 20:48:14.981942+00
62	8	ACTUALIZAR_DESCARGO	IncidenteEstudiante	224	{"descargo": "", "compromiso": ""}	{"descargo": "El estudiante manifiesta su compromiso con la convivencia.", "compromiso": "Realizar actividad restaurativa."}	127.0.0.1	2026-09-05 20:48:15.019052+00
63	14	CREAR	PlanIntervencion	15	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Asistencia semanal a taller de mediación y acuerdos restaurativos."}	127.0.0.1	2026-09-05 20:48:18.657844+00
64	14	CREAR	PlanIntervencion	16	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Acciones iniciales"}	127.0.0.1	2026-09-05 20:48:18.729693+00
65	14	REGISTRAR_SEGUIMIENTO	PlanIntervencion	16	{"estadoAnterior": "EN_SEGUIMIENTO"}	{"nuevoEstado": "CUMPLIDO", "observacion": "El estudiante asistió puntualmente a las sesiones y presentó avances notables."}	127.0.0.1	2026-09-05 20:48:18.81743+00
66	8	CREAR	Incidente	181	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente con falta tipificada Tipo II para validar filtro de ley 1620."}	127.0.0.1	2026-09-05 20:49:15.638981+00
67	8	CREAR	Incidente	182	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para actualizar descargos formales en comite de convivencia."}	127.0.0.1	2026-09-05 20:49:16.158015+00
68	8	ACTUALIZAR_DESCARGO	IncidenteEstudiante	231	{"descargo": "", "compromiso": ""}	{"descargo": "El estudiante declara que no fue su intencion generar conflicto.", "compromiso": "Participar en el taller de resolucion pacifica de conflictos."}	127.0.0.1	2026-09-05 20:49:16.21632+00
69	8	CREAR	Incidente	183	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para validar alias nuevoEstado del frontend."}	127.0.0.1	2026-09-05 20:49:16.37777+00
70	8	CAMBIO_ESTADO	Incidente	183	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "EN_INDAGACION"}	127.0.0.1	2026-09-05 20:49:16.408766+00
71	8	CREAR	Incidente	184	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Situacion de conflicto para verificar la transicion de estados del debido proceso."}	127.0.0.1	2026-09-05 20:49:16.684329+00
72	8	CAMBIO_ESTADO	Incidente	184	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "EN_INDAGACION"}	127.0.0.1	2026-09-05 20:49:16.71281+00
73	7	CREAR	Incidente	185	\N	{"lugarId": 1, "involucrados": 3, "docenteReportaId": 1, "descripcionHechos": "Altercado verbal y agresion fisica durante el recreo escolar en el patio central."}	127.0.0.1	2026-09-05 20:49:16.938512+00
74	8	CREAR	Incidente	186	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "El estudiante es sorprendido destruyendo material institucional en el aula de clase."}	127.0.0.1	2026-09-05 20:49:17.113201+00
75	8	CREAR	Incidente	187	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente previo para cierre formal."}	127.0.0.1	2026-09-05 20:49:17.299324+00
76	8	CAMBIO_ESTADO	Incidente	187	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "CERRADO"}	127.0.0.1	2026-09-05 20:49:17.324656+00
77	8	CREAR	Incidente	188	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para probar alias de descargo y compromisos."}	127.0.0.1	2026-09-05 20:49:17.48089+00
78	8	ACTUALIZAR_DESCARGO	IncidenteEstudiante	239	{"descargo": "", "compromiso": ""}	{"descargo": "El estudiante manifiesta su compromiso con la convivencia.", "compromiso": "Realizar actividad restaurativa."}	127.0.0.1	2026-09-05 20:49:17.50864+00
79	51	CREAR	IncidenteTest	99954cad500	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:49:48.604188+00
80	53	CREAR	IncidenteTest	999ab1b0fed	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:49:49.759355+00
81	55	CREAR	IncidenteTest	999895ce9ac	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:49:50.445733+00
82	8	CREAR	Incidente	189	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente con falta tipificada Tipo II para validar filtro de ley 1620."}	127.0.0.1	2026-09-05 20:49:53.6968+00
83	8	CREAR	Incidente	190	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para actualizar descargos formales en comite de convivencia."}	127.0.0.1	2026-09-05 20:49:54.132755+00
84	8	ACTUALIZAR_DESCARGO	IncidenteEstudiante	241	{"descargo": "", "compromiso": ""}	{"descargo": "El estudiante declara que no fue su intencion generar conflicto.", "compromiso": "Participar en el taller de resolucion pacifica de conflictos."}	127.0.0.1	2026-09-05 20:49:54.183812+00
85	8	CREAR	Incidente	191	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para validar alias nuevoEstado del frontend."}	127.0.0.1	2026-09-05 20:49:54.364686+00
86	8	CAMBIO_ESTADO	Incidente	191	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "EN_INDAGACION"}	127.0.0.1	2026-09-05 20:49:54.399367+00
87	8	CREAR	Incidente	192	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Situacion de conflicto para verificar la transicion de estados del debido proceso."}	127.0.0.1	2026-09-05 20:49:54.64942+00
88	8	CAMBIO_ESTADO	Incidente	192	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "EN_INDAGACION"}	127.0.0.1	2026-09-05 20:49:54.671894+00
89	7	CREAR	Incidente	193	\N	{"lugarId": 1, "involucrados": 3, "docenteReportaId": 1, "descripcionHechos": "Altercado verbal y agresion fisica durante el recreo escolar en el patio central."}	127.0.0.1	2026-09-05 20:49:54.811573+00
90	8	CREAR	Incidente	194	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "El estudiante es sorprendido destruyendo material institucional en el aula de clase."}	127.0.0.1	2026-09-05 20:49:54.94161+00
91	8	CREAR	Incidente	195	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente previo para cierre formal."}	127.0.0.1	2026-09-05 20:49:55.060198+00
92	8	CAMBIO_ESTADO	Incidente	195	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "CERRADO"}	127.0.0.1	2026-09-05 20:49:55.081875+00
93	8	CREAR	Incidente	196	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para probar alias de descargo y compromisos."}	127.0.0.1	2026-09-05 20:49:55.250219+00
94	8	ACTUALIZAR_DESCARGO	IncidenteEstudiante	249	{"descargo": "", "compromiso": ""}	{"descargo": "El estudiante manifiesta su compromiso con la convivencia.", "compromiso": "Realizar actividad restaurativa."}	127.0.0.1	2026-09-05 20:49:55.283678+00
95	14	CREAR	PlanIntervencion	17	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Asistencia semanal a taller de mediación y acuerdos restaurativos."}	127.0.0.1	2026-09-05 20:49:58.658626+00
96	14	CREAR	PlanIntervencion	18	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Acciones iniciales"}	127.0.0.1	2026-09-05 20:49:58.793543+00
97	14	REGISTRAR_SEGUIMIENTO	PlanIntervencion	18	{"estadoAnterior": "EN_SEGUIMIENTO"}	{"nuevoEstado": "CUMPLIDO", "observacion": "El estudiante asistió puntualmente a las sesiones y presentó avances notables."}	127.0.0.1	2026-09-05 20:49:58.844598+00
98	57	CREAR	IncidenteTest	999e09b1d4f	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:51:32.460519+00
99	59	CREAR	IncidenteTest	999e34b67fc	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:51:33.557116+00
100	61	CREAR	IncidenteTest	99917088fb7	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 20:51:34.172426+00
101	8	CREAR	Incidente	202	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente con falta tipificada Tipo II para validar filtro de ley 1620."}	127.0.0.1	2026-09-05 20:51:37.585653+00
102	8	CREAR	Incidente	203	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para actualizar descargos formales en comite de convivencia."}	127.0.0.1	2026-09-05 20:51:38.263149+00
103	8	ACTUALIZAR_DESCARGO	IncidenteEstudiante	256	{"descargo": "", "compromiso": ""}	{"descargo": "El estudiante declara que no fue su intencion generar conflicto.", "compromiso": "Participar en el taller de resolucion pacifica de conflictos."}	127.0.0.1	2026-09-05 20:51:38.315616+00
104	8	CREAR	Incidente	204	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para validar alias nuevoEstado del frontend."}	127.0.0.1	2026-09-05 20:51:38.458615+00
105	8	CAMBIO_ESTADO	Incidente	204	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "EN_INDAGACION"}	127.0.0.1	2026-09-05 20:51:38.488147+00
106	8	CREAR	Incidente	205	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Situacion de conflicto para verificar la transicion de estados del debido proceso."}	127.0.0.1	2026-09-05 20:51:38.776078+00
107	8	CAMBIO_ESTADO	Incidente	205	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "EN_INDAGACION"}	127.0.0.1	2026-09-05 20:51:38.800622+00
108	7	CREAR	Incidente	206	\N	{"lugarId": 1, "involucrados": 3, "docenteReportaId": 1, "descripcionHechos": "Altercado verbal y agresion fisica durante el recreo escolar en el patio central."}	127.0.0.1	2026-09-05 20:51:38.974955+00
109	8	CREAR	Incidente	207	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "El estudiante es sorprendido destruyendo material institucional en el aula de clase."}	127.0.0.1	2026-09-05 20:51:39.112002+00
110	8	CREAR	Incidente	208	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente previo para cierre formal."}	127.0.0.1	2026-09-05 20:51:39.223234+00
111	8	CAMBIO_ESTADO	Incidente	208	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "CERRADO"}	127.0.0.1	2026-09-05 20:51:39.251684+00
112	8	CREAR	Incidente	209	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para probar alias de descargo y compromisos."}	127.0.0.1	2026-09-05 20:51:39.435754+00
113	8	ACTUALIZAR_DESCARGO	IncidenteEstudiante	264	{"descargo": "", "compromiso": ""}	{"descargo": "El estudiante manifiesta su compromiso con la convivencia.", "compromiso": "Realizar actividad restaurativa."}	127.0.0.1	2026-09-05 20:51:39.467768+00
114	14	CREAR	PlanIntervencion	19	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Asistencia semanal a taller de mediación y acuerdos restaurativos."}	127.0.0.1	2026-09-05 20:51:43.415241+00
115	14	CREAR	PlanIntervencion	20	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Acciones iniciales"}	127.0.0.1	2026-09-05 20:51:43.487325+00
116	14	REGISTRAR_SEGUIMIENTO	PlanIntervencion	20	{"estadoAnterior": "EN_SEGUIMIENTO"}	{"nuevoEstado": "CUMPLIDO", "observacion": "El estudiante asistió puntualmente a las sesiones y presentó avances notables."}	127.0.0.1	2026-09-05 20:51:43.535468+00
117	63	CREAR	IncidenteTest	999c69dc19c	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 22:31:03.160152+00
118	65	CREAR	IncidenteTest	99948d1fe8f	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 22:31:04.84493+00
119	67	CREAR	IncidenteTest	999208c82e2	\N	{"estado": "REPORTADO"}	127.0.0.1	2026-09-05 22:31:05.730314+00
120	8	CREAR	Incidente	215	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente con falta tipificada Tipo II para validar filtro de ley 1620."}	127.0.0.1	2026-09-05 22:31:13.253677+00
121	8	CREAR	Incidente	216	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para actualizar descargos formales en comite de convivencia."}	127.0.0.1	2026-09-05 22:31:14.172317+00
122	8	ACTUALIZAR_DESCARGO	IncidenteEstudiante	271	{"descargo": "", "compromiso": ""}	{"descargo": "El estudiante declara que no fue su intencion generar conflicto.", "compromiso": "Participar en el taller de resolucion pacifica de conflictos."}	127.0.0.1	2026-09-05 22:31:14.338225+00
123	8	CREAR	Incidente	217	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para validar alias nuevoEstado del frontend."}	127.0.0.1	2026-09-05 22:31:14.615344+00
124	8	CAMBIO_ESTADO	Incidente	217	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "EN_INDAGACION"}	127.0.0.1	2026-09-05 22:31:14.663007+00
125	8	CREAR	Incidente	218	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Situacion de conflicto para verificar la transicion de estados del debido proceso."}	127.0.0.1	2026-09-05 22:31:15.006678+00
126	8	CAMBIO_ESTADO	Incidente	218	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "EN_INDAGACION"}	127.0.0.1	2026-09-05 22:31:15.08878+00
127	7	CREAR	Incidente	219	\N	{"lugarId": 1, "involucrados": 3, "docenteReportaId": 1, "descripcionHechos": "Altercado verbal y agresion fisica durante el recreo escolar en el patio central."}	127.0.0.1	2026-09-05 22:31:15.327742+00
128	8	CREAR	Incidente	220	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "El estudiante es sorprendido destruyendo material institucional en el aula de clase."}	127.0.0.1	2026-09-05 22:31:15.468214+00
129	8	CREAR	Incidente	221	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente previo para cierre formal."}	127.0.0.1	2026-09-05 22:31:15.585292+00
130	8	CAMBIO_ESTADO	Incidente	221	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "CERRADO"}	127.0.0.1	2026-09-05 22:31:15.614181+00
131	8	CREAR	Incidente	222	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para probar alias de descargo y compromisos."}	127.0.0.1	2026-09-05 22:31:15.796552+00
132	8	ACTUALIZAR_DESCARGO	IncidenteEstudiante	279	{"descargo": "", "compromiso": ""}	{"descargo": "El estudiante manifiesta su compromiso con la convivencia.", "compromiso": "Realizar actividad restaurativa."}	127.0.0.1	2026-09-05 22:31:15.830421+00
133	8	CREAR	Incidente	223	\N	{"lugarId": 1, "involucrados": 1, "docenteReportaId": 1, "descripcionHechos": "Incidente para probar inmutabilidad de estado al cerrarse."}	127.0.0.1	2026-09-05 22:31:15.972267+00
134	8	CAMBIO_ESTADO	Incidente	223	{"estadoProceso": "REPORTADO"}	{"estadoProceso": "CERRADO"}	127.0.0.1	2026-09-05 22:31:16.001774+00
135	14	CREAR	PlanIntervencion	21	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Asistencia semanal a taller de mediación y acuerdos restaurativos."}	127.0.0.1	2026-09-05 22:31:20.357347+00
136	14	CREAR	PlanIntervencion	22	\N	{"estado": "EN_SEGUIMIENTO", "estudianteId": 1, "accionesAcordadas": "Acciones iniciales"}	127.0.0.1	2026-09-05 22:31:20.442566+00
137	14	REGISTRAR_SEGUIMIENTO	PlanIntervencion	22	{"estadoAnterior": "EN_SEGUIMIENTO"}	{"nuevoEstado": "CUMPLIDO", "observacion": "El estudiante asistió puntualmente a las sesiones y presentó avances notables."}	127.0.0.1	2026-09-05 22:31:20.498593+00
\.


--
-- Data for Name: catalogo_faltas; Type: TABLE DATA; Schema: public; Owner: admin_disciplina
--

COPY public.catalogo_faltas (id, codigo, clasificacion_ley, gravedad_institucional, descripcion, procedimiento_sugerido, activo) FROM stdin;
4	F_583568994	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
5	F_584409163	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
1	ART-101-T1	TIPO_I	LEVE	Conflictos cotidianos manejados inadecuadamente, discusiones esporadicas, uso indebido de dispositivos o faltas al clima pedagogico sin dano fisico ni mental.	Amonestacion verbal formativa, dialogo reflexivo en el aula con el docente y consignacion de compromiso en el cuaderno de campo.	t
2	ART-201-T2	TIPO_II	GRAVE	Agresion fisica (golpes, empujones, pelea o rinon entre estudiantes), agresion verbal reiterada, dano intencional a bienes ajenos o acoso escolar (bullying) que no revistan caracteristicas de delito penal ni generen incapacidad medica.	Remision a orientacion escolar, apertura de bitacora de debido proceso, notificacion inmediata y citacion a acudientes, registro formal de descargos y formulacion de plan de intervencion pedagogico.	t
3	ART-301-T3	TIPO_III	GRAVISIMA	Presuntos delitos penales bajo el Codigo Penal colombiano: porte o uso de armas, sustancias psicoactivas, agresion contra la libertad sexual, o lesiones fisicas graves con incapacidad medica certificada.	Atencion medica prioritaria si procede, activacion de la Ruta de Atencion Integral (remision a ICBF y Policia de Infancia), suspension preventiva y traslado inmediato a Comite de Convivencia y Rectoria.	t
6	F_586291704	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
7	F_587908328	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
8	F_588008022	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
9	F_609366146	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
10	F_610969956	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
11	F_611226783	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
12	F_611278581	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
13	F_637526455	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
14	F_638679448	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
15	F_639422847	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
16	F_639599600	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
17	F_640257192	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
18	F_640446700	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
19	F_641298304	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
20	F_641398318	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
21	F_641502994	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
22	F_647479930	TIPO_II	GRAVE	Falta de prueba expediente	Citación acudiente	t
\.


--
-- Data for Name: docentes; Type: TABLE DATA; Schema: public; Owner: admin_disciplina
--

COPY public.docentes (id, documento, nombres, apellidos, area_desempeno, activo) FROM stdin;
1	1098234501	Carlos Alberto	Mendoza Gomez	Matematicas	t
2	1098234502	Adriana Maria	Rios Cadavid	Lengua Castellana y Literatura	t
3	1098234503	Wilson Fernando	Patino Salazar	Ciencias Naturales y Quimica	t
4	1098234504	Martha Cecilia	Henao Restrepo	Ciencias Sociales e Historia	t
5	1098234505	Jorge Eliecer	Morales Zapata	Educacion Fisica, Recreacion y Deporte	t
6	1098234506	Claudia Elena	Giraldo Montoya	Ingles y Lenguas Extranjeras	t
7	1098234507	Hernando de Jesus	Lopez Cardenas	Tecnologia e Informatica	t
8	1098234508	Sandra Milena	Osorio Bedoya	Etica, Valores y Religion	t
9	1098234509	Andres Felipe	Gomez Munoz	Educacion Artistica y Cultural	t
10	DOC_EXP_1788583510197	CARLOS	DOCENTE	CIENCIAS	t
11	D_583568966	CARLOS	DOCENTE	CIENCIAS	t
12	D_584409130	CARLOS	DOCENTE	CIENCIAS	t
13	D_586291678	CARLOS	DOCENTE	CIENCIAS	t
14	D_587908311	CARLOS	DOCENTE	CIENCIAS	t
15	D_588008007	CARLOS	DOCENTE	CIENCIAS	t
16	D_609366114	CARLOS	DOCENTE	CIENCIAS	t
17	D_610969931	CARLOS	DOCENTE	CIENCIAS	t
18	D_611226766	CARLOS	DOCENTE	CIENCIAS	t
19	D_611278566	CARLOS	DOCENTE	CIENCIAS	t
20	D_637526434	CARLOS	DOCENTE	CIENCIAS	t
21	D_638679428	CARLOS	DOCENTE	CIENCIAS	t
22	D_639422799	CARLOS	DOCENTE	CIENCIAS	t
23	D_639599535	CARLOS	DOCENTE	CIENCIAS	t
24	D_640257140	CARLOS	DOCENTE	CIENCIAS	t
25	D_640446682	CARLOS	DOCENTE	CIENCIAS	t
26	D_641298289	CARLOS	DOCENTE	CIENCIAS	t
27	D_641398304	CARLOS	DOCENTE	CIENCIAS	t
28	D_641502977	CARLOS	DOCENTE	CIENCIAS	t
29	D_647479912	CARLOS	DOCENTE	CIENCIAS	t
\.


--
-- Data for Name: estudiantes; Type: TABLE DATA; Schema: public; Owner: admin_disciplina
--

COPY public.estudiantes (id, documento, nombres, apellidos, nombre_acudiente, telefono_acudiente, email_acudiente, activo, created_at) FROM stdin;
1	1099887766	CARLOS	MENDEZ	ANDRES MENDEZ	3109998888	\N	t	2026-09-04 14:29:55.780273+00
2	PENDIENTE_tr9902	LUCIA	CASTILLO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:29:55.854556+00
3	1062811242	SHAIRA PAOLA	ACUNA SANCHEZ	YANIRIS SANCHEZ SUAREZ	3114165509	\N	t	2026-09-04 14:30:57.687303+00
4	1062813050	JUAN CAMILO	ADECHINE GARCIA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:57.820814+00
5	1067627753	LUIS ANGEL	ALVAREZ PINTO	DAMARIS PINTO AYALA	3128755288	\N	t	2026-09-04 14:30:57.84075+00
6	1029863232	ROBERTO CARLOS	ARAMENDIZ VERGARA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:57.860513+00
7	1062811915	JEIFER DAVID	BARRAZA BUELVAS	PENDIENTE POR REGISTRAR	3106238300	\N	t	2026-09-04 14:30:57.879309+00
8	1062815257	ZARYRETH LORENA	BARRAZA MEJIA	LEYDIS LORENA BARRAZA MEJIA	3013338917	\N	t	2026-09-04 14:30:57.898349+00
9	1062813616	JOHAN JESUS	BOLANO CONEO	PENDIENTE POR REGISTRAR	3106403322	\N	t	2026-09-04 14:30:57.916543+00
10	1137874877	SEBASTIAN JOSE	CANTILLO GARCIA	ERIKA PATRICIA GARCIA GIL	3206896069	\N	t	2026-09-04 14:30:57.934341+00
11	1062812729	DILAN ANDRES	CARDENAS CONTRERAS	GENITH CONTRERAS	3145919424	\N	t	2026-09-04 14:30:57.954993+00
12	1067629439	MATIAS	CASTANO CARE	PENDIENTE POR REGISTRAR	3206233676	\N	t	2026-09-04 14:30:57.972349+00
13	1137874473	VICTOR ALFONSO	CONTRERAS TORRES	PENDIENTE POR REGISTRAR	3127330076	\N	t	2026-09-04 14:30:57.989457+00
14	1209713043	YELIN ALEJANDRA	CONTRERAS TORRES	PENDIENTE POR REGISTRAR	3127330076	\N	t	2026-09-04 14:30:58.01168+00
15	1062815018	LORAYNE ISABEL	CRUZADO ESCOBAR	EDUIN CRUZADO	3126105070	\N	t	2026-09-04 14:30:58.029613+00
16	1062811731	HERMES ENRIQUE	HERNANDEZ ARIZA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:58.045068+00
17	1066293056	MARIA CELESTE	LUNA BRUGES	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:58.064429+00
18	1062814282	DILAN ANDRES	MARQUEZ PALACIO	PENDIENTE POR REGISTRAR	3136591388	\N	t	2026-09-04 14:30:58.080257+00
19	1062814837	JUAN SEBASTIAN	MARQUEZ PANTOJA	PENDIENTE POR REGISTRAR	3046159078	\N	t	2026-09-04 14:30:58.096069+00
20	1062814234	SALOME	MORENO BOHORQUEZ	YEIDIS MORENO	3208426649	\N	t	2026-09-04 14:30:58.112739+00
21	10628145333	MARIANA INES	NAVARRO MACHADO	RAFAEL JESUS NAVARRO JIMENEZ	3107143206	\N	t	2026-09-04 14:30:58.131111+00
22	1062811714	SANTIAGO DE JESUS	NAVARRO MACHADO	RAFAEL JESUS NAVARRO JIMENEZ	3107143206	\N	t	2026-09-04 14:30:58.147116+00
23	1062814500	GABRIEL EDUARDO	OLIVEROS PEREZ	LUIS EDUARDO OLIVERO ROMERO	3106041847	\N	t	2026-09-04 14:30:58.177269+00
24	1062813356	JESUS DAVID	OSPINO AVILA	PENDIENTE POR REGISTRAR	3218262011	\N	t	2026-09-04 14:30:58.197409+00
25	1062814121	DULCE MARIA	PINTO NONTIEN	LUIS FRANCISCO PINTO TORRES	3183759510	\N	t	2026-09-04 14:30:58.21335+00
26	1137874126	SAYDA SOFIA	RAMIREZ ORTIZ	PENDIENTE POR REGISTRAR	3166901373	\N	t	2026-09-04 14:30:58.229396+00
27	1062814328	FREY DAVID	RAMIREZ ROMERO	PENDIENTE POR REGISTRAR	3172556093	\N	t	2026-09-04 14:30:58.24421+00
28	1067626490	LUCIANA ANTONELLA	RINCON JIMENEZ	PENDIENTE POR REGISTRAR	3172990576	\N	t	2026-09-04 14:30:58.263623+00
29	1062813936	DULCE MARIA	RIOS HERNANDEZ	PENDIENTE POR REGISTRAR	3216338752	\N	t	2026-09-04 14:30:58.2778+00
30	1062814528	LUIS NOACH	RODRIGUEZ GUTIERREZ	PENDIENTE POR REGISTRAR	3157668168	\N	t	2026-09-04 14:30:58.292586+00
31	1062814196	MILAN DAVID	SALAS SUAREZ	YULEXE ASTRID SUAREZ BELEÑO	3135814735	\N	t	2026-09-04 14:30:58.308178+00
32	1062813774	JAFET NEYITH	SAYAS CUELLO	JEFFERSON SAYAS OSORIO	31142441996	\N	t	2026-09-04 14:30:58.321835+00
33	1062812847	ISABELLA	VIECCO PAEZ	PENDIENTE POR REGISTRAR	3232323021	\N	t	2026-09-04 14:30:58.335956+00
34	1062814992	ISABELLA MARIE	ZUNIGA BAQUERO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:58.349507+00
35	1062813326	MARIA VICTORIA	AMAYA SEGUANE	PENDIENTE POR REGISTRAR	3043960782	\N	t	2026-09-04 14:30:58.369549+00
36	7040410	JOHAN MANUEL	ANDRADE SALAS	PENDIENTE POR REGISTRAR	3103904659	\N	t	2026-09-04 14:30:58.386446+00
37	1754444	JESUS JAVIER	ARGUELLO PARTIDA	PENDIENTE POR REGISTRAR	3245820396	\N	t	2026-09-04 14:30:58.405564+00
38	1062810905	MARTIN ELIAS	ATENCIA POLO	PENDIENTE POR REGISTRAR	3122568738	\N	t	2026-09-04 14:30:58.427229+00
39	1062814229	ESMERALDA YOILETH	AVENDANO CABALLERO	PENDIENTE POR REGISTRAR	3127497711	\N	t	2026-09-04 14:30:58.440078+00
40	1062814691	NICOLL MILAGROS	AYALA PABA	PENDIENTE POR REGISTRAR	3126703202	\N	t	2026-09-04 14:30:58.460749+00
41	3423	CRISTIAN	BARROSO RODRIGUEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:58.483076+00
42	1062814103	JUAN MIGUEL	CANCHILA PINTO	YICETH PINTO NIETO	3022774578	\N	t	2026-09-04 14:30:58.499146+00
43	1064117862	DUVAN CAMILO	DE AVILA GARCIA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:58.513164+00
44	1062813579	SARAY MICHELL	DELGADO PEDROZO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:58.529908+00
45	1062813493	KAROL JULIANA	DIAZ JIMENEZ	PENDIENTE POR REGISTRAR	3178027773	\N	t	2026-09-04 14:30:58.542852+00
46	1062813527	YOINER ENRIQUE	JIMENEZ PEREZ	PENDIENTE POR REGISTRAR	3106058802	\N	t	2026-09-04 14:30:58.558222+00
47	1062812417	TALIANA MICHEL	LOPEZ BALLESTA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:58.570578+00
48	1067625440	MAXWELL DAVID	MAESTRE RODRIGUEZ	PENDIENTE POR REGISTRAR	3186455822	\N	t	2026-09-04 14:30:58.58453+00
49	1062814301	SHARA GISELLE	MARQUEZ SUAREZ	PENDIENTE POR REGISTRAR	3146476234	\N	t	2026-09-04 14:30:58.598864+00
50	1062813905	SHIRLEY DHALIANYS	MARTINEZ BELTRAN	ANYIS PAOLA BELTRAN CONTRERAS	3022264477	\N	t	2026-09-04 14:30:58.612353+00
51	1062814185	ESTEBAN DAVID	MARTINEZ RICO	PENDIENTE POR REGISTRAR	3105903543	\N	t	2026-09-04 14:30:58.626159+00
52	1063966588	CARLOS ANDRES	MARTINEZ VANEGAS	ADRIANA VANEGAS RAMIREZ	3213436443	\N	t	2026-09-04 14:30:58.638222+00
53	1062812592	MELANIS SHAIRETH	MEZA GUERRERO	ESNELIS GUERRERO MONTERO	3177160002	\N	t	2026-09-04 14:30:58.649942+00
54	1062814582	JOGER DAVID	NAVARRO MONTERO	PENDIENTE POR REGISTRAR	3205699029	\N	t	2026-09-04 14:30:58.663164+00
55	1547784	THIAGO DAVID	ORELLANOS BENAVIDES	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:58.675358+00
56	1062814251	CRISTIAN DAVID	ORTIZ PEREZ	ISAIS ALBERTO ORTIZ BARRAZA	3007397896	\N	t	2026-09-04 14:30:58.687603+00
57	PENDIENTE_tr178882024	LEINER ENRIQUE	PALOMINO GARCIA	PENDIENTE POR REGISTRAR	3162859968	\N	t	2026-09-04 14:30:58.700777+00
58	1102380259	YULIAN DAVID	PITA SALAZAR	PENDIENTE POR REGISTRAR	3045853359	\N	t	2026-09-04 14:30:58.714035+00
59	1062814611	ELIANIS PAOLA	POLO FLOREZ	ELKIN POLO	3126819792	\N	t	2026-09-04 14:30:58.730868+00
60	1062813617	LUIS DAVID	QUIROZ PEDROZO	NEREIDA PEDROZO CAPITAN	3226483798	\N	t	2026-09-04 14:30:58.75028+00
61	1062812862	SEBASTIAN ANDRES	RINCONES CARDENAS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:58.812616+00
62	1062811577	SIRLEY PAOLA	SALINAS HIDALGO	PENDIENTE POR REGISTRAR	3215360229	\N	t	2026-09-04 14:30:58.853291+00
63	1067621373	NATHALY JOHANA	TAMARA ORTIZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:58.883298+00
64	1062811606	FERNANDO DE JESUS	TAPIA MONTERO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:58.904283+00
65	6681263	MARIA PAULINA	TORREALBA BRICENO	PENDIENTE POR REGISTRAR	3116664908	\N	t	2026-09-04 14:30:58.957419+00
66	1062813993	SAMANTHA MILAGRO	VEGA CASTILLO	PENDIENTE POR REGISTRAR	3138807856	\N	t	2026-09-04 14:30:58.976748+00
67	1062812783	ADRIANA CAROLINA	ARIAS MARTINEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:58.993502+00
68	1062814580	LINA MARCELA	ARIAS MARTINEZ	PENDIENTE POR REGISTRAR	3207425018	\N	t	2026-09-04 14:30:59.006956+00
69	1137724508	SEBASTIAN ANDRES	AVILA BARRETO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.044325+00
70	823546824102014	SAMANTHA CRISTINA	BAPTISTA RODRIGUEZ	PENDIENTE POR REGISTRAR	3105126742	\N	t	2026-09-04 14:30:59.066339+00
71	1064118885	JUAN SEBASTIAN	BARON GARCIA	ANGIE GARCIA FONTALVO	3016723190	\N	t	2026-09-04 14:30:59.083155+00
72	1220218383	ZAHIRA ALEJANDRA	BUCURU GONZALEZ	FERNEY BUCURU YATE	3142497061	\N	t	2026-09-04 14:30:59.100946+00
73	621003	ANYULI	CABALLERO VEGA	ANGILIS VEGA FERIA	3207307345	\N	t	2026-09-04 14:30:59.11957+00
74	1062813887	JARVEY DAVID	CERVANTES TARRA	PENDIENTE POR REGISTRAR	3108238814	\N	t	2026-09-04 14:30:59.137151+00
75	1062814757	EMMANUEL	COTES QUEZADA	PENDIENTE POR REGISTRAR	3184260521	\N	t	2026-09-04 14:30:59.152981+00
76	1062814496	KATALLEYA	DIAZ MAESTRE	PENDIENTE POR REGISTRAR	3023038985	\N	t	2026-09-04 14:30:59.168665+00
77	1066292018	PRISCILA ISABEL	ESCORCIA PEREZ	PENDIENTE POR REGISTRAR	3024636020	\N	t	2026-09-04 14:30:59.179478+00
78	1062810167	JOSE RAMIRO	FIGUEROA VANEGAS	HERRERA	3103598644	\N	t	2026-09-04 14:30:59.190699+00
79	1062810560	YOANDER YEZID	LAGUNA ALMAGRO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.201546+00
80	1062811322	RICHAR DAVID	MARTINEZ CAMELO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.213015+00
81	362014	DEINELYS ZAMANTHA	MEDINA ARIZA	PENDIENTE POR REGISTRAR	3117502608	\N	t	2026-09-04 14:30:59.224875+00
82	7629276	CRISTIAN JOSE	MORA ALVARADO	PENDIENTE POR REGISTRAR	3001020946	\N	t	2026-09-04 14:30:59.23749+00
83	1062811112	SHAIRA LORENA	MUNOZ AMAYA	PENDIENTE POR REGISTRAR	3121561719	\N	t	2026-09-04 14:30:59.248541+00
84	1066293129	LITZY SHALOME	ORTIZ JARAMILLO	PENDIENTE POR REGISTRAR	3135840477	\N	t	2026-09-04 14:30:59.260581+00
85	1062814536	YEICOL MATIAS	OTALORA CARDONA	FLOR CARDONA BEDOYA	3108826977	\N	t	2026-09-04 14:30:59.271554+00
86	1066287632	JUAN CARLOS	PACHECO SUAREZ	CLAUDIA SUAREZ RODRIGUEZ	3218877322	\N	t	2026-09-04 14:30:59.282878+00
87	1062809856	BREINER ELIUTH	QUINTERO VEGA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.294215+00
88	1028896846	MELANYS ANTONELA	RAMIREZ BARRAZA	MAURICIO RAMIREZ SILVA	3147982293	\N	t	2026-09-04 14:30:59.3044+00
89	1062811554	DUBAN JOSE	RUBIO MARTINEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.31656+00
90	1062814619	MARIA FERNANDA	SALAS ALCAZAR	KELLY ALCAZAR QUINTERO	3043748655	\N	t	2026-09-04 14:30:59.328425+00
91	1062815125	AYLIN	SANCHEZ RICO	ALICIA RICO RODRIGUEZ	3146692083	\N	t	2026-09-04 14:30:59.348979+00
92	1067621562	JENIFER ANDREA	SANDOVAL DAZA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.370036+00
93	1062813515	ANDRES DAVID	SARABIA VILORIA	PENDIENTE POR REGISTRAR	3135103957	\N	t	2026-09-04 14:30:59.394784+00
94	1067725979	JESUS DAVID	SEPULVEDA ORTIZ	PENDIENTE POR REGISTRAR	3116901373	\N	t	2026-09-04 14:30:59.421144+00
95	1062814796	DEIBIS STEVEN	SOTO PEREZ	PENDIENTE POR REGISTRAR	3122659916	\N	t	2026-09-04 14:30:59.446695+00
96	1062812271	JUNIO DAVID	SOTO PEREZ	YULISSA PEREZ JARAMILLO	3122659916	\N	t	2026-09-04 14:30:59.464059+00
97	1062812680	LUIS MIGUEL	URBINA POLO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.477074+00
98	1148140981	DUBAN FELIPE	ACUNA MOLINA	PENDIENTE POR REGISTRAR	3235753674	\N	t	2026-09-04 14:30:59.489767+00
99	1062814038	SURI GIUVANNA	BARAHONA MARQUEZ	GIOVANY ANDREK BARAHONA	3148322137	\N	t	2026-09-04 14:30:59.502261+00
100	1066882868	ESTIVEN ANDRES	BRUGES GOMEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.514655+00
101	1062813984	JOHAN DAVID	CARRASCAL LLAMA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.52746+00
102	88814	YOSELIN MARIETH	CHAMUSQUERA ESCOBAR	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.543399+00
103	1062813559	HELEN SOFIA	CORONEL AMAYA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.561206+00
104	8048618	KLEIYERSON DANIEL	CORREA RODRIGUEZ	PENDIENTE POR REGISTRAR	3106241930	\N	t	2026-09-04 14:30:59.572671+00
105	1064117657	YEIRIS PAOLA	DIAZ BLANCO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.583209+00
106	1047359772	LAURA VANESSA	GUTIERREZ RUA	PENDIENTE POR REGISTRAR	3022508252	\N	t	2026-09-04 14:30:59.595077+00
107	1062813528	YOIDER JESUS	JIMENEZ PEREZ	PENDIENTE POR REGISTRAR	3106058802	\N	t	2026-09-04 14:30:59.605549+00
108	1114159738	ESTEFANIA	LEON GONZALEZ	PENDIENTE POR REGISTRAR	3215995123	\N	t	2026-09-04 14:30:59.614693+00
109	1062814635	THAYRA ISABELL	LEON GUTIERREZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.625706+00
110	1116806930	BETZABETH YOJANA	LOZANO ROJAS	GLEIDYS ROJAS PENA	3152431919	\N	t	2026-09-04 14:30:59.638145+00
111	1066356119	EIDALY ALEJADRA	MARTINEZ CARRENO	PENDIENTE POR REGISTRAR	3105225020	\N	t	2026-09-04 14:30:59.648639+00
112	1137726995	SAUL ANDRES	MARTINEZ TORRES	SANDRA TORRES MEJIA	3167207165	\N	t	2026-09-04 14:30:59.659285+00
113	1119399877	DAYERLIS MICHELL	MEJIA PEDROZO	PENDIENTE POR REGISTRAR	312714528	\N	t	2026-09-04 14:30:59.669779+00
114	1062810596	CARLOS ARILSO	MUNOZ MORA	PENDIENTE POR REGISTRAR	3122128790	\N	t	2026-09-04 14:30:59.679567+00
115	1062812428	SHEILA MICHEL	NUNEZ MENDOZA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.690588+00
116	1062811725	JUAN JOSE	ORTIZ MARTINEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.700012+00
117	1062812682	EDGAR ANDREZ	PACHECO SUAREZ	CLAUDIA SUAREZ RODRIGUEZ	3218877322	\N	t	2026-09-04 14:30:59.709462+00
118	1062813834	LUIS SAMIR	PASSO BARRETO	PENDIENTE POR REGISTRAR	3224026513	\N	t	2026-09-04 14:30:59.721406+00
119	1062813952	MARIO JOSE	PEREZ DIAZ	PENDIENTE POR REGISTRAR	3157273547	\N	t	2026-09-04 14:30:59.733176+00
120	1062812652	RUBEN DARIO	REGINO GARCIA	PENDIENTE POR REGISTRAR	3013816244	\N	t	2026-09-04 14:30:59.747895+00
121	10203000	KEINER DAVID	ROBLES PALLARES	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.760413+00
122	1062814701	SANTIAGO	RODRIGUEZ BELTRAN	ASDRUBAL ALFONSO RODRIGUEZ ARGOTE	3135932290	\N	t	2026-09-04 14:30:59.772831+00
123	1062814195	JHON GEINNER	RODRIGUEZ GARCIA	CARMEN LEONOR RODRIGUEZ GARCIA	3116881475	\N	t	2026-09-04 14:30:59.783098+00
124	1068389839	ANDIS MARIA	TERAN GUTIERREZ	PENDIENTE POR REGISTRAR	3136042165	\N	t	2026-09-04 14:30:59.794953+00
125	1062813767	CRISTINA ISABEL	USTARIZ BLANCO	YOLEINIS BLANCO MANGA	3007514079	\N	t	2026-09-04 14:30:59.805469+00
126	1137725893	ESTIBEN ANDRES	VAQUERO AMARIS	PENDIENTE POR REGISTRAR	3235784754	\N	t	2026-09-04 14:30:59.815785+00
127	1062812786	ALBER DAVID	VERGARA MEJIA	PENDIENTE POR REGISTRAR	3106571997	\N	t	2026-09-04 14:30:59.827138+00
128	1062814963	MARTIN ELIAS	VIECCO PAEZ	PENDIENTE POR REGISTRAR	3232323021	\N	t	2026-09-04 14:30:59.839759+00
129	321	WILFRIDO ANDRES	ACUNA SANCHEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.851686+00
130	1064117500	ANDRES CAMILO	ALVAREZ ARENAS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.864064+00
131	1062813578	LAUREN MICHEL	ALVAREZ CRESPO	PENDIENTE POR REGISTRAR	3218287380	\N	t	2026-09-04 14:30:59.877008+00
132	1062814716	MARIA PAULA	ARIZA SOLANO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.88737+00
133	1065897125	SAMUEL DAVID	BAENA PEREZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.899129+00
134	1062811295	ALEXANDRA	BARRAZA DE AVILA	PENDIENTE POR REGISTRAR	3106273919	\N	t	2026-09-04 14:30:59.910763+00
135	1062810574	JOYNER DAVID	BRUGES CONEO	ADELMA AMAYA	3106403322	\N	t	2026-09-04 14:30:59.921486+00
136	1062814105	NATHALY SOFIA	CAMARGO GUTIERREZ	PENDIENTE POR REGISTRAR	3234447831	\N	t	2026-09-04 14:30:59.933336+00
137	1063495778	DIEGO DE JESUS	CARRASCAL BARRETO	LAUA MARIA BARRETO	3112500120	\N	t	2026-09-04 14:30:59.949668+00
138	1062812149	ALAM DAVID	DAZA ANDRADE	PENDIENTE POR REGISTRAR	3173885893	\N	t	2026-09-04 14:30:59.963513+00
139	1062812042	AURA DANIELA	DIAZ REYES	MARTHA JOHANA REYES QUINTANA	3107116942	\N	t	2026-09-04 14:30:59.97453+00
140	1064805602	JUAN DIEGO	GARCIA DIAZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:30:59.98555+00
141	1062815695	FRANCLIN RAFAEL	GUTIERREZ AMAYA	YURANIS AMAYA RIOS	3013203988	\N	t	2026-09-04 14:30:59.997339+00
142	5716516	EURIMAR SARAY	HERNANDEZ HERNANDEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.011149+00
143	1137725961	JAVIER DAVID	HERRERA BELENO	LUZ MARINA HERRERA BELEÑO	3016379165	\N	t	2026-09-04 14:31:00.023421+00
144	1062814335	PAUBLIZA	LAGUNA MARTINEZ	NEUDIS JOHANA MARTINEZ PADILLA	3103551383	\N	t	2026-09-04 14:31:00.046391+00
145	1064120134	SAHIRA SOFIA	LOPEZ LARA	PENDIENTE POR REGISTRAR	3147851817	\N	t	2026-09-04 14:31:00.067636+00
146	1065664382	TALIANA MICHEL	LOPEZ LARA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.090018+00
147	1062813759	CRISTIAN DAVID	MAESTRE CARCAMO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.110028+00
148	1062813399	YUVER DAVID	MARTINEZ CAMELO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.131657+00
149	1064800229	DANNA SOFIA	MORENO GUTIERREZ	PENDIENTE POR REGISTRAR	3226732997	\N	t	2026-09-04 14:31:00.153164+00
150	1064117472	CRISTIAN DAVID	PAVA HERNANDEZ	PENDIENTE POR REGISTRAR	3223341006	\N	t	2026-09-04 14:31:00.175285+00
151	1062811682	ESLENDIS GISETH	RAMOS MENGUAL	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.196453+00
152	1063962143	FABEL YESITH	RAMOS MENGUAL	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.214448+00
153	1064116499	LINA MARCELA	ROMERO MARTINEZ	MILADYS ESTHER MARTINEZ VELASQUEZ	3218990327	\N	t	2026-09-04 14:31:00.232353+00
154	1139126778	SHAIRA SOFIA	RUIZ VIDES	PENDIENTE POR REGISTRAR	3225338938	\N	t	2026-09-04 14:31:00.252715+00
155	1062408124	LUIS ALFONSO	RUMBO MEJIA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.271534+00
156	3100248	YORDENIS DANIEL	SANTIAGO MEDINA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.294975+00
157	5632376	NOAILYS VALENTINA	UZCATEGUI MEDINA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.315726+00
158	1082476830	TANIA ISABEL	VARELA PEREZ	PENDIENTE POR REGISTRAR	3012450328	\N	t	2026-09-04 14:31:00.336074+00
159	1062814008	JOSE RAFAEL	ALEMAN CARBONELL	PENDIENTE POR REGISTRAR	3217517893	\N	t	2026-09-04 14:31:00.356383+00
160	1066291322	NATALIE SOFIA	ARANZALES CHINCHILLA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.373351+00
161	1062811498	JUAN SEBASTIAN	BALLESTERO MOSCOTE	PENDIENTE POR REGISTRAR	3126817907	\N	t	2026-09-04 14:31:00.393953+00
162	1062813196	MARIANGEL	BUDINO RUMBO	PENDIENTE POR REGISTRAR	3214736071	\N	t	2026-09-04 14:31:00.410817+00
163	1062813733	SANTIAGO ANDRES	BUELVAS TARRA	YURAINIS CAROLINA TARRA VILLARRUEL	3145469762	\N	t	2026-09-04 14:31:00.442095+00
164	1104432260	RICHARD DAVID	BUENA MARTINEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.46104+00
165	1062812791	LAURA DANIELA	CABARCAS RAMOS	MAIRA ALEJANDRA RAMOS FLORIAN	3217087245	\N	t	2026-09-04 14:31:00.475556+00
166	1062812760	SHARAT DANIELA	CAMANO BENITEZ	RAFAEL ISAC CAMAÑOS BURGOS	3002308655	\N	t	2026-09-04 14:31:00.490174+00
167	1062815448	JORMAN SAID	CANIZARES PACHECO	PENDIENTE POR REGISTRAR	3217075205	\N	t	2026-09-04 14:31:00.502718+00
168	1122410898	ESAU DANIEL	CONTRERAS ALFARO	PENDIENTE POR REGISTRAR	3137184370	\N	t	2026-09-04 14:31:00.513444+00
169	1062811346	LUIS JOSE	CORONEL BARRETO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.525653+00
170	1062811096	MARIAM ALEXANDRA	CRUZ ACOSTA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.537453+00
171	1062811297	LAURA DANIELA	DIAZ BOHORQUEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.550211+00
172	1067721716	LINDA DEL CARMEN	DIAZ BOHORQUEZ	DIANA BOHORQUEZ PALOMINO	SIN REGISTRO	\N	t	2026-09-04 14:31:00.567198+00
173	1080437531	EDSON DANIEL	GARCIA LOPEZ	PENDIENTE POR REGISTRAR	3158292628	\N	t	2026-09-04 14:31:00.579069+00
174	1062815702	LIONEL ENRIQUE	MANJARREZ COSSIO	PENDIENTE POR REGISTRAR	3017535212	\N	t	2026-09-04 14:31:00.591065+00
175	1062814188	KATHERIN NIKOLL	MARRUGO MUNOZ	JEINER MARRUGO OSORIO	3233201206	\N	t	2026-09-04 14:31:00.600338+00
176	1066352676	ISAIAS JESUS	MARTINEZ CARRENO	PENDIENTE POR REGISTRAR	3105225020	\N	t	2026-09-04 14:31:00.60978+00
177	1062812011	ANTONELLA	MOLINA LAGUNA	YACID MOLINA CHINCHILLA	3135240935	\N	t	2026-09-04 14:31:00.619525+00
178	1062812502	MARIA ALEJANDRA	MOLINA RINCON	PENDIENTE POR REGISTRAR	3017556838	\N	t	2026-09-04 14:31:00.629958+00
179	1062812758	LAURA MARCELA	ORTIZ ANILLO	PENDIENTE POR REGISTRAR	3044877427	\N	t	2026-09-04 14:31:00.639689+00
180	1062809444	HUBER ANTONIO	OTALORA AVILA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.650312+00
181	1062812688	THAEL	PARRA OSPINO	PENDIENTE POR REGISTRAR	3118369918	\N	t	2026-09-04 14:31:00.665768+00
182	559200	TALIANA	PEREZ ORTIZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.677337+00
183	1062809010	CRISTHIAN CAMILO	RANGEL TORO	PENDIENTE POR REGISTRAR	3147855169	\N	t	2026-09-04 14:31:00.687621+00
184	1067623587	SAMUEL JOSE	RIVERA AVILA	OLGA LUCIA AVILA RODRIGUEZ	3234525127	\N	t	2026-09-04 14:31:00.698734+00
185	1062813796	CAMILO ANDRES	RODRIGUEZ ALBA	PENDIENTE POR REGISTRAR	3172426385	\N	t	2026-09-04 14:31:00.708846+00
186	1066885913	YEINER ANDRES	ROMERO JIMENEZ	ANA JIMENEZ LOPEZ	3148243025	\N	t	2026-09-04 14:31:00.718814+00
187	1062311905	MAYRODYS	SIERRA SUAREZ	DIANA PATRICIA SUAREZ RINCON	3207662888	\N	t	2026-09-04 14:31:00.729441+00
188	1062814167	ANGEL DAVID	TRIANA PENALOZA	PENDIENTE POR REGISTRAR	3007166602	\N	t	2026-09-04 14:31:00.738378+00
189	1062402565	THALIA LUCIA	ARZUAGA GUTIERREZ	MARYURIS YESENIA GUTIERREZ BAÑOS	3023947331	\N	t	2026-09-04 14:31:00.748283+00
190	1138088595	DANI FERNANDA	BARRERA VILLARUEL	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.76752+00
191	1137875004	MARIA JULIANA	BOLANO FLORIAN	PENDIENTE POR REGISTRAR	3207605537	\N	t	2026-09-04 14:31:00.780508+00
192	1122816452	VALERIA MARGARITA	CARRILLO MENDOZA	PENDIENTE POR REGISTRAR	3016551968	\N	t	2026-09-04 14:31:00.792559+00
193	1062813963	STEVEN JOSE	CENTENO RAMOS	PENDIENTE POR REGISTRAR	3205582845	\N	t	2026-09-04 14:31:00.802991+00
194	1119396872	KATERIN JOHANA	CONTRERAS GRANADOS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.814939+00
195	1120750198	YEIKA NIXHEL	ESCALANTE DIAZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.827746+00
196	7761694	LUIS EDUARDO	FERNANDEZ MONTUFAR	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.837976+00
197	1062811869	RONNEY	FLORIAN MADRID	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.847285+00
198	1062812695	KALYANA LUISA	FONSECA POLO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.859475+00
199	10044223250	ELIANYS MARCELA	GIRALDO AMAYA	JOHANNA PATRICIA AMAYA MUÑOZ	3215939355	\N	t	2026-09-04 14:31:00.871628+00
200	1046713011	HALMER JOSE	GUERRA MEDINA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.881865+00
201	1067622401	XABDIEL	LEMUS MENDEZ	YESSICA PAOLA MENDEZ SANCHEZ	3106323263	\N	t	2026-09-04 14:31:00.891858+00
202	1062810681	JUAN DIEGO	LOPEZ BALLESTA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.902502+00
203	42234867207	ASHLEY VALERIA	LOPEZ TOVAR	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.912024+00
204	1062811296	NEIFER YACETH	LORA LOZANO	PENDIENTE POR REGISTRAR	3215558429	\N	t	2026-09-04 14:31:00.922267+00
205	1062813117	NEYMAR ANDRES	MACHADO SOLANO	YULIETH SOLANO	3115574683	\N	t	2026-09-04 14:31:00.932606+00
206	1062812084	YANDEL ALFONSO	MARTINEZ ROJAS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.941965+00
207	1062812606	DANIELA SOFIA	MOGOLLON SAUCEDO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:00.95148+00
208	1062813553	MIREL ANDRES	NIEVES ACOSTA	MIREL NIEVES GONZALEZ	3178874695	\N	t	2026-09-04 14:31:00.96524+00
209	1062811980	KAROL SHARITH	NUNEZ SIERRA	PENDIENTE POR REGISTRAR	3122379991	\N	t	2026-09-04 14:31:00.975223+00
210	1062812568	JOSELYN KEIRETH	ORELLANOS MARTINEZ	PENDIENTE POR REGISTRAR	3108273661	\N	t	2026-09-04 14:31:00.983796+00
211	1062813384	MOISES DAVID	OYOLA MENDOZA	MARY DUBIS MENDOZA GOMEZ	3015751374	\N	t	2026-09-04 14:31:00.993325+00
212	1065205521	ANTONELLA SOFIA	PENALOZA CASTRO	PENDIENTE POR REGISTRAR	3106238663	\N	t	2026-09-04 14:31:01.001763+00
213	1062811770	SEBASTIAN	QUIROGA LEMUS	PENDIENTE POR REGISTRAR	3212313112	\N	t	2026-09-04 14:31:01.013408+00
214	PENDIENTE_tr158252019	ASTRID VALERIA	RAMIREZ MONASTERIO	PENDIENTE POR REGISTRAR	3174625542	\N	t	2026-09-04 14:31:01.025738+00
215	1062810819	LUIS SANTIAG	RICO ORTEGA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.036057+00
216	1084787089	VALERI	RIVERA DORIA	PENDIENTE POR REGISTRAR	3143477552	\N	t	2026-09-04 14:31:01.045263+00
217	1062814069	SHAYBETH VALENTINA	SANCHEZ TAMARA	DEIVIS SANCHEZ CRESPO	3174802092	\N	t	2026-09-04 14:31:01.055607+00
218	1066886988	NIKOLL TATIANA	TOVAR BOLANO	PENDIENTE POR REGISTRAR	3045522136	\N	t	2026-09-04 14:31:01.070578+00
219	1062811705	SAMUEL DAVID	VALDERRAMA OSORIO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.090062+00
220	1065906876	ANNIE CATALINA	VELASCO NAVARRO	PENDIENTE POR REGISTRAR	3046659276	\N	t	2026-09-04 14:31:01.109623+00
221	1062814032	DAIRIS YULIETH	VERGARA MERCADO	PENDIENTE POR REGISTRAR	3007464639	\N	t	2026-09-04 14:31:01.129591+00
222	1062813713	BRENDA LICETH	ALVAREZ GUTIERREZ	PENDIENTE POR REGISTRAR	3043498971	\N	t	2026-09-04 14:31:01.149234+00
223	1062810927	JHOANNA LICETH	ASCANIO MARQUEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.171439+00
224	1062813599	THYAGO ANDRES	AVILA MORELO	PENDIENTE POR REGISTRAR	3226786063	\N	t	2026-09-04 14:31:01.192553+00
225	1062810683	JHONATAN DAVID	BARRAZA SUAREZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.212345+00
226	1062812010	VALERY YULIETH	BOTELLO CERVANTES	PENDIENTE POR REGISTRAR	3234668225	\N	t	2026-09-04 14:31:01.234077+00
227	1062812761	ANDREA CAMILA	CAMANO BENITEZ	RAFAEL ISAC CAMAÑOS BURGOS	3002308655	\N	t	2026-09-04 14:31:01.253674+00
228	1062812081	LUIS STEVAN	CANTILLO CAMPOS	PENDIENTE POR REGISTRAR	3205176137	\N	t	2026-09-04 14:31:01.285812+00
229	1062813373	SEBASTIAN ANDRES	CARRANZA AREVALO	PENDIENTE POR REGISTRAR	3012402378	\N	t	2026-09-04 14:31:01.30895+00
230	1062812792	SEBASTIAN ANDRES	CERVANTES VIDES	ANGELICA CAROLINA VIDES POLO	3235856759	\N	t	2026-09-04 14:31:01.320515+00
231	1066291245	MARIA MILAGROS	CONTRERAS AVILA	PENDIENTE POR REGISTRAR	3213508766	\N	t	2026-09-04 14:31:01.332143+00
232	1067617222	MAUREN GISELL	DAZA ARMENTA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.342815+00
233	1070614504	CAROL MELIZA	DELGADO GOMEZ	PENDIENTE POR REGISTRAR	3147281362	\N	t	2026-09-04 14:31:01.353607+00
234	1062812629	ASHLYN IVANNA	DIAZ GIRALDO	PENDIENTE POR REGISTRAR	3123428910	\N	t	2026-09-04 14:31:01.364988+00
235	1062812913	DANNA VALENTINA	ESCOBAR BELENO	MARITZA LUZ BELEÑO CAMPO	3205205120	\N	t	2026-09-04 14:31:01.375738+00
236	1067616697	MARIA ALEJANDRA	ESCORCIA PEREZ	PENDIENTE POR REGISTRAR	3024636020	\N	t	2026-09-04 14:31:01.385268+00
237	1062813981	NAILETH SOFIA	FLOREZ BARRAZA	KEYLA MARCELA BARRAZA MEJIA	3158913287	\N	t	2026-09-04 14:31:01.395067+00
238	1062814134	SANTIAGO ALEXIS	FLORIAN HERNANDEZ	PENDIENTE POR REGISTRAR	3143746809	\N	t	2026-09-04 14:31:01.405866+00
239	1062812893	WENDY VANESA	LAGUNA ALMAGRO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.416009+00
240	1066885894	NEIEL SARID	LICONA SUAREZ	DALDWIN LICONA BARAHONA	3046500140	\N	t	2026-09-04 14:31:01.426471+00
241	1062811687	SCARLLETT SUSETT	LOPEZ ARGOTE	YOLANDA ARGOTE PALOMINO	3135681157	\N	t	2026-09-04 14:31:01.437123+00
242	7122014	JAVIER ANDRES	MEDINA SALGADO	PENDIENTE POR REGISTRAR	3007298963	\N	t	2026-09-04 14:31:01.45136+00
243	1020304	ZAIRA THALIA	MOLINA MORELO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.462308+00
244	1062809793	JHOINER ESMITH	OROZCO SILVA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.47332+00
245	741236	YOIDEMAR MARIETH	OVIEDO CERVANTES	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.484587+00
246	1062814033	SARA VALENTINA	PADILLA PARRA	JOSE ANTONIO PADILLA CORTES	3226528649	\N	t	2026-09-04 14:31:01.49775+00
247	1029889242	JUAN JOSE	PENA GIRALDO	ANGIE GIRALDO	3226626333	\N	t	2026-09-04 14:31:01.509381+00
248	1062812028	RADAMEL ADRIAN	QUINTERO YANEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.520793+00
249	1062811448	THALIANA PAOLA	RADA HURTADO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.5336+00
250	1062812648	JAIMAR SELESTE	RAMOS BOTELLO	PENDIENTE POR REGISTRAR	3188083058	\N	t	2026-09-04 14:31:01.551714+00
251	1062811111	JHOYMAN ANDRES	RIVERA REDONDO	PENDIENTE POR REGISTRAR	3108456699	\N	t	2026-09-04 14:31:01.575877+00
252	1064117230	ANDRY VANESSA	ROBLES JAIMES	JHON EDINSON ROBLES SANCHEZ	3145013384	\N	t	2026-09-04 14:31:01.594698+00
253	1062814166	DEIBYS JOSE	RODRIGUEZ ORTIZ	LISBETH ORTIZ JARAMILLO	3003101937	\N	t	2026-09-04 14:31:01.608694+00
254	1122408689	DEINER DAVID	ACUNA ESTRADA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.625518+00
255	1062810830	JOHANIS SOFIA	ANICHARICO ARROYO	JHOJANA ARROYO MATIUTH	3145254947	\N	t	2026-09-04 14:31:01.643104+00
256	1062812122	SCARLETH YULIANA	APONTE ORTIZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.667008+00
257	1065241856	DANIELA ISABEL	ARROYO RUIZ	PENDIENTE POR REGISTRAR	3145576403	\N	t	2026-09-04 14:31:01.682596+00
258	1023401005	HERMES SEBASTIAN	BERMUDEZ DAZA	YIRLY PAOLA DAZA SILVA	3172659557	\N	t	2026-09-04 14:31:01.70237+00
259	1067624010	MATHIAS	CAMPOS MORALES	PENDIENTE POR REGISTRAR	3168657505	\N	t	2026-09-04 14:31:01.719384+00
260	1062813443	DEILLYS SOFIA	CANTILLO AVILA	PENDIENTE POR REGISTRAR	3147350471	\N	t	2026-09-04 14:31:01.736032+00
261	1062814256	IVAN ANDRES	CANTILLO JIMENEZ	PENDIENTE POR REGISTRAR	3122642206	\N	t	2026-09-04 14:31:01.749329+00
262	1062820813	ALIANNY MILENA	CHACIN SALGADO	PENDIENTE POR REGISTRAR	3007298963	\N	t	2026-09-04 14:31:01.764771+00
263	1062812050	MOISES DAVID	FONSECA BOLANO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.779473+00
264	42234790698	KRISTIAN ENRIQUE	GONZALEZ FERNANDEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.795308+00
265	1195213844	LIAN ESTEBAN	JIMENEZ GALINDO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.808961+00
266	1062812219	MAYDE ZULEY	LIMA CERVANTES	MAYRA ALEJANDRA LIMA CERVANTES	3016970012	\N	t	2026-09-04 14:31:01.819165+00
267	1062813602	KEREN JOHANA	LOPEZ CANTILLO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.831522+00
268	1160647	OSMARY ELIANNY	MARTINEZ MORILLO	PENDIENTE POR REGISTRAR	3132372122	\N	t	2026-09-04 14:31:01.843694+00
269	1062812496	YERALD JOSE	MARTINEZ PAZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.855308+00
270	1062811669	JHOAN DAVID	MARTINEZ ROJAS	OBLEIDIS MARIA PEREZ SOCARA	3135641760	\N	t	2026-09-04 14:31:01.869172+00
271	1066353388	YESID DAVID	MESTRE GUTIERREZ	PENDIENTE POR REGISTRAR	3135307889	\N	t	2026-09-04 14:31:01.882426+00
272	1062810236	JESUS ADRIAN	MEZA GUERRERO	ESNELIS GUERRERO MONTERO	3177160002	\N	t	2026-09-04 14:31:01.896794+00
273	1062813580	VALERY ZAILETH	MEZA ONATE	JHON SMITH MEZA VILLA	3207011494	\N	t	2026-09-04 14:31:01.910992+00
274	1137875609	JHELEN ESTHER	MOLINA BARRAZA	JUAN CARLOS MOLINA RONDON	3205910674	\N	t	2026-09-04 14:31:01.924538+00
275	1064799439	MICHELL DAYANA	MORENO BUDINO	MAIRA BUDIÑO OSORIO	3215844815	\N	t	2026-09-04 14:31:01.935936+00
276	1062810916	LUIS ALBERTO	NAVARRO SOTO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.946492+00
277	1085230114	JADER YASSER	ORTIZ MOVILLA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.958512+00
278	1063491589	CAROL SOFIA	OTALORA BERRUECO	PENDIENTE POR REGISTRAR	3113516302	\N	t	2026-09-04 14:31:01.968993+00
279	1062813518	LUCIANA VALERIA	POLO LOZANO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.978703+00
280	1062814053	CLEYDER ENRIQUE	QUINTERO BARRAZA	PENDIENTE POR REGISTRAR	3126409412	\N	t	2026-09-04 14:31:01.989513+00
281	1062812305	SHARITH VALENTINA	RAMIREZ BARRAZA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:01.999772+00
282	1063601681	ANGELICA MARIA	RIVAS JIMENEZ	PENDIENTE POR REGISTRAR	3117449848	\N	t	2026-09-04 14:31:02.010377+00
283	1064115756	MAYKER STIBEN	TABARES OSPINO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.020009+00
284	1062813814	GEYSEL MICHELL	TARRA BAZA	GUSTAVO RAMON TARRA BELTRAN	3185005362	\N	t	2026-09-04 14:31:02.030103+00
285	1067626429	EUNICE	TRILLOS VILLALOBOS	MIGDALIA VILLALOBOS SANCHEZ	3043788490	\N	t	2026-09-04 14:31:02.039834+00
286	1062810730	CLARA ELENA	ADECHINE GARCIA	PENDIENTE POR REGISTRAR	3107371094	\N	t	2026-09-04 14:31:02.049757+00
287	1062811849	SOFIA ALEJANDRA	ANILLO MALO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.068148+00
288	1085228979	JESUS MANUEL	ARRIETA ESCOBAR	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.079329+00
289	1062813716	ANDRES SANTIAGO	BARRIOS CARCAMO	XIOMAR MILENA CARCAMO HERNANDEZ	3218253216	\N	t	2026-09-04 14:31:02.09047+00
290	PENDIENTE_tr172662023	NAHIROBY ANYELITH	BETANCOURT YEPEZ	PENDIENTE POR REGISTRAR	3013815974	\N	t	2026-09-04 14:31:02.100877+00
291	1062813798	MARIANA SOFIA	CONTRERAS BUELVAS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.110129+00
292	1062811286	VALENTINA	ESCOBAR CARDENAS	AURA MARIA CARDENAS HERRERA	3215436428	\N	t	2026-09-04 14:31:02.120504+00
293	1062811227	ESTEBAN DAVID	ESCOBAR GARIZABALO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.130529+00
294	1062813988	KARIN LOANA	GARCIAS COSSIO	PENDIENTE POR REGISTRAR	3016639807	\N	t	2026-09-04 14:31:02.141988+00
295	1130295491	SHAYRA PAOLA	GERONIMO BARRANCO	PENDIENTE POR REGISTRAR	3015984985	\N	t	2026-09-04 14:31:02.152226+00
296	13497003	JOHANA SARIT	GUTIERREZ GARCIA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.165568+00
297	1119398919	KEINER DAVID	JIMENEZ HERRERA	SANDRA HERRERA CABALLERO	3215417423	\N	t	2026-09-04 14:31:02.18199+00
298	1062809850	YEIBER JESUS	MENGUAL HERNANDEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.195452+00
299	1062812741	YADER JOHEL	MERINO ORTIZ	PENDIENTE POR REGISTRAR	3225164135	\N	t	2026-09-04 14:31:02.20544+00
300	1062807957	JHON JAIDER	MIRANDA ZUNIGA	PENDIENTE POR REGISTRAR	3206273012	\N	t	2026-09-04 14:31:02.216425+00
301	1062813581	JEISON STIVEN	MONTERO OCHOA	PENDIENTE POR REGISTRAR	3204611339	\N	t	2026-09-04 14:31:02.228438+00
302	1065675195	ANTONY JESUS	NUNEZ PEREZ	DONAIDA PEREZ GUTIERREZ	3176570315	\N	t	2026-09-04 14:31:02.240711+00
303	1031836511	NATALIA LUCIA	OROZCO APONTE	PENDIENTE POR REGISTRAR	3244263554	\N	t	2026-09-04 14:31:02.250117+00
304	1045714935	OSCAR MANUEL	OROZCO VANEGAS	PENDIENTE POR REGISTRAR	3015252152	\N	t	2026-09-04 14:31:02.263577+00
305	1062810738	JUAN CARLOS	ORTIZ SANGUINO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.273528+00
306	1062811763	JHOAN ANDRES	PACHECO ONATE	ODALIS OÑATE GUZMAN	3103393365	\N	t	2026-09-04 14:31:02.283087+00
307	1062812416	KEVIN ANDRES	PALENCIA CARDENAS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.294165+00
308	1091991666	YIRHET SOFIA	PEREZ BARAHONA	STEFFANY BARAHONA PABA	3133171175	\N	t	2026-09-04 14:31:02.305783+00
309	1065645926	CARLIS TALIANA	QUINTERO CASTILLO	PENDIENTE POR REGISTRAR	3229495827	\N	t	2026-09-04 14:31:02.316279+00
310	1137725438	JULIAN DAVID	RIVAS HERRERA	PENDIENTE POR REGISTRAR	3188450809	\N	t	2026-09-04 14:31:02.326814+00
311	1122821365	LUNA SOFIA	RIVERA SOLANO	PENDIENTE POR REGISTRAR	3206163231	\N	t	2026-09-04 14:31:02.33686+00
312	PENDIENTE_tr170642022	DANIEL ENRIQUE	SOLANO MARIN	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.347208+00
313	5341744	ADRIAN RICARDO	TORREALBA BRICENO	PENDIENTE POR REGISTRAR	3116664908	\N	t	2026-09-04 14:31:02.360391+00
314	1066353106	ANDRES CAMILO	VANEGAS PARDO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.370734+00
315	1082496189	JULIO CESAR	VELAIDES SORACA	ODALIS SORACA CORRALES	3233027662	\N	t	2026-09-04 14:31:02.38137+00
316	1146149	YOIDIMAR MARIE	OVIEDO CERVANTE	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.392737+00
317	1043165479	YENDRI SMITH	AHUMADA HERNANDEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.403668+00
318	1062811999	ISSEL TATIANA	AMARIS PALLARES	ELIA BLASINA PAYARES MIER	3145667169	\N	t	2026-09-04 14:31:02.416244+00
319	1097198871	JOEL SANTIAGO	ANAYA RICO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.437884+00
320	1062812920	MARIA CAMILA	ASCANIO ANGULO	DAMITH PAOLA ANGULO RICO	3136108129	\N	t	2026-09-04 14:31:02.460937+00
321	1062812649	ESTEBAN	AVENDANO MOLINA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.474196+00
322	1062812436	ISABELLA SOFIA	BARRIOS HERNANDEZ	WENDY KARELIS HERNANDEZ MENDOZA	3043408140	\N	t	2026-09-04 14:31:02.483572+00
323	6734745	YUNIEL	BLANQUICET ORTEGA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.495173+00
324	1062811387	LUIS DANIEL	CAMPOS GARCIA	KELLYS JHOHANA GARCIA GIL	3108251004	\N	t	2026-09-04 14:31:02.507143+00
325	1062811267	EYCKER JOSUE	CANATE BELENO	ELIANA GREGORIA BELEÑO OSORIO	SIN REGISTRO	\N	t	2026-09-04 14:31:02.518438+00
326	1062810357	KAREN YULIETH	CAREY MARTINEZ	PENDIENTE POR REGISTRAR	3117603839	\N	t	2026-09-04 14:31:02.528905+00
327	1062811099	LUIS SANTIAGO	CARPIO SANCHEZ	YELANIA SANCHEZ SUAREZ	3114165509	\N	t	2026-09-04 14:31:02.53789+00
328	1062812720	MEISON DAVID	CASTILLEJO PEREZ	CLAUDIA ROSA PEREZ MARQUEZ	3103777082	\N	t	2026-09-04 14:31:02.545923+00
329	1141122197	ANDRES CAMILO	CASTRO CASTRO	PENDIENTE POR REGISTRAR	3147942497	\N	t	2026-09-04 14:31:02.556219+00
330	1062812458	MARIANA VALENTINA	CORSER BOLANO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.567115+00
331	1065898019	THOMAS SNEIDER	CUBIDES QUINONES	PENDIENTE POR REGISTRAR	3045707396	\N	t	2026-09-04 14:31:02.57781+00
332	1064128273	HEILIS ALEXANDRA	DE LA CRUZ ORTIZ	PENDIENTE POR REGISTRAR	3146292421	\N	t	2026-09-04 14:31:02.590423+00
333	PENDIENTE_tr178182024	DARIANA ISABEL	GARRIDO SEQUEDA	PENDIENTE POR REGISTRAR	3208392878	\N	t	2026-09-04 14:31:02.600895+00
334	1062812565	ALEANNYS	HENRIQUEZ MACHADO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.610898+00
335	1062809501	CARLOS MARIO	HERRERA CHAMORRO	PENDIENTE POR REGISTRAR	3108891766	\N	t	2026-09-04 14:31:02.622862+00
336	112309215	KANER ALBERTO	JIMENEZ HERRERA	SANDRA HERRERA CABALLERO	SIN REGISTRO	\N	t	2026-09-04 14:31:02.633774+00
337	1062810653	JHON ESTEBAN	MEJIA AGUIRRE	VIVIANA AGUIRRE VERGARA	3135972398	\N	t	2026-09-04 14:31:02.645371+00
338	1062811533	XAVIER DAVID	MENDOZA CONTRERAS	PENDIENTE POR REGISTRAR	3023778058	\N	t	2026-09-04 14:31:02.655956+00
339	1062814381	KENER MANUEL	MENDOZA HERRERA	PENDIENTE POR REGISTRAR	3219263967	\N	t	2026-09-04 14:31:02.668597+00
340	1065667668	YURANIS PAOLA	NEGRETE CARDONA	PENDIENTE POR REGISTRAR	3234659669	\N	t	2026-09-04 14:31:02.681363+00
341	1062817386	ANDREA ESTEFANIA	ORTEGA OROZCO	PENDIENTE POR REGISTRAR	3135962275	\N	t	2026-09-04 14:31:02.702641+00
342	1062811190	JAKELIN	ORTIZ ANILLO	PENDIENTE POR REGISTRAR	3044877427	\N	t	2026-09-04 14:31:02.731534+00
343	1062807218	YISETH CAROLINA	OYOLA CARDENAS	PENDIENTE POR REGISTRAR	3209759863	\N	t	2026-09-04 14:31:02.746095+00
344	1066286978	DANILO RAFAEL	PASSO BARRETO	MIRIAN BARRETO LUNA	SIN REGISTRO	\N	t	2026-09-04 14:31:02.758616+00
345	1062810741	LEIDYS ANGELI	PEDROZO CASTILLO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.782214+00
346	1062811176	NATALIA	PEDROZO CASTILLO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.806601+00
347	1062811580	EDWIN JAVIER	RICO DIAZ	PENDIENTE POR REGISTRAR	3117317374	\N	t	2026-09-04 14:31:02.818822+00
348	1062810394	SEBASTIAN ANDRES	SANCHEZ BARRERA	PENDIENTE POR REGISTRAR	3217104132	\N	t	2026-09-04 14:31:02.831329+00
349	1067816298	SHADIA MICHEL	VARGAS QUIROZ	PENDIENTE POR REGISTRAR	3126120845	\N	t	2026-09-04 14:31:02.842894+00
350	1146335705	DANNA VALENTINA	VILLARREAL GUILLEN	PENDIENTE POR REGISTRAR	3107863927	\N	t	2026-09-04 14:31:02.854803+00
351	1062810651	ELHOYZA	ZAMBRANO RIZO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.867979+00
352	1062809596	FRANKLIN DANIEL	ZUNIGA BAQUERO	PENDIENTE POR REGISTRAR	3153482639	\N	t	2026-09-04 14:31:02.880894+00
353	1062810384	ROSA HISELA	ALMAGRO ORTIZ	GLADIS ORTIZ OSPINO	3218755042	\N	t	2026-09-04 14:31:02.89216+00
354	1062809713	ANUAR DAVID	ALTAMAR MURGAS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.900206+00
355	1122499993	NAHIARA LAISELLY	ARDILA CUELLO	ELIZABETH CUELLO OSORIO	3106155236	\N	t	2026-09-04 14:31:02.910303+00
356	PENDIENTE_tr170892022	HENDERSON JAIR	ARRIETA CORONEL	PENDIENTE POR REGISTRAR	3125857275	\N	t	2026-09-04 14:31:02.920451+00
357	1062810572	ROLINYER	BABILONIA VIZCAINO	DENIS ESTHER VISCAINO ORTEGA	3205116695	\N	t	2026-09-04 14:31:02.930801+00
358	1062813525	KAITLYN ANELEY	BRITO MARTINEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.939944+00
359	1062811538	ALDO JOSE	CAMARGO GUTIERREZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.948188+00
360	1081924936	LILI SOFIA	CARRASQUILLA ACUNA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.957272+00
361	5939250	RICHARD EDUARDO	CHIRINO SILVA	PENDIENTE POR REGISTRAR	3105070548	\N	t	2026-09-04 14:31:02.967378+00
362	1065850533	DORIANNA SARAITH	CORDOBA MOLINA	ELCIDA MOLINA ROMERO	3008378912	\N	t	2026-09-04 14:31:02.979428+00
363	1062811355	EMANUEL	FLORIAN ARROYO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:02.992114+00
364	1062811762	JUAN CARLOS ANDRES	GIL GALVAN	YULEIDIS GALVAN SUAREZ	3153125083	\N	t	2026-09-04 14:31:03.004126+00
365	33773447	YONAIKER ALEXANDER	GIL HEREIDA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.014435+00
366	1062812005	EDWIN MANUEL	GUEVARA ALTAMAR	MAIRA ACENETH ALTAMAR CARRANZA	3022998719	\N	t	2026-09-04 14:31:03.02499+00
367	1128151784	VALERY SOFIA	HERRERA ACUNA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.037951+00
368	1067618697	HILLARY MARCELA	LUNA BRUGES	PENDIENTE POR REGISTRAR	3178306432	\N	t	2026-09-04 14:31:03.059013+00
369	1066352325	YOEHEBIS KARINA	MANGA BELENOS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.080514+00
370	1065824117	DANNA DANIELA	MARTINEZ SUAREZ	ELIANA PAOLA SUAREZ MUÑOZ	3124537030	\N	t	2026-09-04 14:31:03.102163+00
371	1067620363	ALIETH VALENTINA	MOJICA PEREZ	JHON EDWIN MOJICA GARRIDO	3176820216	\N	t	2026-09-04 14:31:03.124605+00
372	1062812989	ALEXIS JHOAN	MOLINA DELGADO	PENDIENTE POR REGISTRAR	3233592799	\N	t	2026-09-04 14:31:03.144743+00
373	5000	EVER DACID	MONTECINO BUDINO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.164189+00
374	1062811174	LUIS ALCIDES	OSORIO QUIJANO	ADALGIRA OSORIO MOLINA	3145828559	\N	t	2026-09-04 14:31:03.185685+00
375	1062811085	PITTER JAFET	OSPINO BENAVIDES	PENDIENTE POR REGISTRAR	3104347034	\N	t	2026-09-04 14:31:03.206918+00
376	1062812164	LUAN RAFAEL	PEREZ MENDOZA	LENIS ESTELA MEDOZA JURADO	3105142729	\N	t	2026-09-04 14:31:03.22629+00
377	1102374415	JUAN PABLO	PITA SALAZAR	PENDIENTE POR REGISTRAR	3045353359	\N	t	2026-09-04 14:31:03.245052+00
378	1062812137	DANELA SOFIA	POLANCO ROMERO	YEDIS MARCELA ROMERO PAEZ	3157185464	\N	t	2026-09-04 14:31:03.263779+00
379	1063962350	SANTIAGO	REGINO GARCIA	PENDIENTE POR REGISTRAR	3013816244	\N	t	2026-09-04 14:31:03.29635+00
380	1062812021	LUIS MANUEL	RODRIGUEZ CANTILLO	ZORAIDA CANTILLO JACOME	3235675975	\N	t	2026-09-04 14:31:03.318098+00
381	1062811748	LORAYNES MARCELA	SUAREZ RODRIGUEZ	TATIANA RODRIGUEZ ARGOTE	3185600073	\N	t	2026-09-04 14:31:03.335918+00
382	1062812350	GUSTAVO FELIPE	TARRA BAZA	LIZZETH PAZ MORENO	3045476043	\N	t	2026-09-04 14:31:03.351802+00
383	99966633000	ANGELA JULIETA	TORRADO BUENO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.370333+00
384	1062812484	KEVIN DAVID	VALBUENA MEJIA	NOLEYDYS USTARIS BLANCO	SIN REGISTRO	\N	t	2026-09-04 14:31:03.385124+00
385	1062812079	MAILLY SOFFIA	VASQUEZ URBINA	PENDIENTE POR REGISTRAR	3105462066	\N	t	2026-09-04 14:31:03.399874+00
386	1062811953	ANALIA	VILLEGAS HERNANDEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.413061+00
387	1081925251	VALERIE JULIANA	VIZCAINO PARRA	PENDIENTE POR REGISTRAR	3145024039	\N	t	2026-09-04 14:31:03.426033+00
388	1065844381	KEINER ALEXANDER	ARRIETA LINARES	PENDIENTE POR REGISTRAR	3153047658	\N	t	2026-09-04 14:31:03.438767+00
389	1067724091	DAINIS CAROLINA	BEDOYA GARCIA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.454054+00
390	1066352622	DIEGO ANDRES	BOLANO PAEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.464855+00
391	1062810958	ANYELO JULIAN	CALLE JIMENEZ	MARTHA CECILIA CALLE	SIN REGISTRO	\N	t	2026-09-04 14:31:03.474576+00
392	1064719731	DANIEL	CASTILLEJO CRUZADO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.483893+00
393	1068389762	ARMANDO LUIS	CERVANTES DE LA CRUZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.494161+00
394	1062810540	JUAN CARLOS	CERVANTES TARRA	VERINICA LILIANA TARRA BELTRAN	3108238814	\N	t	2026-09-04 14:31:03.508683+00
395	1062809886	BRAYAN RAFAEL	CUELLO MENDIVIL	PENDIENTE POR REGISTRAR	3155283774	\N	t	2026-09-04 14:31:03.527343+00
396	1062812059	JORGE DANIEL	GARAVIS AVILA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.536069+00
397	1062813082	RITTER JOSE	GARCIA SANTIAGO	MARIA FERNANDA SANTIAGO FRANCO	3126375118	\N	t	2026-09-04 14:31:03.545296+00
398	1067610924	BRAYAN DANIEL	GONZALEZ CARMONA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.557133+00
399	1062809344	NEUDYS JOHANNA	HERRERA BANOS	MARIANA BAÑOS RODRIGUEZ	SIN REGISTRO	\N	t	2026-09-04 14:31:03.565847+00
400	1062809888	EIDER	HERRERA CONTRERAS	YANETH CONTRERAS BENAVIDES	SIN REGISTRO	\N	t	2026-09-04 14:31:03.575935+00
401	1062809827	SILVESTRE JOSE	JIMENEZ CAPITAN	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.584924+00
402	1062812120	SERGIO ANDRES	MACHADO ARRIETA	VERONICA ARRIETA CERPA	3146592978	\N	t	2026-09-04 14:31:03.596451+00
403	1062811843	WENDYS SARAY	MARQUEZ BECERRA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.605048+00
404	1045308719	JHON MAICOL	MARTINEZ PABON	PENDIENTE POR REGISTRAR	3217417890	\N	t	2026-09-04 14:31:03.612948+00
405	1062811026	SHAIRA NICOLL	MORALES ENAMORADO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.623983+00
406	1127058475	SANTIAGO JAFET	NAVARRO GOMEZ	DIANA CAROLINA GOMEZ MONTERO	3103383558	\N	t	2026-09-04 14:31:03.633705+00
407	1062812440	JEISY MARCELA	PADILLA MANJARREZ	ELFI XIOMARA MANJARREZ HERNANDEZ	3133071751	\N	t	2026-09-04 14:31:03.645448+00
408	1066353385	JESUS DAVID	PAEZ TAPIAS	PENDIENTE POR REGISTRAR	31087439396	\N	t	2026-09-04 14:31:03.658441+00
409	1062810902	SHAIRETH SOFIA	PEDROZO QUIROZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.709505+00
410	7532337	JIRBELIS ISABEL	QUINTERO GONZALEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.721765+00
411	1062813474	LUIS ANGEL	RADA DE LA HOZ	ALVARO JAVIER RADA BOLAÑO	3178952131	\N	t	2026-09-04 14:31:03.733348+00
412	1064797297	JUAN SEBASTIAN	RADA GUTIERREZ	PENDIENTE POR REGISTRAR	3225447823	\N	t	2026-09-04 14:31:03.745688+00
413	1062812784	ZEYLIN NICOLL	RIOS MANJARREZ	ROSANGELA MANJARREZ HERNANDEZ	3114379898	\N	t	2026-09-04 14:31:03.764574+00
414	1062810708	JASBLEIDIS	RODRIGUEZ TORRES	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.778355+00
415	1048215639	CAMILO ANDRES	ROLONG LINARES	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.790235+00
416	1048217010	SAMUEL DANIEL	ROLONG LINARES	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.801149+00
417	1062811356	HIAN ANDRES	RUEDA PENALOZA	PENDIENTE POR REGISTRAR	3167659630	\N	t	2026-09-04 14:31:03.812063+00
418	1062811692	DANIEL DE JESUS	SAYAS CUELLO	PENDIENTE POR REGISTRAR	3024264680	\N	t	2026-09-04 14:31:03.824149+00
419	1062812154	ELKIN DAVID	SILVA MARTINEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.834026+00
420	1066884537	YULIANA ANDREA	SOTO LIZARAZO	PENDIENTE POR REGISTRAR	3135365544	\N	t	2026-09-04 14:31:03.845433+00
421	1062811993	NATALI MICHELL	TOLEDO SANCHEZ	YORLEINIS PATRICIA SANCHEZ SUAREZ	3147678993	\N	t	2026-09-04 14:31:03.859386+00
422	1121044250	EMMANUEL DAVID	TORRES RUIZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.870927+00
423	1062811541	NILDA ROSA	TRESPALACIOS CARCAMO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.880297+00
424	1062811140	ANIS MARIA	ZAMORA CENTENO	EDELMIRA CENTENO	3137469979	\N	t	2026-09-04 14:31:03.889869+00
425	1066289257	ORIANA SOFIA	ALTAHONA MERCADO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.89969+00
426	1062811840	DAYLEN TATIANA	BABILONIA PARRA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.909301+00
427	1066880976	ALEJANDRO	BARRAZA LAGUNA	PENDIENTE POR REGISTRAR	3233562873	\N	t	2026-09-04 14:31:03.918973+00
428	1062809938	JHONATAN STIVEN	BERMUDEZ GARCIA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.930452+00
429	1065205099	MARIANA LUCIA	CALDERON CASTRO	PENDIENTE POR REGISTRAR	3114010213	\N	t	2026-09-04 14:31:03.940837+00
430	1067617831	CAMILO ANDRES	CASTRO MOLINA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:03.952868+00
431	1067725459	ALEXANDER DAVID	CENTENO OROZCO	PENDIENTE POR REGISTRAR	3135460504	\N	t	2026-09-04 14:31:03.970865+00
432	1062811374	ANGEL DAVID	CUELLO MENDIVIL	PENDIENTE POR REGISTRAR	3155283772	\N	t	2026-09-04 14:31:03.984347+00
433	1062809265	STIVEN ANDRES	DELGADO PEDROZO	INGRID PEDROZO MARTINEZ	SIN REGISTRO	\N	t	2026-09-04 14:31:03.995392+00
434	1216969123	ALONSO	GALVIS FERIAS	PENDIENTE POR REGISTRAR	3233364679	\N	t	2026-09-04 14:31:04.005967+00
435	1062810266	JESUS ADRIAN	GARCIA PEDROZO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.01572+00
436	1062812492	TAYRA MARCELA	GUEVARA SALCEDO	BEATRIZ ELENA SALCEDO BLANCO	3007760164	\N	t	2026-09-04 14:31:04.02516+00
437	1047349567	MAILIN VANESSA	GUTIERREZ RUA	VANESSA DEL CARMEN RUA SANJUAN	3007422002	\N	t	2026-09-04 14:31:04.037308+00
438	1062810509	YOHANNA MARIA	HERNANDEZ VIDES	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.048634+00
439	1062811418	JESUS ANTONIO	LEMUS LONDONO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.059964+00
440	1062811201	WEIDER JOSE	LOZANO MONTERO	JUANA DE DIOS MONTERO GOMEZ	3215764152	\N	t	2026-09-04 14:31:04.071788+00
441	1062811866	ZULY SADAY	MACHADO GULLOSO	PALMIDIS GULLOSO MEJIA	3106235772	\N	t	2026-09-04 14:31:04.083561+00
442	1062812504	HASSAN DAVID	MARQUEZ SUAREZ	WILFRAN MARQUEZ ROBLES	3146476234	\N	t	2026-09-04 14:31:04.095649+00
443	1062810422	SANTIAGO ANDRES	MARTINEZ CAFIEL	YECENIA DEL CARMEN CAFIEL BELTRAN	SIN REGISTRO	\N	t	2026-09-04 14:31:04.106239+00
444	77	SEBASTIAN ANTONIO	MARTINEZ CAFIEL	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.115666+00
445	1062812092	NAIDELIN SOFIA	MARTINEZ SANCHEZ	YULEIMA SANCHEZ	3106510158	\N	t	2026-09-04 14:31:04.127577+00
446	1062812169	MARIA ALEJANDRA	MOLINA AMAYA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.138447+00
447	1062812015	AISHA NAIARA	MOLINA LOZANO	PENDIENTE POR REGISTRAR	3205732909	\N	t	2026-09-04 14:31:04.14947+00
448	1065663710	JOSE MANUEL	MONTERO OCHOA	PENDIENTE POR REGISTRAR	3204611339	\N	t	2026-09-04 14:31:04.161892+00
449	1062811913	JOSUE	PABA NAVARRO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.172419+00
450	1091983438	JESUS MANUEL	PATINO LIZARAZO	BIBIANA LIZARAZO SUAREZ	3145807729	\N	t	2026-09-04 14:31:04.181594+00
451	1066290221	NATALY MICHELL	POLO PEREZ	PENDIENTE POR REGISTRAR	3135460504	\N	t	2026-09-04 14:31:04.193155+00
452	1062807084	CELICA DE LOS ANGELES	RAMOS FIGUEROA	PENDIENTE POR REGISTRAR	3216158723	\N	t	2026-09-04 14:31:04.204536+00
453	1062808477	NATHALY YINETH	RAMOS MENGUAL	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.21288+00
454	1092954073	MARINELA	RINCON ZULETA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.223098+00
455	1062812445	YORYANIS PATRICIA	SUAREZ AVILA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.231663+00
456	1065663678	JOSE GUILLERMO	URDANETA ARRIETA	JOSE MARTIN URDANETA MONSALVO	3118020570	\N	t	2026-09-04 14:31:04.241576+00
457	1062811617	LEIDON ANDRES	VARGAS PEDROZO	PENDIENTE POR REGISTRAR	3183899727	\N	t	2026-09-04 14:31:04.251272+00
458	1064115626	YORLIS ESTHER	VENECIAS OSPINO	PENDIENTE POR REGISTRAR	3135028483	\N	t	2026-09-04 14:31:04.263058+00
459	1066883781	SEIRY SOFIA	VILLALOBOS PENALOZA	ROSA LEONOR PEÑALOZA ROSADO	3007324527	\N	t	2026-09-04 14:31:04.272806+00
460	1062812009	SANED DAVID	VILLAZON ORTIZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.281349+00
461	1066288522	JUAN ESTEBAN	ACERO OCAMPO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.292359+00
462	1065997565	MANUELA MERCEDES	ACOSTA JIMENEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.30147+00
463	1062810533	ANDRES FELIPE	ALVAREZ GUTIERREZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.311425+00
464	1067615649	ELIZABETH SOFIA	ANGULO BALLESTEROS	PENDIENTE POR REGISTRAR	3188402837	\N	t	2026-09-04 14:31:04.322199+00
465	1062811317	LEONIDAS	ARGOTE LARA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.331949+00
466	1062810467	ANGELICA MARIA	ARIAS MARTINEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.340426+00
467	1062810085	LUISK GIOVANETTI	BARAHONA MARQUEZ	GIOVANY ANDREK BARAHONA	3148322137	\N	t	2026-09-04 14:31:04.349821+00
468	1062810571	ANDRES ENRIQUE	BARRETO OROZCO	PENDIENTE POR REGISTRAR	3135054614	\N	t	2026-09-04 14:31:04.361175+00
469	1062811660	MARIANA SOFIA	BOLANO VIECCO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.37393+00
470	1066879889	KAROL DAYANA	BRUGES CASTANO	PENDIENTE POR REGISTRAR	3135031737	\N	t	2026-09-04 14:31:04.384672+00
471	1062809369	ADRIAN JOSE	CRUZ VILLAR	PENDIENTE POR REGISTRAR	3116885663	\N	t	2026-09-04 14:31:04.394923+00
472	1067612955	DEINER SAID	CUJIA GAMEZ	PENDIENTE POR REGISTRAR	3178828890	\N	t	2026-09-04 14:31:04.403653+00
473	1062808335	DAVID ANGEL	DE MOYA IBARRA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.412855+00
474	1062811401	DANIELA MICHEL	ESCOBAR BELENO	MARITZA LUZ BELEÑO CAMPO	3205205120	\N	t	2026-09-04 14:31:04.425063+00
475	1093916164	SHAIRA JULIETH	FONSECA MUNOZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.435542+00
476	1062809165	NOHELIA	GUZMAN RAMOS	PENDIENTE POR REGISTRAR	3235355382	\N	t	2026-09-04 14:31:04.450642+00
477	1062810591	MAILYS LICETH	LOPEZ MACHADO	DIANA MARITZA MACHADO HERRERA	3188061423	\N	t	2026-09-04 14:31:04.470628+00
478	302140	YEBLINZI	LUNA CONTRERAS	1 1 1	SIN REGISTRO	\N	t	2026-09-04 14:31:04.482924+00
479	1064796356	JOSE ANGEL	MANGA BELENOS	78798798 77987 979879879	SIN REGISTRO	\N	t	2026-09-04 14:31:04.493361+00
480	1062812041	GRESHELL SOFIA	MARTINEZ CABANA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.504954+00
481	1031823894	KEVIN SANTIAGO	MORELO RODRIGUEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.516055+00
482	1062815775	JOSE LUIS	MOYA HERNANDEZ	CECILIA HERNANDEZ ROMERO	3207877927	\N	t	2026-09-04 14:31:04.528345+00
483	1062810292	MELANIS VANESSA	NUNEZ MENDOZA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.539278+00
484	1062811445	JHOAN DAVID	OVIEDO FONSECA	JEIRYS DARLEY FONSECA MUNOZ	3217621975	\N	t	2026-09-04 14:31:04.549559+00
485	1065846804	VALESKA VALENTINA	PALOMINO VASQUEZ	PENDIENTE POR REGISTRAR	3127654577	\N	t	2026-09-04 14:31:04.559654+00
486	1066882017	ISAIAS GAEL	PARRA CABANA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.569964+00
487	1066351860	JHONNY ALFONSO	RAMOS ALVAREZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.58282+00
488	1062808789	SHARITH	RODRIGUEZ GARIZABALO	YAMID RODRIGUEZ DURAN	SIN REGISTRO	\N	t	2026-09-04 14:31:04.594843+00
489	1062400720	DANNA DANIELA	RODRIGUEZ GUTIERREZ	PENDIENTE POR REGISTRAR	3157668168	\N	t	2026-09-04 14:31:04.604108+00
491	1062811609	LAURA DANIELA	YANCE PEDROZO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.624122+00
492	1062809319	YOINER ISAAC	ACUNA TRESPALACIOS	PENDIENTE POR REGISTRAR	3206629132	\N	t	2026-09-04 14:31:04.632139+00
493	1062808666	LINEY JHOJANA	ANICHARICO ARROYO	JHOANA ARROYO MATIUTH	3145254947	\N	t	2026-09-04 14:31:04.641989+00
494	1067614626	LUZ ESTER	AVILA AMAYA	PENDIENTE POR REGISTRAR	3114317470	\N	t	2026-09-04 14:31:04.651343+00
495	1062811300	JUAN GERARDO	AVILA RAMIREZ	PENDIENTE POR REGISTRAR	3136142672	\N	t	2026-09-04 14:31:04.661832+00
496	1062810495	CRISTIAN	BARRAZA LOPEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.672473+00
497	1066290315	SAILY SARAY	BARRIOS CAMACHO	YOLIMA JUDITH CAMACHO NOVOA	3184108183	\N	t	2026-09-04 14:31:04.682076+00
498	1062808986	JHON ALEXIS	BAYONA MALDONADO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.691524+00
499	1066290912	SARA BELEN	BLANCHAR CASTRO	PENDIENTE POR REGISTRAR	3116366366	\N	t	2026-09-04 14:31:04.700235+00
500	1067616391	ALEJANDRA SOPHIA	BRAVO RICO	SINDY RICO OROZCO	3163152928	\N	t	2026-09-04 14:31:04.711166+00
501	1062810564	CRHIS ESTEFANY	CASTRO LOBO	PENDIENTE POR REGISTRAR	3226903700	\N	t	2026-09-04 14:31:04.721397+00
502	1067605236	YANIRI	CHAVEZ MEDINA	PENDIENTE POR REGISTRAR	3225362487	\N	t	2026-09-04 14:31:04.733275+00
503	1062808207	THALIANA NORETH	CUELLO MENDIVIL	LENYS MARIA MENDIVIL VANEGAS	3155283772	\N	t	2026-09-04 14:31:04.743861+00
504	1064798193	VILMA ANGELICA	FLORIAN ROYERO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.75449+00
505	1062810820	SAMUEL JOSEPH	GAMEZ MORENO	PENDIENTE POR REGISTRAR	3168201463	\N	t	2026-09-04 14:31:04.779936+00
506	1062811255	YOISI SELINA	JIMENEZ PEREZ	YOLIMA PEREZ JARABA	3106058802	\N	t	2026-09-04 14:31:04.793809+00
507	1067614404	VALENTINA	LEMUS OSPINO	PENDIENTE POR REGISTRAR	3126534510	\N	t	2026-09-04 14:31:04.804963+00
508	1062810146	JAVIER ANDRES	LOPEZ VELAIDES	JOHANA CAROLINA VELAIDES LERMA	3126303216	\N	t	2026-09-04 14:31:04.816206+00
509	1062811419	MARIANA DEYS	MACHADO RIVERA	OMAIRA RIVERA	3145800809	\N	t	2026-09-04 14:31:04.827713+00
510	1062809494	OSNAIDER DAVID	MARTINEZ VELASQUEZ	YASMIN MARTINEZ VELASQUEZ	SIN REGISTRO	\N	t	2026-09-04 14:31:04.838866+00
511	1062809719	SHEREY VALENTINA	MEJIA MARTINEZ	GLORIA STEFFANI MARTINEZ SUAREZ	3207395332	\N	t	2026-09-04 14:31:04.857139+00
512	1091984466	WENDY GUADALUPE	MORA RESTREPO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.881401+00
513	1062811038	JUAN DAVID	NUNEZ URQUIJO	ARACELIS URQUIJO PABON	3205606428	\N	t	2026-09-04 14:31:04.909579+00
514	1062810785	ANDRES SANTIAGO	ORTIZ DAZA	DUVIS LUCIA DAZA PALOMO	3212408346	\N	t	2026-09-04 14:31:04.92336+00
515	1062811593	KENNYA SOFIA	PARRA BELTRAN	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.937196+00
516	1062809620	JUAN JOSE	POLANCO MEZA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.948405+00
517	1062811212	XAVIER ALONSO	QUINTERO TORRES	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.966084+00
518	1143246903	JADES ARIANETH	REALES OSPINO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.987948+00
519	1067617265	SAMUEL	TRILLOS VILLALOBOS	TOMAS TRILLOS CHINCHILLA	3004121490	\N	t	2026-09-04 14:31:05.008568+00
520	1062811998	CLARIBEL MARINA	AMAYA PAYARES	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.026584+00
521	1066882029	ANALIA DEL PILAR	ANDRADE FONTALVO	MARIA ALEJANDRA FONTALVO FRIA	3126891143	\N	t	2026-09-04 14:31:05.044545+00
522	1065240494	NICOLL SOFIA	ARROYO RUIZ	JEISON ARROYO	SIN REGISTRO	\N	t	2026-09-04 14:31:05.059377+00
523	1062811062	GREIDIS YICETH	BLANCO RODRIGUEZ	MAYERLIS RODRIGUEZ GARCIA	3145538690	\N	t	2026-09-04 14:31:05.071917+00
524	1062650302	MARIA GABRIELA	CAMPOS MORALES	PENDIENTE POR REGISTRAR	316865505	\N	t	2026-09-04 14:31:05.085269+00
525	1062811073	YEINIS PAOLA	CARDENAS MONSALVO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.101406+00
526	1062811313	LEONARDO ANDRES	CASTILLEJO PEREZ	CLAUDIA ROSA PEREZ MARQUEZ	3103777082	\N	t	2026-09-04 14:31:05.11608+00
527	1119710646	JHOAN JOSE	COGOLLO DE LAS SALAS	PENDIENTE POR REGISTRAR	3157605157	\N	t	2026-09-04 14:31:05.130813+00
528	1067618715	SEBASTIAN ANDRES	CORONEL COTES	HEIDY COTES DIAZ	3167626634	\N	t	2026-09-04 14:31:05.143572+00
529	1066881993	DUVAN HERNANDO	COSTA ALMANZA	PENDIENTE POR REGISTRAR	3183838012	\N	t	2026-09-04 14:31:05.158498+00
530	1062811970	MAHIA LORENA	DIAZ JAIMES	LUZ ELENA DIAZ OYOLA	3128407045	\N	t	2026-09-04 14:31:05.172571+00
531	1066478382	EDGARDO SANTIAGO	FELIZOLA SIERRA	MARIA ISABEL SIERRA FRAGOZO	3205402141	\N	t	2026-09-04 14:31:05.187926+00
532	1137724057	JULIO CESAR	FIGUEROA RODRIGUEZ	PENDIENTE POR REGISTRAR	3182502690	\N	t	2026-09-04 14:31:05.204193+00
533	1062810523	SAMUEL ANDRES	GARCIA AVILA	DORA ISABEL AVILA MOLINA	3114376129	\N	t	2026-09-04 14:31:05.217116+00
534	1062611489	SERGIO ADRIAN	HERNANDEZ SANCHEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.229269+00
535	1062811052	JHORJINA	JACOME COGOLLO	PENDIENTE POR REGISTRAR	3157605157	\N	t	2026-09-04 14:31:05.23968+00
536	1062810494	JOHAIZA	LAGUNA MARTINEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.248876+00
537	1066287105	CARLOS ANDRES	LEYVA BRAVO	CARMEN BRAVO FURNIELES	3124537030	\N	t	2026-09-04 14:31:05.2595+00
538	1065654649	SANTIAGO	LOPEZ JIMENEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.268423+00
539	1116806929	GLEIVERSON JOHANDER	LOZANO ROJAS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.278063+00
540	1062811560	ADRIANA MARIA	MARTINEZ PEREZ	YUDITH PEREZ OSORIO	3154868297	\N	t	2026-09-04 14:31:05.288784+00
541	1065657247	ISAAC DAVID	MARTINEZ SUAREZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.300801+00
542	1062810466	MAIKEL	MARTINEZ SUAREZ	ARIKA PATRICIA SUAREZ MUÑOZ	3124537030	\N	t	2026-09-04 14:31:05.313004+00
543	1062811381	HAMIT JOHAN	MAZZIRI CHINCHILLA	YALEXIS LILIANA CHINCHILLA BARBOSA	3205697262	\N	t	2026-09-04 14:31:05.324258+00
544	1067617486	LAURA DANIELA	MOLINA AVILA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.335173+00
545	1062811095	ROMARIO ANDRES	MORALES PEREZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.345016+00
546	1062809943	JULIAN ESTEBAN	NANEZ AGUDELO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.356079+00
547	1062810874	VICTOR JULIO	OSORIO AVENDANO	MARGARITA SOFIA AVENDAÑO BVLANCO	3216708541	\N	t	2026-09-04 14:31:05.367045+00
548	1062811273	CARLOS MARIO	PAEZ DIAZ	JOHANA DEL CARMEN DIAZ BENAVIDEZ	3215673077	\N	t	2026-09-04 14:31:05.417141+00
549	1063563675	DALIANA MICHELL	PRADO LEON	PENDIENTE POR REGISTRAR	3216745782	\N	t	2026-09-04 14:31:05.429121+00
550	1085099329	ANDRES FELIPE	RAMOS MARTINEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.441248+00
551	1067616622	ROSA MARIA	RANGEL RODRIGUEZ	SHANELL RODRIGUEZ PARRA	3006341143	\N	t	2026-09-04 14:31:05.45566+00
552	1062810640	DARELA NORETH	ROMERO PALMERA	DIANA LUZ PALMERA VILLAR	3122739497	\N	t	2026-09-04 14:31:05.467577+00
553	1065204478	LUCIANA VALENTINA	SAURITH VELASQUEZ	PENDIENTE POR REGISTRAR	3195583418	\N	t	2026-09-04 14:31:05.478967+00
490	1065861910	NEYBIS ALEJANDRA	TINOCO VILLAN	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:04.613559+00
554	1062811274	SILVANA	TORO MOLINA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.566182+00
555	1062810658	VALERIA SOFIA	AMAYA SEGUANES	YULEINIS SEGUANES QUINTERO	3043960782	\N	t	2026-09-04 14:31:05.593911+00
556	1062811131	ELIZABETH TATIANA	AVENDANO MOLINA	PENDIENTE POR REGISTRAR	3145630441	\N	t	2026-09-04 14:31:05.617232+00
557	1063961452	SANDRITH MILENA	BALLESTERO MOSCOTE	PENDIENTE POR REGISTRAR	3126817907	\N	t	2026-09-04 14:31:05.640924+00
558	1062811207	YARITHZA ESTHER	BARRAZA MEJIA	YERIS BARRAZA MEJIA	3175641576	\N	t	2026-09-04 14:31:05.660184+00
559	9123	SHAIRA SOFIA	CAFIEL LINARES	1 1 1	SIN REGISTRO	\N	t	2026-09-04 14:31:05.684037+00
560	32	SARA INES	CARCAMO OLIVEROS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.700072+00
561	1062809330	SEBASTIAN ANDRES	CHIMA ARROYO	YARGELIS CHIMA ARROYO	SIN REGISTRO	\N	t	2026-09-04 14:31:05.713338+00
562	1065657291	KEIS ELIZABE	CORONEL ARROYO	PENDIENTE POR REGISTRAR	3143455590	\N	t	2026-09-04 14:31:05.730706+00
563	1064128274	ALEJANDRA VALENTINA	DE LA CRUZ ORTIZ	PENDIENTE POR REGISTRAR	3146292421	\N	t	2026-09-04 14:31:05.745806+00
564	1062809906	JAVIER DE JESUS	DELGADO CASTANEDA	DIANA CASTAÑEDA DIAZ	SIN REGISTRO	\N	t	2026-09-04 14:31:05.760372+00
565	1067728217	YULIANA MICHEL	ESTRADA ESCOBAR	PENDIENTE POR REGISTRAR	3147035714	\N	t	2026-09-04 14:31:05.775602+00
566	1064112544	JOSELIN NAILETH	FONTALVO BARRIOS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.787391+00
567	1100959873	JERSON STEBAN	GOMEZ ALFARO	PENDIENTE POR REGISTRAR	3235854695	\N	t	2026-09-04 14:31:05.801449+00
568	1031825636	MANUEL SANTIAGO	GOMEZ ALFARO	PENDIENTE POR REGISTRAR	3235854695	\N	t	2026-09-04 14:31:05.822203+00
569	1062810576	JOSE LEONARDO	GUZMAN CAREY	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:05.843168+00
570	1093434824	SAMUEL ALEJANDRO	LICONA SUAREZ	PENDIENTE POR REGISTRAR	3046500140	\N	t	2026-09-04 14:31:05.866839+00
571	1062812119	DAYANA MICHEL	MACHADO ARRIETA	VERONICA ARRIETA CERPA	3146592978	\N	t	2026-09-04 14:31:05.886949+00
572	1045308041	TALIANA MICHEEL	MARTINEZ PABON	PENDIENTE POR REGISTRAR	3127823609	\N	t	2026-09-04 14:31:05.909519+00
573	1062809914	MARIA ANGELA	MEJIA BARRERA	CLAUDIA LUZ BARRERA RESTREPO	3132890778	\N	t	2026-09-04 14:31:05.930867+00
574	1062810353	YEINER ANDRES	MERINO ORTIZ	PENDIENTE POR REGISTRAR	3225164135	\N	t	2026-09-04 14:31:05.952479+00
575	1062811008	ALEYKA SORIANA	MOLINA DELGADO	PENDIENTE POR REGISTRAR	3045518668	\N	t	2026-09-04 14:31:05.975002+00
576	1232391016	ROSBEILI YULIETH	MONTANEZ PACHECO	PENDIENTE POR REGISTRAR	3128274264	\N	t	2026-09-04 14:31:05.990195+00
577	1062809924	DYLAN DAHYAN	MORELO ALFARO	MARIA ISABEL MORELO ALFARO	3216215176	\N	t	2026-09-04 14:31:06.004594+00
578	1092183186	KEVIN DAVID	NAVARRO DURAN	PENDIENTE POR REGISTRAR	3148911798	\N	t	2026-09-04 14:31:06.019526+00
579	1066289432	JOSE MIGUEL	ORTIZ DIAZ	PENDIENTE POR REGISTRAR	3045653174	\N	t	2026-09-04 14:31:06.03246+00
580	1097784608	LUZ MARIANA	ORTIZ HENRIQUEZ	PENDIENTE POR REGISTRAR	3043442217	\N	t	2026-09-04 14:31:06.044391+00
581	1102856081	YOSELIN YULIETH	PADILLA BENITEZ	PENDIENTE POR REGISTRAR	3106784507	\N	t	2026-09-04 14:31:06.055184+00
582	1064795665	JESUS MANUEL	PADILLA MARTINEZ	PENDIENTE POR REGISTRAR	3217028097	\N	t	2026-09-04 14:31:06.065532+00
583	7532270	ELISMAR	QUINTERO GONZALEZ	PENDIENTE POR REGISTRAR	3216847773	\N	t	2026-09-04 14:31:06.074584+00
584	1062810258	KEVIN JOSE	ROBLES PALLARES	213213 32132132 113212	SIN REGISTRO	\N	t	2026-09-04 14:31:06.08596+00
585	1062810058	RICARDO ANDRES	ROJAS BARRAZA	PENDIENTE POR REGISTRAR	3233562873	\N	t	2026-09-04 14:31:06.094642+00
586	1062810739	STIVEN ANDRES	SILVA AMADO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.104133+00
587	1062812444	SHARITH TATIANA	SUAREZ AVILA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.112846+00
588	1062809844	GISETH CAROLINA	TARRA BAZA	LIZZETH PAZ MORENO	3045476043	\N	t	2026-09-04 14:31:06.12702+00
589	1090988216	YARLIN VANESA	TRILLOS SUAREZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.135533+00
590	330002356	FRANK STIVEN	BASTO MEZA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.144262+00
591	1126245636	NAPTHALY VALENTINA	CONTRERAS ALFARO	PENDIENTE POR REGISTRAR	3137184370	\N	t	2026-09-04 14:31:06.153621+00
592	1062809995	ESTEFANY GISEL	ACOSTA PEDROZO	EVELIS PEDROZO PEDROZO	3206699661	\N	t	2026-09-04 14:31:06.162976+00
593	1148140980	DIANA MARCELA	ACUNA MOLINA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.182039+00
594	1066352332	JHOAN SEBASTIAN	ALVAREZ DELGADO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.193849+00
595	1062810423	XAVIER	ALVAREZ MEDINA	PENDIENTE POR REGISTRAR	3122656122	\N	t	2026-09-04 14:31:06.205531+00
596	1067614959	LUNA SOFIA	ALVAREZ PINTO	PENDIENTE POR REGISTRAR	3128755788	\N	t	2026-09-04 14:31:06.216063+00
597	1066351080	JESUS DAVID	ARDILA CUELLO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.226537+00
598	1062810300	JADIS VALERIA	AVILA HERNANDEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.235662+00
599	1062809956	YACITH AMARITH	BARRETO BLANCO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.244223+00
600	1062810483	RAUL ANDRES	BOLANO MONSALVO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.253103+00
601	1062810628	ANGELA CAROLINA	CABALLERO SALDARRIAGA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.262665+00
602	1062810510	RAFAEL EDUARDO	CAMANO BENITEZ	ASTRID CAROLINA BENITEZ CAMARGO	3002308655	\N	t	2026-09-04 14:31:06.274409+00
603	1097786958	BALERY SOFIA	CELIS ORTIZ	PENDIENTE POR REGISTRAR	3153047658	\N	t	2026-09-04 14:31:06.283198+00
604	1062810106	SHAREY DAYANA	CUELLO ROMERO	PENDIENTE POR REGISTRAR	3112411996	\N	t	2026-09-04 14:31:06.293165+00
605	8191890	DARIANGEL CAROLINA	GARRIDO SEQUEDA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.301409+00
606	1119395561	YOJAN DAVID	GIL CONTRERAS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.311032+00
607	1062809714	ELISA YINETH	HERNANDEZ QUESADA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.321574+00
608	1062809826	MARIA ANGELA	JIMENEZ GAMARRA	OLGA PATRICIA GAMARRA DE MOYA	SIN REGISTRO	\N	t	2026-09-04 14:31:06.331723+00
609	1062809445	LUIS ALFREDO	LOPEZ OSPINO	MAIRA LOPEZ OSPINO	SIN REGISTRO	\N	t	2026-09-04 14:31:06.340266+00
610	1062809576	JOSE DAVID	MARQUEZ SUAREZ	YULIBETH SUAREZ CASTRO	3215376357	\N	t	2026-09-04 14:31:06.349123+00
611	1066606215	MARIA ALEJADRA	MARTINEZ RAMIREZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.359096+00
612	1065635973	LILIAN GRESHELL	MOLINA LOZANO	PENDIENTE POR REGISTRAR	3205732909	\N	t	2026-09-04 14:31:06.371394+00
613	1062808787	KEYLIN TATIANA	MORALES CASTANEDA	KATERINE CASTAÑEDA DIAZ	SIN REGISTRO	\N	t	2026-09-04 14:31:06.381045+00
614	1062809460	JORGE ISAAC	MORENO CAMPO	PENDIENTE POR REGISTRAR	3225961388	\N	t	2026-09-04 14:31:06.391656+00
615	1068385737	DEINER JOSE	MORENO ORTIZ	PENDIENTE POR REGISTRAR	3225164135	\N	t	2026-09-04 14:31:06.401675+00
616	1067604023	ADRIAN JOSE	ORTIZ DAVILA	PENDIENTE POR REGISTRAR	3185266357	\N	t	2026-09-04 14:31:06.409593+00
617	3316555	LUIS JHOANDERSON	OVIEDO CERVANTES	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.419748+00
618	1062810190	KAROLL SOFIA	PARRA MACHADO	PENDIENTE POR REGISTRAR	3137333816	\N	t	2026-09-04 14:31:06.428459+00
619	1062810616	SHAREM NATALY	PEREZ COTES	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.437837+00
620	1062810305	DANNA VALENTINA	QUINTERO OROZCO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.446975+00
621	1062810003	ANGHELIX	RAMOS MACHADO	ENITH ESTHER MEJIA BOJATO	3106651169	\N	t	2026-09-04 14:31:06.463644+00
622	1084742163	DIEGO ANDRES	AREVALO ALVARADO	PENDIENTE POR REGISTRAR	3004927791	\N	t	2026-09-04 14:31:06.47917+00
623	1062810398	SHAROL JULIANA	BALLESTERO CALLE	MARTHA CECILIA CALLE	3216528696	\N	t	2026-09-04 14:31:06.504116+00
624	1062808247	DIEGO ENRIQUE	BARRETO OROZCO	PENDIENTE POR REGISTRAR	3135054614	\N	t	2026-09-04 14:31:06.515165+00
625	1062808441	CELY BEATRIZ	BRAVO VASQUEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.529904+00
626	1062809533	MAUREN	COTES GOMEZ	MARIA FAUSTINA GOMEZ MEJIA	3182681995	\N	t	2026-09-04 14:31:06.552146+00
627	1065648692	YARINEL	CUEVAS GARCIA	PENDIENTE POR REGISTRAR	3167654561	\N	t	2026-09-04 14:31:06.576796+00
628	1067609529	ANDRES DAVID	CUJIA GAMEZ	PENDIENTE POR REGISTRAR	3178828890	\N	t	2026-09-04 14:31:06.593079+00
629	1062809777	RUSMARY	DE LA CRUZ RADA	YOMAIRA RADA ARRIETA	3218984008	\N	t	2026-09-04 14:31:06.609012+00
630	1062810414	LAUREN MARCELA	FLORES MUNOZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.630287+00
631	1067615356	MARIA VICTORIA	LARA RODRIGUEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.650104+00
632	1062811625	KEVIN JOSE	MARTINEZ USTARIZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.672062+00
633	1065995235	YARITHZA MILDRETH	MEYER ALMANZA	PENDIENTE POR REGISTRAR	3174309026	\N	t	2026-09-04 14:31:06.731978+00
634	1062808921	ANTHONY DAIR	MEZA GUERRERO	ESNELIS GUERRERO MONTERO	3177160002	\N	t	2026-09-04 14:31:06.754727+00
635	1062810061	ZAIRITH	MUNOZ BARRERA	PENDIENTE POR REGISTRAR	3104378287	\N	t	2026-09-04 14:31:06.775962+00
636	1066295404	CARLOS ANDRES	OBREGON GALINDO	PENDIENTE POR REGISTRAR	3235174849	\N	t	2026-09-04 14:31:06.797472+00
637	1067724081	LUIS DAVID	ORJUELA TAPIA	PENDIENTE POR REGISTRAR	3215413002	\N	t	2026-09-04 14:31:06.818855+00
638	1065649927	ANGIE SOFIA	OSPINO MARTINEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.844236+00
639	6171478	LEYDER JAVIER	PALOMINO GARCIA	PENDIENTE POR REGISTRAR	3162859968	\N	t	2026-09-04 14:31:06.889811+00
640	1062810015	LINDA STEFANY	PEREZ SERENO	IRIS LORENA SERENO IBARRA	3126096295	\N	t	2026-09-04 14:31:06.905246+00
641	1062809648	PAMILI SADAITH	RICO DIAZ	PENDIENTE POR REGISTRAR	3117317374	\N	t	2026-09-04 14:31:06.920691+00
642	1062809773	MAILETH ALEJANDRA	RIOS MENDOZA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.934288+00
643	1067610995	ANGEL DAVID	RODRIGUEZ TAPIAS	PENDIENTE POR REGISTRAR	3215413002	\N	t	2026-09-04 14:31:06.948521+00
644	1062808283	ANGEL JAFET	ROMERO MEJIA	ALFONSO RAFAEL ROMERO CASTRO	3107189002	\N	t	2026-09-04 14:31:06.962664+00
645	1043686699	SEBASTIAN DAVID	SALJA MARINO	PENDIENTE POR REGISTRAR	3012943730	\N	t	2026-09-04 14:31:06.973089+00
646	1062810285	JOSE DAVID	SIMANCA CONTRERAS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.986307+00
647	1062809696	SANTIAGO JOSE	SIMANCA MENDOZA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:06.995385+00
648	1062808575	EYLYN CAROLINA	SURMAY CAMACHO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.004681+00
649	1062809760	LUZ KARINA	TORRES MENDOZA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.014118+00
650	1062807250	KATERIN YULIETH	TROYA VILLERO	KATERIN TROYA	SIN REGISTRO	\N	t	2026-09-04 14:31:07.023263+00
651	1066289361	OMAR SANTIAGO	VEGA RODRIGUEZ	OMAR SANTIAGO BVEGA MONTANO	3218019621	\N	t	2026-09-04 14:31:07.031891+00
652	1028887367	JOSETH ESTIVEN	VESGA RAMOS	PENDIENTE POR REGISTRAR	3228756971	\N	t	2026-09-04 14:31:07.040401+00
653	1066285413	GABRIEL DAVID	ZEQUEIRA ARROYO	KEILA MARGARITA ARROYO MANOTAS	SIN REGISTRO	\N	t	2026-09-04 14:31:07.05059+00
654	1062810530	HAYMETH SOFIA	AMAYA MOLINA	PENDIENTE POR REGISTRAR	3225358536	\N	t	2026-09-04 14:31:07.058725+00
655	800251126012010	ADRIAN MIGUEL	ARENAS DIAZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.079237+00
656	33597805	EURIMAR COROMOTO	BRICENO ACOSTA	PENDIENTE POR REGISTRAR	3127828362	\N	t	2026-09-04 14:31:07.092529+00
657	1066289174	CARLOS ANDRES	BRITO BUDINO	PENDIENTE POR REGISTRAR	3105978501	\N	t	2026-09-04 14:31:07.102121+00
658	1067602880	JUAN DAVID	CANO ALMENDRALES	PENDIENTE POR REGISTRAR	3228756971	\N	t	2026-09-04 14:31:07.114741+00
659	1066351400	LUISA NERIETH	CANTILLO CAMPOS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.128444+00
660	1068385844	NEIDER JOSE	CANTILLO OSPINO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.137516+00
661	1062808806	ELIZETH ESTHER	CARRANZA ZAMORA	JUAN BAUTISTA CARRANZA MARTINEZ	SIN REGISTRO	\N	t	2026-09-04 14:31:07.165975+00
662	1063495779	LORIAYNIS CAROLAY	CARRASCAL BARRETO	PENDIENTE POR REGISTRAR	3112500120	\N	t	2026-09-04 14:31:07.176914+00
663	1067723823	MARIA ALEJANDRA	CASTELLANOS ARENGAS	YURBE ARENGAS ORTIZ	3113497491	\N	t	2026-09-04 14:31:07.188745+00
664	1062809946	KEILIN VALENTINA	CASTILLEJO RODRIGUEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.19922+00
665	1062934027	DANA LUCIA	CEBALLO GARCIA	PENDIENTE POR REGISTRAR	3232125246	\N	t	2026-09-04 14:31:07.208258+00
666	1062810114	WILSON JOSE	CORONEL BARRERA	PENDIENTE POR REGISTRAR	3135404358	\N	t	2026-09-04 14:31:07.218711+00
667	1043162997	SHARICK NATALIA	COTES NORIEGA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.229057+00
668	1083567037	SERGIO DANIEL	GARCIA LOPEZ	PENDIENTE POR REGISTRAR	3152817435	\N	t	2026-09-04 14:31:07.23976+00
669	1082249796	RAMIRO DE JESUS	GARCIA RODRIGUEZ	PENDIENTE POR REGISTRAR	3233471927	\N	t	2026-09-04 14:31:07.250918+00
670	330014777	ISRAEL ANTONIO	GUTIERREZ GARCIA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.260673+00
671	1065624321	EMMANUEL	HERNANDEZ FERREIRA	PENDIENTE POR REGISTRAR	3016965592	\N	t	2026-09-04 14:31:07.269256+00
672	1062808949	JOSE MIGUEL	HERRERA JIMENEZ	YULEINIS JIMENEZ JULIO	SIN REGISTRO	\N	t	2026-09-04 14:31:07.280074+00
673	1065997135	JHONATAN DAVID	MANGA SERRANO	LUIS RODRIGUEZ SANTIAGO	SIN REGISTRO	\N	t	2026-09-04 14:31:07.297965+00
674	1062810031	SARAY ESTHER	MOLINA RONDON	NEREIDA RONDON RAMOS	32155539554	\N	t	2026-09-04 14:31:07.308196+00
675	1063495387	MERLYS DANIELA	MONTOYA BERRIOS	PENDIENTE POR REGISTRAR	3113511587	\N	t	2026-09-04 14:31:07.318158+00
676	1062809688	LUISANA	NONTIEN LEON	PENDIENTE POR REGISTRAR	3157453993	\N	t	2026-09-04 14:31:07.326383+00
677	1066350771	YARLIS JULIETH	NUNEZ MARTINEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.33479+00
678	1054555853	KAREN SOFIA	PALACIO OCAMPO	PENDIENTE POR REGISTRAR	3116467259	\N	t	2026-09-04 14:31:07.343752+00
679	1065846805	JHONATAN JOSE	PALOMINO VASQUEZ	PENDIENTE POR REGISTRAR	3127654577	\N	t	2026-09-04 14:31:07.35264+00
680	1067617958	AYLEEN JULIANA	PAREJO VEGA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.360565+00
681	1067721195	EMANUEL ANDRES	RAMIREZ ORTIZ	PENDIENTE POR REGISTRAR	3166901373	\N	t	2026-09-04 14:31:07.368556+00
682	1062808822	ANDERSON	TATIS MEJIA	DEYBIS MEJIA GUERRERO	3106818288	\N	t	2026-09-04 14:31:07.377085+00
683	1082945025	ANNETH KAROLINA	TROCCOLI MORA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.388771+00
684	10676133746	MARIA LUISA	USTARIS SUAREZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.397366+00
685	1067608220	LYA MARGARITA	VARGAS RIVERA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.406164+00
686	1052702580	VALENTINA	VELAIDES SORACA	ODALIS ISABEL SORACA CORRALES	3233027662	\N	t	2026-09-04 14:31:07.416021+00
687	1066287135	VERONICA ISABEL	AGUIRRE ROCCO	PENDIENTE POR REGISTRAR	3148014956	\N	t	2026-09-04 14:31:07.424716+00
688	1128127407	MILAGROS MARIA	ALVAREZ JIMENEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.433374+00
689	1066877026	MARIA VALENTINA	ANAYA QUINONES	PENDIENTE POR REGISTRAR	3023435663	\N	t	2026-09-04 14:31:07.44307+00
690	1062807671	BRAYAN ORLANDO	APONTE ORTIZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.454334+00
691	1103505909	LAURA JUANA	ARAUJO MERCADO	CONSUELO DIAZ OYOLA	3148975526	\N	t	2026-09-04 14:31:07.469423+00
692	1064715812	DIANA MARCELA	BARRAZA MEJIA	YERIS BARRAZA MEJIA	SIN REGISTRO	\N	t	2026-09-04 14:31:07.489803+00
693	5280219	DAYANARA PAOLA	BRICENO ACOSTA	PENDIENTE POR REGISTRAR	3234673393	\N	t	2026-09-04 14:31:07.507209+00
694	1122407498	JESUS MANUEL	CALDERON ARIZA	LINDA MARY CALDERON MENDOZA	3043646294	\N	t	2026-09-04 14:31:07.526766+00
695	1062809347	SHARITH CAROLINA	CAMANO BENITEZ	TELMA BURGOS CANCHILA	3002308655	\N	t	2026-09-04 14:31:07.546194+00
696	1082951277	DYSNEL YANETH	CARDENAS CONTRERAS	PENDIENTE POR REGISTRAR	3024580510	\N	t	2026-09-04 14:31:07.567458+00
697	1065637587	ANDRES LEONARDO	CARVAJAL ROMERO	YEDIS MARCELA ROMERO PAEZ	3157185464	\N	t	2026-09-04 14:31:07.594817+00
698	1121329631	YERAMY NICOL	CORDOBA HIDALGO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.61297+00
699	1062808555	MELISA LINEI	CRUZ ACOSTA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.63058+00
700	1062807587	JHOINER DAVID	DE LA CRUZ MANGA	YOMAIRA RADA ARRIETA	3218984008	\N	t	2026-09-04 14:31:07.648738+00
701	3301927	ELOHE ISRAEL	ESCORCHE BRICENO	PENDIENTE POR REGISTRAR	3217165861	\N	t	2026-09-04 14:31:07.667151+00
702	1062809834	CRISTHIAN CAMILLO	GUZMAN BARRERA	YAKELIN BARRERA RESTREPO	3126448526	\N	t	2026-09-04 14:31:07.687411+00
703	1062810040	ELIANIS MICHEL	HERNANDEZ CERVANTES	ROSA CERVANTES RUIZ	3128340824	\N	t	2026-09-04 14:31:07.708349+00
704	1062806690	RHONALD ANDRES	HERNANDEZ OVIEDO	DORIS ARROYO SIERRA	3226768497	\N	t	2026-09-04 14:31:07.730525+00
705	1120744433	KAROL JULIETH	HERNANDEZ PACHECO	NORELIS PACHECO PINTO	3145558146	\N	t	2026-09-04 14:31:07.749368+00
706	1062808445	KEILER ALEXANDER	LEYVA VARGAS	LUZ MARY VARGAS VEGA	3106054585	\N	t	2026-09-04 14:31:07.770252+00
707	1062809413	LAURA DANIELA	MARTINEZ PEREZ	YUDITH PEREZ OSORIO	SIN REGISTRO	\N	t	2026-09-04 14:31:07.790268+00
708	1062809415	KAROL TALIANA	MIELES PONCE	GREIDYS PAOLA PONCE VALDERRAMA	SIN REGISTRO	\N	t	2026-09-04 14:31:07.81096+00
709	1065667667	MICHEL CAROLINA	NEGRETE CARDONA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.832544+00
710	1062807353	GABRIELA DE LOS ANGELES	OYAGA ORTIZ	GABRIELA OYAGA	SIN REGISTRO	\N	t	2026-09-04 14:31:07.851119+00
711	1064556346	VALENTINA MICHEL	PALMA NUNEZ	PENDIENTE POR REGISTRAR	3117823514	\N	t	2026-09-04 14:31:07.86879+00
712	1066285585	RAFAEL ENRIQUE	PALOMINO MOJICA	PENDIENTE POR REGISTRAR	3216939796	\N	t	2026-09-04 14:31:07.888201+00
713	1072366050	YOCER ARMANDO	PASSO PEREZ	YESENIA PEREZ SANDOVAL	3126552854	\N	t	2026-09-04 14:31:07.906108+00
714	1064112676	NIKOLL NAYELIS	REYES SIERRA	WILSON REYES QUINTANA	3205598470	\N	t	2026-09-04 14:31:07.924129+00
715	1062808839	SHARITH MARCELA	RODRIGUEZ BONILLA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:07.942632+00
716	1062807286	JAIR DAVID	SARMIENTO REYES	M M M M	SIN REGISTRO	\N	t	2026-09-04 14:31:07.963361+00
717	1062808116	MERLI YUCETH	TEHERAN MEJIA	PENDIENTE POR REGISTRAR	3106571997	\N	t	2026-09-04 14:31:07.982502+00
718	1062808860	ELVIA TALIANA	TOLEDO SANCHEZ	YORLEINIS PATRICIA SANCHEZ SUAREZ	3147678993	\N	t	2026-09-04 14:31:08.000272+00
719	1062809096	DANIELIS	AMARIS PALLARES	ELIA PALLARES MIER	SIN REGISTRO	\N	t	2026-09-04 14:31:08.019699+00
720	1062808662	SHARIT PAOLA	ARMENTA RAMOS	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.037265+00
721	1066874063	LAUREN SOFIA	BRUGES CASTANO	MARLE CASTAÑO	3185833900	\N	t	2026-09-04 14:31:08.058445+00
722	1068385845	WILSON DAVID	CANTILLO OSPINO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.08536+00
723	1066877963	SHAROLL JULIANA	CARPIO SANCHEZ	YELANIA SANCHEZ SUAREZ	3114165509	\N	t	2026-09-04 14:31:08.120237+00
724	1062809081	NICOLL STHEFANY	CARRILLO RESTREPO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.137506+00
725	1122814451	SHARITH YULIETH	CERVANTES DE LA CRUZ	PENDIENTE POR REGISTRAR	3159539186	\N	t	2026-09-04 14:31:08.156959+00
726	1062809317	YINA LICETH	DE LA CRUZ FLOREZ	66 6546	SIN REGISTRO	\N	t	2026-09-04 14:31:08.177142+00
727	1047048861	MAURELIS SHARAY	FERNANDEZ ROJAS	SARA FERNANDEZ ROJAS	SIN REGISTRO	\N	t	2026-09-04 14:31:08.194011+00
728	1067608034	KEREN SARAY	FIGUEROA RODRIGUEZ	PENDIENTE POR REGISTRAR	3182502690	\N	t	2026-09-04 14:31:08.208242+00
729	1065851953	KATTY MARIANA	GUERRA AVILA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.223495+00
730	1062807786	KENDRY VANESSA	JARAMILLO VERGARA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.233724+00
731	1062808540	KENER RAFAEL	JARAMILLO VERGARA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.242216+00
732	1062808048	ANDRES MAURICIO	LIMA BRICENO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.252769+00
733	1062808897	SHAROOL JULIANA	MEDINA MANJARREZ	LEONELA MANJARREZ MARTINEZ	SIN REGISTRO	\N	t	2026-09-04 14:31:08.260911+00
734	1062807138	JHOAN STEVEEN	MEJIA MARTINEZ	PENDIENTE POR REGISTRAR	3114025602	\N	t	2026-09-04 14:31:08.268592+00
735	1066286051	REYCHELL NALIETH	MEZA QUEZADA	NEVER MEZA MOGOLLON	SIN REGISTRO	\N	t	2026-09-04 14:31:08.279557+00
736	1062808030	NACERIN BALERIA	MORALES PABA	YURAINI PABA	3217723753	\N	t	2026-09-04 14:31:08.288712+00
737	1062809563	MARIA GABRIELA	NONTIEN ORTIZ	LINA PATRICIA ORTIZ BELLO	3234449037	\N	t	2026-09-04 14:31:08.297448+00
738	1065667228	ORIANA ALEJANDRA	ORTEGA OROZCO	PENDIENTE POR REGISTRAR	3135962275	\N	t	2026-09-04 14:31:08.307009+00
739	1062809143	CRISTINA ISABEL	PARRA CALDERON	ANIS MARIA CASTILLA CALDERON	3146378550	\N	t	2026-09-04 14:31:08.317775+00
740	1062808842	ELY SANTIAGO	PENALOZA VILLALOBOS	SULLY VILLALOBOS	3145240607	\N	t	2026-09-04 14:31:08.329541+00
741	1201216996	CAMILA	PINEDA GONZALEZ	PENDIENTE POR REGISTRAR	3126771185	\N	t	2026-09-04 14:31:08.338546+00
742	1062807924	ANDRES CAMILO	POLANCO MEZA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.347527+00
743	1062399571	LIZ PAOLA	RODRIGUEZ GUTIERREZ	PENDIENTE POR REGISTRAR	3157668168	\N	t	2026-09-04 14:31:08.356479+00
744	1068385670	DIANIS MARCELA	SAENZ LOPEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.364175+00
745	1093761380	RAUL DANILO	SUAREZ ALVAREZ	ALEIDO SUAREZ MARIN	SIN REGISTRO	\N	t	2026-09-04 14:31:08.373899+00
746	1062808962	MARIA JOSE	SUAREZ BELTRAN	ISABEL BELTRAN CONTRERAS	3137590170	\N	t	2026-09-04 14:31:08.384664+00
747	1176213218	MARIA CAMILA	SUAREZ HERNANDEZ	PENDIENTE POR REGISTRAR	3008035423	\N	t	2026-09-04 14:31:08.393229+00
748	1062809226	THALIANA JESSIE	VILLERO RIVERA	PENDIENTE POR REGISTRAR	3106210595	\N	t	2026-09-04 14:31:08.400843+00
749	1062808959	ALEJANDRO DE JESUS	ZUNIGA MARTINEZ	YEIMIS MARTINEZ MEDINA	3012944482	\N	t	2026-09-04 14:31:08.409303+00
750	1062807707	EMMANUEL TEODORO	ALVAREZ MEDINA	MANUELA MEDINA	SIN REGISTRO	\N	t	2026-09-04 14:31:08.418274+00
751	1062808872	MARIA BELEN	ALVAREZ MEDINA	SHIRLY MEDINA PIANETTA	31223561222	\N	t	2026-09-04 14:31:08.426936+00
752	1084738664	ISAAC DAVID	AREVALO ALVARADO	PENDIENTE POR REGISTRAR	3042430115	\N	t	2026-09-04 14:31:08.434916+00
753	1062808608	SHARITH SOFIA	ARGOTE LARA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.4447+00
754	1062809225	SANTIAGO ANDRES	BARRIOS CARCAMO	SERGIO BARRIOS MUÑOZ	SIN REGISTRO	\N	t	2026-09-04 14:31:08.457609+00
755	1062807666	KAROL DAYANA	CALLE BARRAGAN	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.479982+00
756	1066286568	MARIAN MICHEL	CASTRO GALVAN	NAYARITH GALVAN SUAREZ	SIN REGISTRO	\N	t	2026-09-04 14:31:08.492834+00
757	1062808000	EILYN DAYIRCA	CONTRERAS HERNANDEZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.502654+00
758	1065638430	SAMUEL DAVID	CONTRERAS MENDOZA	PENDIENTE POR REGISTRAR	3107227133	\N	t	2026-09-04 14:31:08.510319+00
759	1062806384	SHAYLA ANDREA	CUELLO ROMERO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.522425+00
760	1067813202	DAISI DANIELA	DAVILA MENDEZ	PENDIENTE POR REGISTRAR	3153612076	\N	t	2026-09-04 14:31:08.532202+00
761	1067607307	JENIFER LICETH	ESCORCIA PEREZ	PENDIENTE POR REGISTRAR	3024636020	\N	t	2026-09-04 14:31:08.541834+00
762	1066878329	IVAN ANTONIO	FLORIAN PARRA	ANTONIO FLORIAN RAMO	SIN REGISTRO	\N	t	2026-09-04 14:31:08.554006+00
763	1062808134	VERONICA MICHEL	FORERO CAMARGO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.565499+00
764	1062807337	DANIEL JOSUE	GAMEZ BELENO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.574914+00
765	1067610864	CAROLINA ANDREA	GARCIA HERNANDEZ	RAFAEL GARCIA GUERRA	3113974454	\N	t	2026-09-04 14:31:08.61683+00
766	1062807271	JEAN FRANCO	HERNANDEZ MOLINA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.63715+00
767	1120099031	LIZETH DAYANA	MEJIA AGUIRRE	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.659186+00
768	1066286189	CAMILO	MEZA CASTILLA	CASTILLA MARIA	SIN REGISTRO	\N	t	2026-09-04 14:31:08.682251+00
769	1049932523	BRAYAN DAVID	MORENO ALCAZAR	PENDIENTE POR REGISTRAR	3224642605	\N	t	2026-09-04 14:31:08.703537+00
770	1067607495	DINA LUZ	MORENO CARDENAS	DORALBA INES CARDENAS HERNANDEZ	3148245545	\N	t	2026-09-04 14:31:08.725057+00
771	1064715498	SHOREILLYS DANIELA	ORTIZ RUIDIAZ	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.744245+00
772	1062808763	JADER ENRIQUE	OYOLA PARRA	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.760804+00
773	1062810072	VALERIA SOFIA	PADILLA TARRA	JOSE ANTONIO PADILLA CORTES	3215073890	\N	t	2026-09-04 14:31:08.776709+00
774	1081809534	VALERY YANETH	PALACIN CENTENO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.792038+00
775	1065625013	DELIA NICOLL	PARRA NAVARRO	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.809304+00
776	1062808484	EDUARDO JOSE	PINERES CORTES	LLAMIN PIÑPERES BOLIVAR	3114248827	\N	t	2026-09-04 14:31:08.827762+00
777	1062809599	KAMELIN YARIT	QUIROZ REAL	PENDIENTE POR REGISTRAR	SIN REGISTRO	\N	t	2026-09-04 14:31:08.842563+00
778	1066286017	LUIS SANTIAGO	REYES ESPEJO	PENDIENTE POR REGISTRAR	3216375040	\N	t	2026-09-04 14:31:08.85956+00
779	1052701736	BRANDON	VELAIDES SORACA	ODALIS SORACA CORRALES	3233027662	\N	t	2026-09-04 14:31:08.879303+00
780	1005554443	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-04 15:48:52.190154+00
781	DOC_TEST_EDIT_2	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-04 15:48:52.636478+00
782	DOC_EXISTENTE_UNICO	Existente	Uno	\N	\N	\N	t	2026-09-04 15:48:56.040301+00
783	DOC_TEST_EDIT_3	Otro	Dos	\N	\N	\N	t	2026-09-04 15:48:56.050154+00
784	DOC_TEST_EDIT_1	Pepito	Perez	Acudiente Inicial	3101112233	\N	t	2026-09-04 16:01:28.423961+00
787	DOC_FIN_780046048231200	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-04 16:02:37.897088+00
788	DOC_TEL_780046418287200	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-04 16:02:38.225358+00
789	DOC_EX_780050108244400	Existente	Uno	\N	\N	\N	t	2026-09-04 16:02:41.91575+00
790	DOC_OT_780050108478500	Otro	Dos	\N	\N	\N	t	2026-09-04 16:02:41.930813+00
791	DOC_INC_795549086117400	Estudiante	Prueba 7400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:20:56.625006+00
792	DOC_INC_795549865184000	Estudiante	Prueba 4000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:20:57.402487+00
793	DOC_INC_795550557966100	Estudiante	Prueba 6100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:20:58.095594+00
794	DOC_INC_795550925003600	Estudiante	Prueba 3600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:20:58.462743+00
795	DOC_INC_795550960169700	Estudiante	Prueba 9700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:20:58.498648+00
796	DOC_INC_795550990365600	Estudiante	Prueba 5600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:20:58.528305+00
797	DOC_INC_795551317303100	Estudiante	Prueba 3100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:20:58.854767+00
798	DOC_FIN_795551694852600	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-04 20:20:59.232174+00
799	DOC_TEL_795551994723100	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-04 20:20:59.532671+00
800	DOC_EX_795556793966900	Existente	Uno	\N	\N	\N	t	2026-09-04 20:21:04.331731+00
801	DOC_OT_795556794168700	Otro	Dos	\N	\N	\N	t	2026-09-04 20:21:04.359822+00
802	DOC_INC_795640271908500	Estudiante	Prueba 8500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:22:27.842151+00
803	DOC_INC_795641387486600	Estudiante	Prueba 6600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:22:28.925268+00
804	DOC_INC_795641742536700	Estudiante	Prueba 6700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:22:29.279894+00
805	DOC_INC_795642050017900	Estudiante	Prueba 7900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:22:29.587621+00
806	DOC_INC_795642076657100	Estudiante	Prueba 7100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:22:29.614229+00
807	DOC_INC_795642097848900	Estudiante	Prueba 8900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:22:29.635354+00
808	DOC_INC_795642375000100	Estudiante	Prueba 0100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:22:29.912692+00
809	DOC_INC_795675998097500	Estudiante	Prueba 7500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:23:03.568704+00
810	DOC_INC_795676589445000	Estudiante	Prueba 5000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:23:04.126923+00
811	DOC_INC_795676924300200	Estudiante	Prueba 0200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:23:04.461809+00
812	DOC_INC_795677166298400	Estudiante	Prueba 8400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:23:04.704034+00
813	DOC_INC_795677181782800	Estudiante	Prueba 2800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:23:04.719269+00
814	DOC_INC_795677215390100	Estudiante	Prueba 0100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:23:04.752746+00
815	DOC_INC_795677452320700	Estudiante	Prueba 0700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-04 20:23:04.989739+00
816	DOC_FIN_795677684043900	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-04 20:23:05.221458+00
817	DOC_TEL_795677844883600	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-04 20:23:05.382438+00
818	DOC_EX_795681225574900	Existente	Uno	\N	\N	\N	t	2026-09-04 20:23:08.76315+00
819	DOC_OT_795681225732900	Otro	Dos	\N	\N	\N	t	2026-09-04 20:23:08.790044+00
820	DOC_INC_823065962543400	Estudiante	Prueba 3400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 03:59:34.800888+00
821	DOC_INC_823066867927100	Estudiante	Prueba 7100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 03:59:35.679933+00
822	DOC_INC_823067299852600	Estudiante	Prueba 2600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 03:59:36.111294+00
823	DOC_INC_823067548117400	Estudiante	Prueba 7400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 03:59:36.359852+00
824	DOC_INC_823067566831000	Estudiante	Prueba 1000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 03:59:36.378904+00
825	DOC_INC_823067584285100	Estudiante	Prueba 5100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 03:59:36.395895+00
826	DOC_INC_823067835121700	Estudiante	Prueba 1700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 03:59:36.646896+00
827	DOC_FIN_823068083725700	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 03:59:36.895998+00
828	DOC_TEL_823068236931800	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 03:59:37.048412+00
829	DOC_EX_823071878674300	Existente	Uno	\N	\N	\N	t	2026-09-05 03:59:40.690108+00
830	DOC_OT_823071878851900	Otro	Dos	\N	\N	\N	t	2026-09-05 03:59:40.700788+00
831	DOC_INC_824392949891900	Estudiante	Prueba 1900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:21:41.803484+00
832	DOC_INC_824393648466200	Estudiante	Prueba 6200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:21:42.460088+00
833	DOC_INC_824394484269400	Estudiante	Prueba 9400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:21:43.29602+00
834	DOC_INC_824394938698800	Estudiante	Prueba 8800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:21:43.75038+00
835	DOC_INC_824395150249500	Estudiante	Prueba 9500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:21:43.961222+00
836	DOC_INC_824395179410000	Estudiante	Prueba 0000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:21:43.990857+00
837	DOC_INC_824395194948700	Estudiante	Prueba 8700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:21:44.005614+00
838	DOC_INC_824395391381500	Estudiante	Prueba 1500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:21:44.202868+00
839	DOC_FIN_824395590621100	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 04:21:44.402111+00
840	DOC_TEL_824395714175000	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 04:21:44.525467+00
841	DOC_EX_824399378879300	Existente	Uno	\N	\N	\N	t	2026-09-05 04:21:48.191189+00
842	DOC_OT_824399379076300	Otro	Dos	\N	\N	\N	t	2026-09-05 04:21:48.200406+00
843	DOC_INC_825738494600200	Estudiante	Prueba 0200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:44:07.343298+00
844	DOC_INC_825739171757500	Estudiante	Prueba 7500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:44:07.982983+00
845	DOC_INC_825739927625900	Estudiante	Prueba 5900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:44:08.739149+00
846	DOC_INC_825740347539400	Estudiante	Prueba 9400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:44:09.158806+00
847	DOC_INC_825740577540600	Estudiante	Prueba 0600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:44:09.389125+00
848	DOC_INC_825740599852800	Estudiante	Prueba 2800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:44:09.411392+00
849	DOC_INC_825740617514800	Estudiante	Prueba 4800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:44:09.428481+00
850	DOC_INC_825740896811700	Estudiante	Prueba 1700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:44:09.708116+00
851	DOC_INC_825794141767200	Estudiante	Prueba 7200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:45:02.97862+00
852	DOC_INC_825794659807300	Estudiante	Prueba 7300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:45:03.471431+00
853	DOC_INC_825795355173400	Estudiante	Prueba 3400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:45:04.166313+00
854	DOC_INC_825795776401300	Estudiante	Prueba 1300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:45:04.587823+00
855	DOC_INC_825796024108500	Estudiante	Prueba 8500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:45:04.836619+00
856	DOC_INC_825796062114700	Estudiante	Prueba 4700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:45:04.873485+00
857	DOC_INC_825796080455700	Estudiante	Prueba 5700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:45:04.892063+00
858	DOC_INC_825796280267300	Estudiante	Prueba 7300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:45:05.091474+00
859	DOC_FIN_825796508183800	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 04:45:05.319648+00
860	DOC_TEL_825796692856400	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 04:45:05.504861+00
861	DOC_EX_825800317744200	Existente	Uno	\N	\N	\N	t	2026-09-05 04:45:09.129636+00
862	DOC_OT_825800317916600	Otro	Dos	\N	\N	\N	t	2026-09-05 04:45:09.143506+00
863	EXP_1788583510156	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 04:45:10.158432+00
864	DOC_INC_825852821182500	Estudiante	Prueba 2500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:46:01.675617+00
865	DOC_INC_825853478024200	Estudiante	Prueba 4200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:46:02.28962+00
866	DOC_INC_825854155450900	Estudiante	Prueba 0900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:46:02.966697+00
867	DOC_INC_825854602483200	Estudiante	Prueba 3200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:46:03.414607+00
868	DOC_INC_825854909646600	Estudiante	Prueba 6600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:46:03.721067+00
869	DOC_INC_825854953229000	Estudiante	Prueba 9000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:46:03.764869+00
870	DOC_INC_825854977452600	Estudiante	Prueba 2600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:46:03.78903+00
871	DOC_INC_825855210196300	Estudiante	Prueba 6300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 04:46:04.021704+00
872	DOC_FIN_825855469739900	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 04:46:04.281267+00
873	DOC_TEL_825855614893800	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 04:46:04.426507+00
874	DOC_EX_825858969922700	Existente	Uno	\N	\N	\N	t	2026-09-05 04:46:07.781115+00
875	DOC_OT_825858970145100	Otro	Dos	\N	\N	\N	t	2026-09-05 04:46:07.856013+00
876	EXP_1788583568905	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 04:46:08.907202+00
877	DOC_INC_826693001734700	Estudiante	Prueba 4700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:00:01.850526+00
878	DOC_INC_826693452496800	Estudiante	Prueba 6800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:00:02.264033+00
879	DOC_INC_826694329701200	Estudiante	Prueba 1200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:00:03.139969+00
880	DOC_INC_826694722100000	Estudiante	Prueba 0000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:00:03.533928+00
881	DOC_INC_826694961627900	Estudiante	Prueba 7900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:00:03.772901+00
882	DOC_INC_826694993870900	Estudiante	Prueba 0900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:00:03.805828+00
883	DOC_INC_826695014756900	Estudiante	Prueba 6900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:00:03.826265+00
884	DOC_INC_826695231247900	Estudiante	Prueba 7900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:00:04.042289+00
885	DOC_FIN_826695435842600	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 05:00:04.247552+00
886	DOC_TEL_826695646221100	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 05:00:04.458295+00
887	DOC_EX_826699357358800	Existente	Uno	\N	\N	\N	t	2026-09-05 05:00:08.169457+00
888	DOC_OT_826699357542300	Otro	Dos	\N	\N	\N	t	2026-09-05 05:00:08.179325+00
889	EXP_1788584409094	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 05:00:09.096659+00
890	DOC_INC_828578787925300	Estudiante	Prueba 5300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:31:27.625651+00
891	DOC_INC_828579007299500	Estudiante	Prueba 9500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:31:27.818617+00
892	DOC_INC_828579374005400	Estudiante	Prueba 5400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:31:28.184976+00
893	DOC_INC_828579541720400	Estudiante	Prueba 0400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:31:28.352879+00
894	DOC_INC_828579634068000	Estudiante	Prueba 8000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:31:28.445142+00
895	DOC_INC_828579642710600	Estudiante	Prueba 0600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:31:28.453565+00
896	DOC_INC_828579669698300	Estudiante	Prueba 8300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:31:28.480484+00
897	DOC_INC_828579763015600	Estudiante	Prueba 5600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:31:28.574212+00
898	DOC_FIN_828579886279000	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 05:31:28.697301+00
899	DOC_TEL_828579964535500	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 05:31:28.775548+00
900	DOC_EX_828582177103500	Existente	Uno	\N	\N	\N	t	2026-09-05 05:31:30.989292+00
901	DOC_OT_828582177323100	Otro	Dos	\N	\N	\N	t	2026-09-05 05:31:30.998914+00
902	EXP_1788586291612	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 05:31:31.613875+00
903	DOC_INC_830195019352400	Estudiante	Prueba 2400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:58:23.866072+00
904	DOC_INC_830195356444900	Estudiante	Prueba 4900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:58:24.167701+00
905	DOC_INC_830195589629400	Estudiante	Prueba 9400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:58:24.400254+00
906	DOC_INC_830195786396000	Estudiante	Prueba 6000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:58:24.597504+00
907	DOC_INC_830195853923700	Estudiante	Prueba 3700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:58:24.665558+00
908	DOC_INC_830195885343800	Estudiante	Prueba 3800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:58:24.696729+00
909	DOC_INC_830195899239800	Estudiante	Prueba 9800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:58:24.710285+00
910	DOC_INC_830195975614300	Estudiante	Prueba 4300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:58:24.787651+00
911	DOC_FIN_830196137892100	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 05:58:24.950171+00
912	DOC_TEL_830196348671000	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 05:58:25.159983+00
913	DOC_EX_830198960205300	Existente	Uno	\N	\N	\N	t	2026-09-05 05:58:27.771594+00
914	DOC_OT_830198960292400	Otro	Dos	\N	\N	\N	t	2026-09-05 05:58:27.779261+00
915	EXP_1788587908291	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 05:58:28.29172+00
916	DOC_INC_830256221193300	Estudiante	Prueba 3300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:59:25.049845+00
917	DOC_INC_830256805640000	Estudiante	Prueba 0000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:59:25.616611+00
918	DOC_INC_830257365778500	Estudiante	Prueba 8500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:59:26.177514+00
919	DOC_INC_830257675043000	Estudiante	Prueba 3000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:59:26.486209+00
920	DOC_INC_830257857189200	Estudiante	Prueba 9200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:59:26.669635+00
921	DOC_INC_830257910459000	Estudiante	Prueba 9000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:59:26.722111+00
922	DOC_INC_830257925557300	Estudiante	Prueba 7300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:59:26.736875+00
923	DOC_INC_830258098198200	Estudiante	Prueba 8200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 05:59:26.909917+00
924	DOC_INC_830294367629200	Estudiante	Prueba 9200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 06:00:03.217061+00
925	DOC_INC_830294614232700	Estudiante	Prueba 2700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 06:00:03.425368+00
926	DOC_INC_830295233104800	Estudiante	Prueba 4800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 06:00:04.04427+00
927	DOC_INC_830295492604400	Estudiante	Prueba 4400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 06:00:04.303871+00
928	DOC_INC_830295656947900	Estudiante	Prueba 7900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 06:00:04.468983+00
929	DOC_INC_830295677197000	Estudiante	Prueba 7000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 06:00:04.488735+00
930	DOC_INC_830295694445200	Estudiante	Prueba 5200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 06:00:04.505908+00
931	DOC_INC_830295853633300	Estudiante	Prueba 3300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 06:00:04.665422+00
932	DOC_FIN_830296015504500	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 06:00:04.827041+00
933	DOC_TEL_830296108269300	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 06:00:04.919656+00
934	DOC_EX_830298617048700	Existente	Uno	\N	\N	\N	t	2026-09-05 06:00:07.428861+00
935	DOC_OT_830298617193900	Otro	Dos	\N	\N	\N	t	2026-09-05 06:00:07.43735+00
936	EXP_1788588007987	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 06:00:07.988359+00
937	DOC_INC_851655595787600	Estudiante	Prueba 7600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 11:55:59.818045+00
938	DOC_INC_851655957324900	Estudiante	Prueba 4900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 11:56:00.134759+00
939	DOC_INC_851656560155000	Estudiante	Prueba 5000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 11:56:00.737276+00
940	DOC_INC_851656821609700	Estudiante	Prueba 9700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 11:56:00.999084+00
941	DOC_INC_851656973203900	Estudiante	Prueba 3900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 11:56:01.150726+00
942	DOC_INC_851657014804200	Estudiante	Prueba 4200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 11:56:01.1925+00
943	DOC_INC_851657028004300	Estudiante	Prueba 4300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 11:56:01.205113+00
944	DOC_INC_851657147724900	Estudiante	Prueba 4900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 11:56:01.3254+00
945	DOC_FIN_851657316221600	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 11:56:01.493861+00
946	DOC_TEL_851657401436100	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 11:56:01.578732+00
947	DOC_EX_851660724863500	Existente	Uno	\N	\N	\N	t	2026-09-05 11:56:04.902627+00
948	DOC_OT_851660725015200	Otro	Dos	\N	\N	\N	t	2026-09-05 11:56:04.965496+00
949	EXP_1788609366078	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 11:56:06.080087+00
950	DOC_INC_853259644924700	Estudiante	Prueba 4700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:22:43.868121+00
951	DOC_INC_853260017056200	Estudiante	Prueba 6200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:22:44.194553+00
952	DOC_INC_853260695906100	Estudiante	Prueba 6100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:22:44.873154+00
953	DOC_INC_853261244675400	Estudiante	Prueba 5400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:22:45.422317+00
954	DOC_INC_853261454043700	Estudiante	Prueba 3700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:22:45.632427+00
955	DOC_INC_853261474998800	Estudiante	Prueba 8800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:22:45.6527+00
956	DOC_INC_853261491653000	Estudiante	Prueba 3000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:22:45.668642+00
957	DOC_INC_853261619904900	Estudiante	Prueba 4900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:22:45.797526+00
958	DOC_FIN_853261799139000	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 12:22:45.976398+00
959	DOC_TEL_853261932934000	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 12:22:46.110601+00
960	DOC_EX_853264834676000	Existente	Uno	\N	\N	\N	t	2026-09-05 12:22:49.012373+00
961	DOC_OT_853264834936900	Otro	Dos	\N	\N	\N	t	2026-09-05 12:22:49.037101+00
962	EXP_1788610969903	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 12:22:49.904404+00
963	DOC_INC_853517952514900	Estudiante	Prueba 4900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:02.164424+00
964	DOC_INC_853518211092100	Estudiante	Prueba 2100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:02.388271+00
965	DOC_INC_853518858747500	Estudiante	Prueba 7500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:03.03587+00
966	DOC_INC_853519040527400	Estudiante	Prueba 7400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:03.217515+00
967	DOC_INC_853519388401800	Estudiante	Prueba 1800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:03.565621+00
968	DOC_INC_853519425139600	Estudiante	Prueba 9600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:03.602379+00
969	DOC_INC_853519438992200	Estudiante	Prueba 2200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:03.615949+00
970	DOC_INC_853519561319200	Estudiante	Prueba 9200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:03.739063+00
971	DOC_INC_853519681462000	Estudiante	Prueba 2000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:03.85935+00
972	DOC_FIN_853519848221300	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 12:27:04.025567+00
973	DOC_TEL_853519943643400	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 12:27:04.121451+00
974	DOC_EX_853522073239600	Existente	Uno	\N	\N	\N	t	2026-09-05 12:27:06.250519+00
975	DOC_OT_853522073332400	Otro	Dos	\N	\N	\N	t	2026-09-05 12:27:06.259348+00
976	EXP_1788611226743	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 12:27:06.744578+00
977	DOC_INC_853570028792900	Estudiante	Prueba 2900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:54.236751+00
978	DOC_INC_853570260456900	Estudiante	Prueba 6900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:54.437582+00
979	DOC_INC_853570824062600	Estudiante	Prueba 2600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:55.001043+00
980	DOC_INC_853571028245300	Estudiante	Prueba 5300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:55.205733+00
981	DOC_INC_853571259738100	Estudiante	Prueba 8100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:55.437378+00
982	DOC_INC_853571400327700	Estudiante	Prueba 7700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:55.57755+00
983	DOC_INC_853571413841600	Estudiante	Prueba 1600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:55.591014+00
984	DOC_INC_853571425850600	Estudiante	Prueba 0600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:55.602869+00
985	DOC_INC_853571560116900	Estudiante	Prueba 6900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:55.737965+00
986	DOC_INC_853571652894200	Estudiante	Prueba 4200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 12:27:55.830129+00
987	DOC_FIN_853571832290800	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 12:27:56.009884+00
988	DOC_TEL_853571906888500	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 12:27:56.084012+00
989	DOC_EX_853573896635600	Existente	Uno	\N	\N	\N	t	2026-09-05 12:27:58.074085+00
990	DOC_OT_853573896728400	Otro	Dos	\N	\N	\N	t	2026-09-05 12:27:58.079631+00
991	EXP_1788611278545	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 12:27:58.547158+00
992	DOC_INC_879816836558400	Estudiante	Prueba 8400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 19:45:20.594046+00
993	DOC_INC_879817208098000	Estudiante	Prueba 8000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 19:45:20.907093+00
994	DOC_INC_879817948209100	Estudiante	Prueba 9100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 19:45:21.646389+00
995	DOC_INC_879818154543300	Estudiante	Prueba 3300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 19:45:21.853624+00
996	DOC_INC_879818435312500	Estudiante	Prueba 2500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 19:45:22.133867+00
997	DOC_INC_879818579263500	Estudiante	Prueba 3500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 19:45:22.278485+00
998	DOC_INC_879818596542000	Estudiante	Prueba 2000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 19:45:22.297034+00
999	DOC_INC_879818614683200	Estudiante	Prueba 3200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 19:45:22.313312+00
1000	DOC_INC_879818756797700	Estudiante	Prueba 7700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 19:45:22.455746+00
1001	DOC_INC_879818877494400	Estudiante	Prueba 4400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 19:45:22.575899+00
1002	DOC_FIN_879819088966500	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 19:45:22.788357+00
1003	DOC_TEL_879819190278500	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 19:45:22.889092+00
1004	DOC_EX_879822089077100	Existente	Uno	\N	\N	\N	t	2026-09-05 19:45:25.788068+00
1005	DOC_OT_879822089196900	Otro	Dos	\N	\N	\N	t	2026-09-05 19:45:25.795792+00
1006	EXP_1788637526377	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 19:45:26.377628+00
1007	DOC_INC_880966152030200	Estudiante	Prueba 0200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:04:29.900317+00
1008	DOC_INC_880966695508500	Estudiante	Prueba 8500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:04:30.394627+00
1009	DOC_INC_880968137587000	Estudiante	Prueba 7000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:04:31.836546+00
1010	DOC_INC_880968690741600	Estudiante	Prueba 1600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:04:32.390119+00
1011	DOC_INC_880969281053800	Estudiante	Prueba 3800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:04:32.980676+00
1012	DOC_INC_880969604576700	Estudiante	Prueba 6700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:04:33.303628+00
1013	DOC_INC_880969637710400	Estudiante	Prueba 0400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:04:33.336953+00
1014	DOC_INC_880969660213700	Estudiante	Prueba 3700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:04:33.359881+00
1015	DOC_INC_880969872906000	Estudiante	Prueba 6000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:04:33.571871+00
1016	DOC_INC_880970055256500	Estudiante	Prueba 6500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:04:33.754829+00
1017	DOC_FIN_880970393934500	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 20:04:34.093498+00
1018	DOC_TEL_880970576781300	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 20:04:34.276061+00
1019	DOC_EX_880974953462200	Existente	Uno	\N	\N	\N	t	2026-09-05 20:04:38.652849+00
1020	DOC_OT_880974953604400	Otro	Dos	\N	\N	\N	t	2026-09-05 20:04:38.664102+00
1021	EXP_1788638679399	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 20:04:39.401056+00
1022	DOC_INC_881710443324600	Estudiante	Prueba 4600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:16:54.180949+00
1023	DOC_INC_881710852332600	Estudiante	Prueba 2600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:16:54.551771+00
1024	DOC_INC_881711606903200	Estudiante	Prueba 3200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:16:55.305813+00
1025	DOC_INC_881711954879600	Estudiante	Prueba 9600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:16:55.653796+00
1026	DOC_INC_881712592003200	Estudiante	Prueba 3200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:16:56.291749+00
1027	DOC_INC_881712926466400	Estudiante	Prueba 6400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:16:56.625414+00
1028	DOC_INC_881712956800600	Estudiante	Prueba 0600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:16:56.655268+00
1029	DOC_INC_881712977532300	Estudiante	Prueba 2300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:16:56.676965+00
1030	DOC_INC_881713262941600	Estudiante	Prueba 1600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:16:56.962381+00
1031	DOC_INC_881713458398500	Estudiante	Prueba 8500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:16:57.157247+00
1032	DOC_FIN_881713748616400	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 20:16:57.447896+00
1033	DOC_TEL_881713911704500	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 20:16:57.611267+00
1034	DOC_EX_881717982553700	Existente	Uno	\N	\N	\N	t	2026-09-05 20:17:01.682501+00
1035	DOC_OT_881717982698400	Otro	Dos	\N	\N	\N	t	2026-09-05 20:17:01.698504+00
1036	EXP_1788639422740	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 20:17:02.742374+00
1037	DOC_INC_881888382443300	Estudiante	Prueba 3300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:19:52.125973+00
1038	DOC_INC_881888761106400	Estudiante	Prueba 6400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:19:52.460631+00
1039	DOC_INC_881889496137000	Estudiante	Prueba 7000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:19:53.195484+00
1040	DOC_INC_881889820251500	Estudiante	Prueba 1500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:19:53.519607+00
1041	DOC_INC_881890295173600	Estudiante	Prueba 3600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:19:53.994944+00
1042	DOC_INC_881890488099800	Estudiante	Prueba 9800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:19:54.187189+00
1043	DOC_INC_881890505022200	Estudiante	Prueba 2200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:19:54.203926+00
1044	DOC_INC_881890519481200	Estudiante	Prueba 1200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:19:54.218306+00
1045	DOC_INC_881890703983500	Estudiante	Prueba 3500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:19:54.402935+00
1046	DOC_INC_881890841441000	Estudiante	Prueba 1000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:19:54.540226+00
1047	DOC_FIN_881891054921800	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 20:19:54.754523+00
1048	DOC_TEL_881891194121400	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 20:19:54.893379+00
1049	DOC_EX_881894817069800	Existente	Uno	\N	\N	\N	t	2026-09-05 20:19:58.516961+00
1050	DOC_OT_881894817225600	Otro	Dos	\N	\N	\N	t	2026-09-05 20:19:58.570428+00
1051	EXP_1788639599510	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 20:19:59.511257+00
1052	DOC_INC_882545613915300	Estudiante	Prueba 5300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:30:49.314729+00
1053	DOC_INC_882545902917900	Estudiante	Prueba 7900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:30:49.602896+00
1054	DOC_INC_882546788327100	Estudiante	Prueba 7100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:30:50.487399+00
1055	DOC_INC_882547122711700	Estudiante	Prueba 1700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:30:50.821612+00
1056	DOC_INC_882547571638000	Estudiante	Prueba 8000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:30:51.270881+00
1057	DOC_INC_882547815240000	Estudiante	Prueba 0000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:30:51.514169+00
1058	DOC_INC_882547831149100	Estudiante	Prueba 9100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:30:51.531371+00
1059	DOC_INC_882547849941900	Estudiante	Prueba 1900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:30:51.548652+00
1060	DOC_INC_882548035517300	Estudiante	Prueba 7300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:30:51.734343+00
1061	DOC_INC_882548223885900	Estudiante	Prueba 5900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:30:51.923084+00
1062	DOC_FIN_882548479464300	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 20:30:52.178756+00
1063	DOC_TEL_882548632193500	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 20:30:52.33204+00
1064	DOC_EX_882552343308200	Existente	Uno	\N	\N	\N	t	2026-09-05 20:30:56.042823+00
1065	DOC_OT_882552343443700	Otro	Dos	\N	\N	\N	t	2026-09-05 20:30:56.052681+00
1066	EXP_1788640257086	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 20:30:57.087462+00
1067	DOC_INC_882738229830400	Estudiante	Prueba 0400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:34:01.931337+00
1068	DOC_INC_882738421832500	Estudiante	Prueba 2500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:34:02.120683+00
1069	DOC_INC_882738849086700	Estudiante	Prueba 6700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:34:02.547695+00
1070	DOC_INC_882739017066500	Estudiante	Prueba 6500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:34:02.716376+00
1071	DOC_INC_882739381732900	Estudiante	Prueba 2900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:34:03.080569+00
1072	DOC_INC_882739512895000	Estudiante	Prueba 5000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:34:03.212349+00
1073	DOC_INC_882739533573300	Estudiante	Prueba 3300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:34:03.232867+00
1074	DOC_INC_882739550476100	Estudiante	Prueba 6100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:34:03.249872+00
1075	DOC_INC_882739731922000	Estudiante	Prueba 2000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:34:03.431281+00
1076	DOC_INC_882739870306700	Estudiante	Prueba 6700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:34:03.569607+00
1077	DOC_FIN_882740050098800	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 20:34:03.749189+00
1078	DOC_TEL_882740140649200	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 20:34:03.839722+00
1079	DOC_EX_882742450601300	Existente	Uno	\N	\N	\N	t	2026-09-05 20:34:06.15008+00
1080	DOC_OT_882742450752200	Otro	Dos	\N	\N	\N	t	2026-09-05 20:34:06.157405+00
1081	EXP_1788640446662	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 20:34:06.662811+00
1082	DOC_INC_883589494537800	Estudiante	Prueba 7800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:48:13.195189+00
1083	DOC_INC_883589752944700	Estudiante	Prueba 4700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:48:13.451919+00
1084	DOC_INC_883590167284200	Estudiante	Prueba 4200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:48:13.866603+00
1085	DOC_INC_883590392953100	Estudiante	Prueba 3100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:48:14.092342+00
1086	DOC_INC_883590761512100	Estudiante	Prueba 2100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:48:14.459972+00
1087	DOC_INC_883590915518300	Estudiante	Prueba 8300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:48:14.614644+00
1088	DOC_INC_883590965747800	Estudiante	Prueba 7800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:48:14.664606+00
1089	DOC_INC_883590979848300	Estudiante	Prueba 8300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:48:14.678878+00
1090	DOC_INC_883591100835900	Estudiante	Prueba 5900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:48:14.79988+00
1091	DOC_INC_883591220246600	Estudiante	Prueba 6600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:48:14.91873+00
1092	DOC_FIN_883591445256900	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 20:48:15.144283+00
1093	DOC_TEL_883591544040200	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 20:48:15.243141+00
1094	DOC_EX_883593841626100	Existente	Uno	\N	\N	\N	t	2026-09-05 20:48:17.541098+00
1095	DOC_OT_883593841728100	Otro	Dos	\N	\N	\N	t	2026-09-05 20:48:17.549962+00
1096	EXP_1788641298269	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 20:48:18.271098+00
1097	DOC_INC_883651257143900	Estudiante	Prueba 3900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:14.994778+00
1098	DOC_INC_883651850787800	Estudiante	Prueba 7800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:15.549855+00
1099	DOC_INC_883652412211700	Estudiante	Prueba 1700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:16.111327+00
1100	DOC_INC_883652632466200	Estudiante	Prueba 6200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:16.331593+00
1101	DOC_INC_883652936086100	Estudiante	Prueba 6100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:16.634843+00
1102	DOC_INC_883653071684300	Estudiante	Prueba 4300	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:16.770905+00
1103	DOC_INC_883653093355500	Estudiante	Prueba 5500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:16.792354+00
1104	DOC_INC_883653110769600	Estudiante	Prueba 9600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:16.809615+00
1105	DOC_INC_883653303109900	Estudiante	Prueba 9900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:17.002882+00
1106	DOC_INC_883653534902000	Estudiante	Prueba 2000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:17.23506+00
1107	DOC_INC_883653732317500	Estudiante	Prueba 7500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:17.431706+00
1108	DOC_INC_883689755931200	Estudiante	Prueba 1200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:53.456325+00
1109	DOC_INC_883689915304000	Estudiante	Prueba 4000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:53.614592+00
1110	DOC_INC_883690382589700	Estudiante	Prueba 9700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:54.081049+00
1111	DOC_INC_883690605320600	Estudiante	Prueba 0600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:54.304736+00
1112	DOC_INC_883690905148500	Estudiante	Prueba 8500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:54.604212+00
1113	DOC_INC_883691022334100	Estudiante	Prueba 4100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:54.721221+00
1114	DOC_INC_883691036532600	Estudiante	Prueba 2600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:54.735412+00
1115	DOC_INC_883691048419900	Estudiante	Prueba 9900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:54.747422+00
1116	DOC_INC_883691189650900	Estudiante	Prueba 0900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:54.888467+00
1117	DOC_INC_883691280865000	Estudiante	Prueba 5000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:54.980375+00
1118	DOC_INC_883691465723800	Estudiante	Prueba 3800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:49:55.164734+00
1119	DOC_FIN_883691673170600	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 20:49:55.372085+00
1120	DOC_TEL_883691813895500	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 20:49:55.513156+00
1121	DOC_EX_883693991651800	Existente	Uno	\N	\N	\N	t	2026-09-05 20:49:57.690884+00
1122	DOC_OT_883693991785000	Otro	Dos	\N	\N	\N	t	2026-09-05 20:49:57.699192+00
1123	EXP_1788641398286	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 20:49:58.286771+00
1124	DOC_INC_883793556964700	Estudiante	Prueba 4700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:51:37.257531+00
1125	DOC_INC_883793788448900	Estudiante	Prueba 8900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:51:37.488314+00
1126	DOC_INC_883794511697600	Estudiante	Prueba 7600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:51:38.210453+00
1127	DOC_INC_883794708102800	Estudiante	Prueba 2800	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:51:38.407053+00
1128	DOC_INC_883795031796400	Estudiante	Prueba 6400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:51:38.730388+00
1129	DOC_INC_883795153763600	Estudiante	Prueba 3600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:51:38.852447+00
1130	DOC_INC_883795169781900	Estudiante	Prueba 1900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:51:38.868953+00
1131	DOC_INC_883795210674600	Estudiante	Prueba 4600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:51:38.909468+00
1132	DOC_INC_883795319907500	Estudiante	Prueba 7500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:51:39.018959+00
1133	DOC_INC_883795458126000	Estudiante	Prueba 6000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:51:39.156949+00
1134	DOC_INC_883795674158700	Estudiante	Prueba 8700	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 20:51:39.373305+00
1135	DOC_FIN_883795876754900	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 20:51:39.576115+00
1136	DOC_TEL_883795987664900	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 20:51:39.686649+00
1137	DOC_EX_883798646557500	Existente	Uno	\N	\N	\N	t	2026-09-05 20:51:42.346195+00
1138	DOC_OT_883798646720100	Otro	Dos	\N	\N	\N	t	2026-09-05 20:51:42.354498+00
1139	EXP_1788641502946	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 20:51:42.947556+00
1140	DOC_INC_889768850620200	Estudiante	Prueba 0200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 22:31:12.551343+00
1141	DOC_INC_889769349483100	Estudiante	Prueba 3100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 22:31:13.049251+00
1142	DOC_INC_889770351655200	Estudiante	Prueba 5200	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 22:31:14.050799+00
1143	DOC_INC_889770797206100	Estudiante	Prueba 6100	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 22:31:14.496256+00
1144	DOC_INC_889771214567600	Estudiante	Prueba 7600	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 22:31:14.913436+00
1145	DOC_INC_889771485049000	Estudiante	Prueba 9000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 22:31:15.183986+00
1146	DOC_INC_889771503296900	Estudiante	Prueba 6900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 22:31:15.202598+00
1147	DOC_INC_889771519336500	Estudiante	Prueba 6500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 22:31:15.218656+00
1148	DOC_INC_889771679057000	Estudiante	Prueba 7000	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 22:31:15.378021+00
1149	DOC_INC_889771829990400	Estudiante	Prueba 0400	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 22:31:15.52901+00
1150	DOC_INC_889772033636500	Estudiante	Prueba 6500	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 22:31:15.733075+00
1151	DOC_INC_889772187472900	Estudiante	Prueba 2900	ACUDIENTE PRUEBA	3101234567	\N	t	2026-09-05 22:31:15.886792+00
1152	DOC_FIN_889772476558800	PEPITO ANTONIO	PEREZ GOMEZ	MARIA GOMEZ	3114165509	\N	t	2026-09-05 22:31:16.176153+00
1153	DOC_TEL_889772626837600	Laura	Jimenez	PADRE INICIAL	3101112233	\N	t	2026-09-05 22:31:16.32625+00
1154	DOC_EX_889775584830600	Existente	Uno	\N	\N	\N	t	2026-09-05 22:31:19.283991+00
1155	DOC_OT_889775584949000	Otro	Dos	\N	\N	\N	t	2026-09-05 22:31:19.29204+00
1156	EXP_1788647479868	CAMILO	VALENCIA	ROSA VALENCIA	3159998877	rosa@correo.com	t	2026-09-05 22:31:19.86964+00
\.


--
-- Data for Name: flyway_schema_history; Type: TABLE DATA; Schema: public; Owner: admin_disciplina
--

COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
1	1	schema inicial	SQL	V1__schema_inicial.sql	502862708	admin_disciplina	2026-09-03 22:19:14.641176	585	t
2	2	usuarios y catalogos	SQL	V2__usuarios_y_catalogos.sql	-1787034724	admin_disciplina	2026-09-03 22:19:15.380169	29	t
3	3	docentes iniciales	SQL	V3__docentes_iniciales.sql	-37384450	admin_disciplina	2026-09-04 15:20:36.836824	140	t
4	4	ajustar catalogo faltas ley1620	SQL	V4__ajustar_catalogo_faltas_ley1620.sql	2097551137	admin_disciplina	2026-09-05 00:22:20.764603	94	t
5	5	indices rendimiento expedientes	SQL	V5__indices_rendimiento_expedientes.sql	-1880608924	admin_disciplina	2026-09-05 00:58:09.349062	235	t
6	6	ampliar accion auditoria	SQL	V6__ampliar_accion_auditoria.sql	1912164629	admin_disciplina	2026-09-05 15:33:17.256088	86	t
\.


--
-- Data for Name: incidente_estudiantes; Type: TABLE DATA; Schema: public; Owner: admin_disciplina
--

COPY public.incidente_estudiantes (id, incidente_id, estudiante_id, catalogo_falta_id, anio_lectivo, grado_momento, grupo_momento, rol_estudiante, descargo_estudiante, compromiso_individual, created_at) FROM stdin;
1	1	792	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-04 20:20:57.746538+00
2	2	793	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-04 20:20:58.194282+00
3	3	794	1	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-04 20:20:58.691334+00
4	3	795	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-04 20:20:58.697713+00
5	3	796	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-04 20:20:58.703158+00
6	4	797	1	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-04 20:20:59.013452+00
7	5	803	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-04 20:22:29.05253+00
8	6	804	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-04 20:22:29.370257+00
9	7	805	1	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-04 20:22:29.769762+00
10	7	806	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-04 20:22:29.782324+00
11	7	807	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-04 20:22:29.788603+00
12	8	808	1	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-04 20:22:29.983761+00
13	9	810	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-04 20:23:04.241122+00
14	10	811	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-04 20:23:04.538498+00
15	11	812	1	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-04 20:23:04.859183+00
16	11	813	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-04 20:23:04.863032+00
17	11	814	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-04 20:23:04.867654+00
18	12	815	1	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-04 20:23:05.076294+00
19	13	461	\N	2026	9	1	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 03:55:54.148646+00
20	14	821	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 03:59:35.824608+00
21	15	822	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 03:59:36.199668+00
22	16	823	1	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 03:59:36.528288+00
23	16	824	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 03:59:36.534424+00
24	16	825	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 03:59:36.539214+00
25	17	826	1	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 03:59:36.743411+00
26	18	461	2	2026	9	1	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 04:05:21.553414+00
27	19	832	1	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 04:21:42.652975+00
28	20	833	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 04:21:43.408991+00
29	21	834	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 04:21:43.837092+00
30	22	835	1	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 04:21:44.097463+00
31	22	836	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 04:21:44.112217+00
32	22	837	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 04:21:44.120067+00
33	23	838	1	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 04:21:44.275615+00
34	24	844	1	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 04:44:08.15805+00
35	25	845	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 04:44:08.83739+00
36	26	846	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 04:44:09.237027+00
37	27	847	1	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 04:44:09.602794+00
38	27	848	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 04:44:09.607738+00
39	27	849	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 04:44:09.612905+00
40	28	850	1	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 04:44:09.817734+00
41	29	852	1	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 04:45:03.641236+00
42	30	853	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 04:45:04.246425+00
43	31	854	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 04:45:04.668399+00
44	32	855	1	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 04:45:04.985344+00
45	32	856	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 04:45:04.989199+00
46	32	857	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 04:45:04.993651+00
47	33	858	1	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 04:45:05.178418+00
48	34	865	1	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 04:46:02.421291+00
49	35	866	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 04:46:03.039748+00
50	36	867	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 04:46:03.540205+00
51	37	868	1	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 04:46:03.911188+00
52	37	869	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 04:46:03.917358+00
53	37	870	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 04:46:03.924011+00
54	38	871	1	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 04:46:04.122394+00
55	39	876	4	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 04:46:09.058977+00
56	40	878	1	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 05:00:02.477402+00
57	41	879	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 05:00:03.210377+00
58	42	880	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 05:00:03.619225+00
59	43	881	1	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 05:00:03.948762+00
60	43	882	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 05:00:03.952213+00
61	43	883	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 05:00:03.956677+00
62	44	884	1	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 05:00:04.120703+00
63	45	889	5	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 05:00:09.19881+00
64	46	891	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 05:31:27.878853+00
65	47	892	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 05:31:28.215877+00
66	48	893	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 05:31:28.382586+00
67	49	894	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 05:31:28.531872+00
68	49	895	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 05:31:28.533991+00
69	49	896	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 05:31:28.535568+00
70	50	897	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 05:31:28.607319+00
71	51	902	6	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 05:31:31.739194+00
72	52	461	3	2026	9	1	AGRESOR_PRINCIPAL	Ejecutó la agresión armada contra un compañero, constituyendo un presunto delito penal.	\N	2026-09-05 05:34:32.155977+00
73	52	433	\N	2026	8	4	VICTIMA	Recibió la agresión física por parte de otro estudiante.	\N	2026-09-05 05:34:32.16518+00
74	53	915	7	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 05:58:28.421881+00
75	54	917	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 05:59:25.695884+00
76	55	918	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 05:59:26.226055+00
77	56	919	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 05:59:26.541485+00
78	57	920	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 05:59:26.799637+00
79	57	921	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 05:59:26.802387+00
80	57	922	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 05:59:26.805627+00
81	58	923	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 05:59:26.968248+00
82	59	925	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 06:00:03.499799+00
83	60	926	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 06:00:04.098603+00
84	61	927	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 06:00:04.342178+00
85	62	928	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 06:00:04.57779+00
86	62	929	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 06:00:04.581148+00
87	62	930	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 06:00:04.583923+00
88	63	931	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 06:00:04.71705+00
89	64	936	8	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 06:00:08.042306+00
90	65	938	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 11:56:00.223109+00
91	66	939	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 11:56:00.783935+00
92	67	940	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 11:56:01.046031+00
93	68	941	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 11:56:01.267326+00
94	68	942	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 11:56:01.270241+00
95	68	943	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 11:56:01.274106+00
96	69	944	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 11:56:01.384413+00
97	70	949	9	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 11:56:06.268154+00
98	71	6	2	2026	6	1	AGRESOR_PRINCIPAL	Participa activamente y se involucra en la agresión física (golpes) contra otro estudiante.	\N	2026-09-05 12:11:23.328938+00
99	71	259	2	2026	7	4	PARTICIPE	Participa activamente en la riña y agresión física mutua con el otro estudiante.	\N	2026-09-05 12:11:23.341983+00
100	71	129	\N	2026	6	5	TESTIGO	Presenció los hechos reportados sin participar en la agresión ni en la riña.	\N	2026-09-05 12:11:23.348722+00
101	72	951	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 12:22:44.2966+00
102	73	952	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 12:22:44.963118+00
103	74	953	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 12:22:45.484881+00
104	75	954	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 12:22:45.734397+00
105	75	955	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 12:22:45.73771+00
106	75	956	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 12:22:45.741352+00
107	76	957	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 12:22:45.854959+00
108	77	962	10	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 12:22:49.990154+00
109	78	964	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 12:27:02.470974+00
110	79	965	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 12:27:03.080269+00
111	80	966	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 12:27:03.269317+00
112	81	967	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 12:27:03.682261+00
113	81	968	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 12:27:03.686294+00
114	81	969	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 12:27:03.689099+00
115	82	970	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 12:27:03.789104+00
116	83	971	\N	2026	09	0901	AGRESOR_PRINCIPAL	El estudiante manifiesta su compromiso con la convivencia.	Realizar actividad restaurativa.	2026-09-05 12:27:03.901464+00
117	84	976	11	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 12:27:06.80572+00
118	85	978	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 12:27:54.54179+00
119	86	979	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 12:27:55.084003+00
120	87	980	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 12:27:55.251592+00
121	88	981	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 12:27:55.500573+00
122	89	982	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 12:27:55.65526+00
123	89	983	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 12:27:55.658109+00
124	89	984	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 12:27:55.661862+00
125	90	985	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 12:27:55.784885+00
126	91	986	\N	2026	09	0901	AGRESOR_PRINCIPAL	El estudiante manifiesta su compromiso con la convivencia.	Realizar actividad restaurativa.	2026-09-05 12:27:55.87453+00
127	92	991	12	2026	08	0802	AGRESOR_PRINCIPAL	aaaaaaaaaaaaaaaaaaaa	aaaaaaaaaaaaaaaaaaaaaaaaaaaa	2026-09-05 12:27:58.601042+00
128	93	993	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 19:45:21.047366+00
129	94	994	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 19:45:21.704378+00
130	95	995	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 19:45:21.898489+00
131	96	996	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 19:45:22.179185+00
132	97	997	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 19:45:22.38339+00
133	97	998	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 19:45:22.386773+00
134	97	999	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 19:45:22.39058+00
135	98	1000	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 19:45:22.500804+00
136	99	1001	\N	2026	09	0901	AGRESOR_PRINCIPAL	El estudiante manifiesta su compromiso con la convivencia.	Realizar actividad restaurativa.	2026-09-05 19:45:22.632783+00
137	100	1006	13	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 19:45:26.479883+00
138	101	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:02:05.602287+00
139	102	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:02:06.394088+00
140	103	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:02:06.5301+00
141	104	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:02:06.783863+00
142	105	1008	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:04:30.560572+00
143	106	1009	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 20:04:31.945309+00
144	107	1010	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:04:32.481868+00
145	108	1011	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:04:33.129646+00
146	109	1012	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:04:33.465515+00
147	109	1013	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 20:04:33.474112+00
148	109	1014	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 20:04:33.488995+00
149	110	1015	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 20:04:33.680581+00
150	111	1016	\N	2026	09	0901	AGRESOR_PRINCIPAL	El estudiante manifiesta su compromiso con la convivencia.	Realizar actividad restaurativa.	2026-09-05 20:04:33.824341+00
151	112	1021	14	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 20:04:39.532425+00
152	113	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:04:40.067407+00
153	114	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:04:40.493039+00
154	115	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:04:40.570156+00
155	116	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:04:40.708235+00
156	117	1023	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:16:54.693423+00
157	118	1024	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 20:16:55.38965+00
158	119	1025	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:16:55.720978+00
159	120	1026	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:16:56.431438+00
160	121	1027	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:16:56.858315+00
161	121	1028	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 20:16:56.864912+00
162	121	1029	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 20:16:56.872469+00
163	122	1030	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 20:16:57.078452+00
164	123	1031	\N	2026	09	0901	AGRESOR_PRINCIPAL	El estudiante manifiesta su compromiso con la convivencia.	Realizar actividad restaurativa.	2026-09-05 20:16:57.24153+00
165	124	1036	15	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 20:17:02.891064+00
166	125	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:17:04.047986+00
167	126	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:17:04.232542+00
168	127	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:17:04.315336+00
169	128	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:17:04.685609+00
170	129	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:18:27.68687+00
171	130	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:18:28.849924+00
172	131	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:18:29.043033+00
173	132	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:18:29.356724+00
174	133	1038	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:19:52.579077+00
175	134	1039	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 20:19:53.298285+00
176	135	1040	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:19:53.589329+00
177	136	1041	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:19:54.058172+00
178	137	1042	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:19:54.314084+00
179	137	1043	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 20:19:54.317763+00
180	137	1044	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 20:19:54.32101+00
181	138	1045	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 20:19:54.457385+00
182	139	1046	\N	2026	09	0901	AGRESOR_PRINCIPAL	El estudiante manifiesta su compromiso con la convivencia.	Realizar actividad restaurativa.	2026-09-05 20:19:54.590495+00
183	140	1051	16	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 20:19:59.63088+00
184	141	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:20:00.568135+00
185	142	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:20:01.002319+00
186	143	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:20:01.087181+00
187	144	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:20:01.282108+00
188	145	1053	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:30:49.752658+00
189	146	1054	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 20:30:50.544948+00
190	147	1055	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:30:50.903188+00
191	148	1056	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:30:51.353254+00
192	149	1057	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:30:51.655138+00
193	149	1058	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 20:30:51.658919+00
194	149	1059	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 20:30:51.663495+00
195	150	1060	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 20:30:51.818662+00
196	151	1061	\N	2026	09	0901	AGRESOR_PRINCIPAL	El estudiante manifiesta su compromiso con la convivencia.	Realizar actividad restaurativa.	2026-09-05 20:30:51.975671+00
197	152	1066	17	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 20:30:57.295201+00
198	153	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:30:58.476547+00
199	154	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:30:58.887526+00
200	155	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:30:58.973894+00
201	156	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:30:59.142131+00
202	157	1068	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:34:02.179538+00
203	158	1069	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 20:34:02.590227+00
204	159	1070	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:34:02.802788+00
205	160	1071	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:34:03.123408+00
206	161	1072	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:34:03.366028+00
207	161	1073	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 20:34:03.369509+00
208	161	1074	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 20:34:03.37279+00
209	162	1075	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 20:34:03.482182+00
210	163	1076	\N	2026	09	0901	AGRESOR_PRINCIPAL	El estudiante manifiesta su compromiso con la convivencia.	Realizar actividad restaurativa.	2026-09-05 20:34:03.611378+00
211	164	1081	18	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 20:34:06.723117+00
212	165	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:34:07.694488+00
213	166	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:34:07.960065+00
214	167	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:34:08.004002+00
215	168	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:34:08.090149+00
216	169	1083	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:48:13.510593+00
217	170	1084	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 20:48:13.940678+00
218	171	1085	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:48:14.147435+00
219	172	1086	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:48:14.507942+00
220	173	1087	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:48:14.739597+00
221	173	1088	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 20:48:14.74227+00
222	173	1089	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 20:48:14.745287+00
223	174	1090	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 20:48:14.853709+00
224	175	1091	\N	2026	09	0901	AGRESOR_PRINCIPAL	El estudiante manifiesta su compromiso con la convivencia.	Realizar actividad restaurativa.	2026-09-05 20:48:14.972282+00
225	176	1096	19	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 20:48:18.322233+00
226	177	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:48:19.192606+00
227	178	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:48:19.478871+00
228	179	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:48:19.533728+00
229	180	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:48:19.640722+00
230	181	1098	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:49:15.620476+00
231	182	1099	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 20:49:16.150489+00
232	183	1100	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:49:16.370758+00
233	184	1101	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:49:16.677302+00
234	185	1102	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:49:16.922524+00
235	185	1103	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 20:49:16.925872+00
236	185	1104	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 20:49:16.929208+00
237	186	1105	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 20:49:17.104238+00
238	187	1106	\N	2026	10	1002	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:49:17.292235+00
239	188	1107	\N	2026	09	0901	AGRESOR_PRINCIPAL	El estudiante manifiesta su compromiso con la convivencia.	Realizar actividad restaurativa.	2026-09-05 20:49:17.474451+00
240	189	1109	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:49:53.675413+00
241	190	1110	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 20:49:54.125629+00
242	191	1111	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:49:54.357124+00
243	192	1112	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:49:54.642958+00
244	193	1113	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:49:54.799786+00
245	193	1114	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 20:49:54.802488+00
246	193	1115	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 20:49:54.805161+00
247	194	1116	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 20:49:54.934887+00
248	195	1117	\N	2026	10	1002	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:49:55.054+00
249	196	1118	\N	2026	09	0901	AGRESOR_PRINCIPAL	El estudiante manifiesta su compromiso con la convivencia.	Realizar actividad restaurativa.	2026-09-05 20:49:55.242483+00
250	197	1123	20	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 20:49:58.335592+00
251	198	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:49:59.185242+00
252	199	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:49:59.53829+00
253	200	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:49:59.593471+00
254	201	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:49:59.685384+00
255	202	1125	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:51:37.558781+00
256	203	1126	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 20:51:38.255954+00
257	204	1127	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:51:38.45108+00
258	205	1128	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:51:38.767817+00
259	206	1129	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:51:38.963897+00
260	206	1130	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 20:51:38.966057+00
261	206	1131	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 20:51:38.968977+00
262	207	1132	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 20:51:39.104478+00
263	208	1133	\N	2026	10	1002	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 20:51:39.215349+00
264	209	1134	\N	2026	09	0901	AGRESOR_PRINCIPAL	El estudiante manifiesta su compromiso con la convivencia.	Realizar actividad restaurativa.	2026-09-05 20:51:39.427994+00
265	210	1139	21	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 20:51:43.013245+00
266	211	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:51:44.004467+00
267	212	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:51:44.288555+00
268	213	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:51:44.3322+00
269	214	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 20:51:44.412469+00
270	215	1141	4	2026	06	0601	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 22:31:13.192475+00
271	216	1142	\N	2026	07	0701	AGRESOR_PRINCIPAL	El estudiante declara que no fue su intencion generar conflicto.	Participar en el taller de resolucion pacifica de conflictos.	2026-09-05 22:31:14.160009+00
272	217	1143	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 22:31:14.603878+00
273	218	1144	\N	2026	08	0801	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 22:31:14.969564+00
274	219	1145	4	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 22:31:15.307451+00
275	219	1146	\N	2026	09	0902	VICTIMA	\N	\N	2026-09-05 22:31:15.311293+00
276	219	1147	\N	2026	09	0901	TESTIGO	\N	\N	2026-09-05 22:31:15.31511+00
277	220	1148	4	2026	10	1001	AGRESOR_PRINCIPAL	Acepto que lance el objeto.	Me comprometo a reparar el material.	2026-09-05 22:31:15.457181+00
278	221	1149	\N	2026	10	1002	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 22:31:15.577171+00
279	222	1150	\N	2026	09	0901	AGRESOR_PRINCIPAL	El estudiante manifiesta su compromiso con la convivencia.	Realizar actividad restaurativa.	2026-09-05 22:31:15.788987+00
280	223	1151	\N	2026	09	0901	AGRESOR_PRINCIPAL	\N	\N	2026-09-05 22:31:15.960719+00
281	224	1156	22	2026	08	0802	AGRESOR_PRINCIPAL	Versión del estudiante en descargos	Compromiso de buen comportamiento	2026-09-05 22:31:19.95259+00
282	225	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 22:31:20.910936+00
283	226	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 22:31:21.301388+00
284	227	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 22:31:21.371676+00
285	228	1	4	2026	8	02	AGRESOR_PRINCIPAL	Reconozco que no guardé el teléfono a tiempo.	Dejar el teléfono en el casillero.	2026-09-05 22:31:21.496771+00
\.


--
-- Data for Name: incidentes; Type: TABLE DATA; Schema: public; Owner: admin_disciplina
--

COPY public.incidentes (id, docente_reporta_id, lugar_id, usuario_registro_id, fecha_incidente, hora_incidente, descripcion_hechos, estado_proceso, created_at, updated_at) FROM stdin;
1	1	1	8	2026-09-04	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-04 20:20:57.672636+00	2026-09-04 20:20:57.672636+00
2	1	1	8	2026-09-04	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	REPORTADO	2026-09-04 20:20:58.187583+00	2026-09-04 20:20:58.187583+00
38	1	1	8	2026-09-04	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 04:46:04.116699+00	2026-09-05 04:46:04.116699+00
3	1	1	7	2026-09-04	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-04 20:20:58.666009+00	2026-09-04 20:20:58.666009+00
4	1	1	8	2026-09-04	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-04 20:20:59.002026+00	2026-09-04 20:20:59.002026+00
5	1	1	8	2026-09-04	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-04 20:22:29.029109+00	2026-09-04 20:22:29.029109+00
6	1	1	8	2026-09-04	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-04 20:22:29.35382+00	2026-09-04 20:22:29.455847+00
7	1	1	7	2026-09-04	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-04 20:22:29.755165+00	2026-09-04 20:22:29.755165+00
8	1	1	8	2026-09-04	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-04 20:22:29.979232+00	2026-09-04 20:22:29.979232+00
9	1	1	8	2026-09-04	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-04 20:23:04.226414+00	2026-09-04 20:23:04.226414+00
10	1	1	8	2026-09-04	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-04 20:23:04.533895+00	2026-09-04 20:23:04.613326+00
11	1	1	7	2026-09-04	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-04 20:23:04.852963+00	2026-09-04 20:23:04.852963+00
12	1	1	8	2026-09-04	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-04 20:23:05.071268+00	2026-09-04 20:23:05.071268+00
13	6	1	2	2026-09-04	03:50:00	Descripcion de prueba con mas de diez caracteres	REPORTADO	2026-09-05 03:55:53.995194+00	2026-09-05 03:55:53.995194+00
14	1	1	8	2026-09-04	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 03:59:35.798372+00	2026-09-05 03:59:35.798372+00
15	1	1	8	2026-09-04	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 03:59:36.195165+00	2026-09-05 03:59:36.265725+00
16	1	1	7	2026-09-04	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 03:59:36.507298+00	2026-09-05 03:59:36.507298+00
17	1	1	8	2026-09-04	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 03:59:36.738114+00	2026-09-05 03:59:36.738114+00
18	1	5	2	2026-09-04	14:10:00	El estudiante golpeo a su compañero sin motivo	REPORTADO	2026-09-05 04:05:21.530042+00	2026-09-05 04:05:21.530042+00
19	1	1	8	2026-09-04	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 04:21:42.635041+00	2026-09-05 04:21:42.635041+00
20	1	1	8	2026-09-04	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 04:21:43.402679+00	2026-09-05 04:21:43.402679+00
21	1	1	8	2026-09-04	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 04:21:43.83226+00	2026-09-05 04:21:43.878107+00
22	1	1	7	2026-09-04	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 04:21:44.091335+00	2026-09-05 04:21:44.091335+00
23	1	1	8	2026-09-04	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 04:21:44.269769+00	2026-09-05 04:21:44.269769+00
24	1	1	8	2026-09-04	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 04:44:08.140764+00	2026-09-05 04:44:08.140764+00
25	1	1	8	2026-09-04	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 04:44:08.83274+00	2026-09-05 04:44:08.83274+00
26	1	1	8	2026-09-04	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 04:44:09.232277+00	2026-09-05 04:44:09.306438+00
27	1	1	7	2026-09-04	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 04:44:09.597043+00	2026-09-05 04:44:09.597043+00
28	1	1	8	2026-09-04	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 04:44:09.798618+00	2026-09-05 04:44:09.798618+00
29	1	1	8	2026-09-04	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 04:45:03.628686+00	2026-09-05 04:45:03.628686+00
30	1	1	8	2026-09-04	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 04:45:04.240627+00	2026-09-05 04:45:04.240627+00
31	1	1	8	2026-09-04	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 04:45:04.655214+00	2026-09-05 04:45:04.735576+00
32	1	1	7	2026-09-04	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 04:45:04.978132+00	2026-09-05 04:45:04.978132+00
33	1	1	8	2026-09-04	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 04:45:05.173802+00	2026-09-05 04:45:05.173802+00
34	1	1	8	2026-09-04	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 04:46:02.410582+00	2026-09-05 04:46:02.410582+00
35	1	1	8	2026-09-04	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 04:46:03.035278+00	2026-09-05 04:46:03.035278+00
36	1	1	8	2026-09-04	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 04:46:03.525264+00	2026-09-05 04:46:03.617625+00
37	1	1	7	2026-09-04	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 04:46:03.89974+00	2026-09-05 04:46:03.89974+00
39	11	10	6	2026-09-04	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 04:46:09.020467+00	2026-09-05 04:46:09.020467+00
40	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 05:00:02.444637+00	2026-09-05 05:00:02.445153+00
41	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 05:00:03.206089+00	2026-09-05 05:00:03.206089+00
42	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 05:00:03.614722+00	2026-09-05 05:00:03.665304+00
43	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 05:00:03.939916+00	2026-09-05 05:00:03.939916+00
44	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 05:00:04.116677+00	2026-09-05 05:00:04.116677+00
45	12	11	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 05:00:09.188023+00	2026-09-05 05:00:09.188023+00
46	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 05:31:27.872261+00	2026-09-05 05:31:27.872261+00
47	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 05:31:28.213771+00	2026-09-05 05:31:28.213771+00
48	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 05:31:28.380414+00	2026-09-05 05:31:28.409932+00
49	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 05:31:28.517718+00	2026-09-05 05:31:28.517718+00
50	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 05:31:28.605204+00	2026-09-05 05:31:28.605204+00
51	13	12	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 05:31:31.725841+00	2026-09-05 05:31:31.725841+00
52	9	3	2	2026-09-05	05:33:00	El estudiante Juan Acero agredió con arma de fuego a su compañero Stiven Delgado en el Patio Central de la institución, según el reporte del docente Andres Gomez.	REPORTADO	2026-09-05 05:34:32.091687+00	2026-09-05 05:34:32.091687+00
53	14	13	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 05:58:28.367647+00	2026-09-05 05:58:28.367647+00
54	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 05:59:25.687671+00	2026-09-05 05:59:25.687671+00
55	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 05:59:26.222184+00	2026-09-05 05:59:26.222745+00
56	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 05:59:26.537398+00	2026-09-05 05:59:26.58389+00
57	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 05:59:26.795663+00	2026-09-05 05:59:26.795663+00
58	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 05:59:26.963798+00	2026-09-05 05:59:26.963798+00
59	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 06:00:03.491846+00	2026-09-05 06:00:03.491846+00
60	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 06:00:04.09281+00	2026-09-05 06:00:04.09281+00
61	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 06:00:04.338935+00	2026-09-05 06:00:04.380763+00
62	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 06:00:04.573292+00	2026-09-05 06:00:04.573292+00
63	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 06:00:04.712524+00	2026-09-05 06:00:04.712524+00
64	15	14	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 06:00:08.034624+00	2026-09-05 06:00:08.034624+00
65	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 11:56:00.210198+00	2026-09-05 11:56:00.211253+00
66	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 11:56:00.780077+00	2026-09-05 11:56:00.780077+00
67	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 11:56:01.041792+00	2026-09-05 11:56:01.082534+00
68	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 11:56:01.263449+00	2026-09-05 11:56:01.263449+00
69	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 11:56:01.381013+00	2026-09-05 11:56:01.381013+00
70	16	15	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 11:56:06.252808+00	2026-09-05 11:56:06.252808+00
71	2	5	2	2026-09-05	12:10:00	Durante un partido en las canchas deportivas, se presentó una riña con agresión física entre los estudiantes Carlos Pérez y Mateo Gómez tras una discusión. El estudiante Andrés Rueda presenció los hechos e intentó buscar ayuda de la coordinación.	REPORTADO	2026-09-05 12:11:23.123944+00	2026-09-05 12:11:23.123944+00
72	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 12:22:44.285315+00	2026-09-05 12:22:44.285315+00
73	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 12:22:44.958747+00	2026-09-05 12:22:44.958747+00
74	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 12:22:45.479332+00	2026-09-05 12:22:45.542052+00
75	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 12:22:45.730452+00	2026-09-05 12:22:45.730452+00
76	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 12:22:45.850825+00	2026-09-05 12:22:45.850825+00
77	17	16	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 12:22:49.979018+00	2026-09-05 12:22:49.979018+00
78	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 12:27:02.461732+00	2026-09-05 12:27:02.461732+00
79	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 12:27:03.07637+00	2026-09-05 12:27:03.07637+00
80	1	1	8	2026-09-05	\N	Incidente para validar alias nuevoEstado del frontend.	EN_INDAGACION	2026-09-05 12:27:03.265405+00	2026-09-05 12:27:03.303932+00
81	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 12:27:03.677858+00	2026-09-05 12:27:03.677858+00
82	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 12:27:03.784517+00	2026-09-05 12:27:03.784517+00
83	1	1	8	2026-09-05	\N	Incidente para probar alias de descargo y compromisos.	REPORTADO	2026-09-05 12:27:03.898577+00	2026-09-05 12:27:03.898577+00
84	18	17	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 12:27:06.797629+00	2026-09-05 12:27:06.797629+00
85	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 12:27:54.536+00	2026-09-05 12:27:54.536+00
86	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 12:27:55.081199+00	2026-09-05 12:27:55.081199+00
87	1	1	8	2026-09-05	\N	Incidente para validar alias nuevoEstado del frontend.	EN_INDAGACION	2026-09-05 12:27:55.24836+00	2026-09-05 12:27:55.2782+00
88	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 12:27:55.497773+00	2026-09-05 12:27:55.522611+00
89	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 12:27:55.651602+00	2026-09-05 12:27:55.651602+00
90	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 12:27:55.781534+00	2026-09-05 12:27:55.781534+00
91	1	1	8	2026-09-05	\N	Incidente para probar alias de descargo y compromisos.	REPORTADO	2026-09-05 12:27:55.871043+00	2026-09-05 12:27:55.871043+00
92	19	18	6	2026-09-05	15:15:00	Incidente para validación de expediente	CERRADO	2026-09-05 12:27:58.593817+00	2026-09-05 19:33:58.276323+00
93	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 19:45:21.032985+00	2026-09-05 19:45:21.032985+00
94	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 19:45:21.700479+00	2026-09-05 19:45:21.700479+00
95	1	1	8	2026-09-05	\N	Incidente para validar alias nuevoEstado del frontend.	EN_INDAGACION	2026-09-05 19:45:21.895291+00	2026-09-05 19:45:21.934603+00
96	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 19:45:22.175916+00	2026-09-05 19:45:22.206303+00
97	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 19:45:22.37365+00	2026-09-05 19:45:22.37365+00
98	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 19:45:22.498651+00	2026-09-05 19:45:22.498651+00
99	1	1	8	2026-09-05	\N	Incidente para probar alias de descargo y compromisos.	REPORTADO	2026-09-05 19:45:22.628333+00	2026-09-05 19:45:22.628333+00
100	20	19	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 19:45:26.469777+00	2026-09-05 19:45:26.469777+00
101	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:02:05.581432+00	2026-09-05 20:02:05.581432+00
102	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:02:06.388361+00	2026-09-05 20:02:06.388361+00
103	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:02:06.525124+00	2026-09-05 20:02:06.525124+00
104	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:02:06.775924+00	2026-09-05 20:02:06.775924+00
105	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 20:04:30.528844+00	2026-09-05 20:04:30.528844+00
106	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 20:04:31.938657+00	2026-09-05 20:04:31.938657+00
107	1	1	8	2026-09-05	\N	Incidente para validar alias nuevoEstado del frontend.	EN_INDAGACION	2026-09-05 20:04:32.474216+00	2026-09-05 20:04:32.539347+00
108	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 20:04:33.123877+00	2026-09-05 20:04:33.186713+00
109	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 20:04:33.457236+00	2026-09-05 20:04:33.457236+00
110	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 20:04:33.667406+00	2026-09-05 20:04:33.667406+00
111	1	1	8	2026-09-05	\N	Incidente para probar alias de descargo y compromisos.	REPORTADO	2026-09-05 20:04:33.819074+00	2026-09-05 20:04:33.819074+00
112	21	20	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 20:04:39.485804+00	2026-09-05 20:04:39.485804+00
113	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:04:40.062435+00	2026-09-05 20:04:40.062435+00
114	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:04:40.48752+00	2026-09-05 20:04:40.48752+00
115	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:04:40.566369+00	2026-09-05 20:04:40.566369+00
116	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:04:40.703173+00	2026-09-05 20:04:40.703173+00
117	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 20:16:54.679587+00	2026-09-05 20:16:54.679587+00
118	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 20:16:55.38452+00	2026-09-05 20:16:55.38452+00
119	1	1	8	2026-09-05	\N	Incidente para validar alias nuevoEstado del frontend.	EN_INDAGACION	2026-09-05 20:16:55.715606+00	2026-09-05 20:16:55.815837+00
120	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 20:16:56.424995+00	2026-09-05 20:16:56.47978+00
121	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 20:16:56.851558+00	2026-09-05 20:16:56.851558+00
122	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 20:16:57.07022+00	2026-09-05 20:16:57.07022+00
123	1	1	8	2026-09-05	\N	Incidente para probar alias de descargo y compromisos.	REPORTADO	2026-09-05 20:16:57.222728+00	2026-09-05 20:16:57.222728+00
124	22	21	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 20:17:02.878299+00	2026-09-05 20:17:02.878299+00
125	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:17:04.042736+00	2026-09-05 20:17:04.042736+00
126	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:17:04.228037+00	2026-09-05 20:17:04.228037+00
127	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:17:04.308597+00	2026-09-05 20:17:04.308597+00
128	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:17:04.681117+00	2026-09-05 20:17:04.681117+00
129	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:18:27.564686+00	2026-09-05 20:18:27.564686+00
130	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:18:28.844058+00	2026-09-05 20:18:28.844058+00
131	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:18:29.03712+00	2026-09-05 20:18:29.03712+00
132	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:18:29.351928+00	2026-09-05 20:18:29.351928+00
133	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 20:19:52.571755+00	2026-09-05 20:19:52.571755+00
134	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 20:19:53.293191+00	2026-09-05 20:19:53.293191+00
135	1	1	8	2026-09-05	\N	Incidente para validar alias nuevoEstado del frontend.	EN_INDAGACION	2026-09-05 20:19:53.584739+00	2026-09-05 20:19:53.682841+00
136	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 20:19:54.053606+00	2026-09-05 20:19:54.125303+00
137	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 20:19:54.310059+00	2026-09-05 20:19:54.310059+00
138	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 20:19:54.45274+00	2026-09-05 20:19:54.45274+00
139	1	1	8	2026-09-05	\N	Incidente para probar alias de descargo y compromisos.	REPORTADO	2026-09-05 20:19:54.587183+00	2026-09-05 20:19:54.587183+00
140	23	22	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 20:19:59.62082+00	2026-09-05 20:19:59.62082+00
141	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:20:00.563593+00	2026-09-05 20:20:00.563593+00
142	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:20:00.997284+00	2026-09-05 20:20:00.997284+00
143	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:20:01.082184+00	2026-09-05 20:20:01.082184+00
144	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:20:01.276355+00	2026-09-05 20:20:01.276355+00
145	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 20:30:49.737492+00	2026-09-05 20:30:49.737492+00
146	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 20:30:50.540093+00	2026-09-05 20:30:50.540093+00
147	1	1	8	2026-09-05	\N	Incidente para validar alias nuevoEstado del frontend.	EN_INDAGACION	2026-09-05 20:30:50.882536+00	2026-09-05 20:30:50.97879+00
148	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 20:30:51.323832+00	2026-09-05 20:30:51.423632+00
149	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 20:30:51.64384+00	2026-09-05 20:30:51.64384+00
150	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 20:30:51.8145+00	2026-09-05 20:30:51.8145+00
151	1	1	8	2026-09-05	\N	Incidente para probar alias de descargo y compromisos.	REPORTADO	2026-09-05 20:30:51.970608+00	2026-09-05 20:30:51.970608+00
152	24	23	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 20:30:57.217016+00	2026-09-05 20:30:57.217016+00
153	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:30:58.472132+00	2026-09-05 20:30:58.472132+00
154	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:30:58.883121+00	2026-09-05 20:30:58.883121+00
155	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:30:58.952109+00	2026-09-05 20:30:58.952109+00
156	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:30:59.137287+00	2026-09-05 20:30:59.137287+00
157	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 20:34:02.17308+00	2026-09-05 20:34:02.17308+00
158	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 20:34:02.58681+00	2026-09-05 20:34:02.58681+00
159	1	1	8	2026-09-05	\N	Incidente para validar alias nuevoEstado del frontend.	EN_INDAGACION	2026-09-05 20:34:02.80001+00	2026-09-05 20:34:02.844273+00
160	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 20:34:03.120009+00	2026-09-05 20:34:03.159233+00
161	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 20:34:03.359993+00	2026-09-05 20:34:03.359993+00
162	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 20:34:03.479297+00	2026-09-05 20:34:03.479297+00
163	1	1	8	2026-09-05	\N	Incidente para probar alias de descargo y compromisos.	REPORTADO	2026-09-05 20:34:03.608399+00	2026-09-05 20:34:03.608399+00
164	25	24	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 20:34:06.714469+00	2026-09-05 20:34:06.714469+00
165	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:34:07.690219+00	2026-09-05 20:34:07.690219+00
166	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:34:07.95681+00	2026-09-05 20:34:07.95681+00
167	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:34:08.001212+00	2026-09-05 20:34:08.001212+00
168	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:34:08.088112+00	2026-09-05 20:34:08.088112+00
169	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 20:48:13.502469+00	2026-09-05 20:48:13.502469+00
170	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 20:48:13.93793+00	2026-09-05 20:48:13.93793+00
171	1	1	8	2026-09-05	\N	Incidente para validar alias nuevoEstado del frontend.	EN_INDAGACION	2026-09-05 20:48:14.143386+00	2026-09-05 20:48:14.208395+00
172	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 20:48:14.503528+00	2026-09-05 20:48:14.553752+00
173	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 20:48:14.734066+00	2026-09-05 20:48:14.734066+00
174	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 20:48:14.849824+00	2026-09-05 20:48:14.849824+00
175	1	1	8	2026-09-05	\N	Incidente para probar alias de descargo y compromisos.	REPORTADO	2026-09-05 20:48:14.968922+00	2026-09-05 20:48:14.968922+00
176	26	25	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 20:48:18.31572+00	2026-09-05 20:48:18.31572+00
177	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:48:19.188176+00	2026-09-05 20:48:19.188176+00
178	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:48:19.474782+00	2026-09-05 20:48:19.474782+00
179	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:48:19.530236+00	2026-09-05 20:48:19.530236+00
180	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:48:19.637274+00	2026-09-05 20:48:19.637274+00
181	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 20:49:15.613108+00	2026-09-05 20:49:15.613108+00
182	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 20:49:16.147238+00	2026-09-05 20:49:16.147238+00
183	1	1	8	2026-09-05	\N	Incidente para validar alias nuevoEstado del frontend.	EN_INDAGACION	2026-09-05 20:49:16.367142+00	2026-09-05 20:49:16.415189+00
184	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 20:49:16.673961+00	2026-09-05 20:49:16.716706+00
185	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 20:49:16.916954+00	2026-09-05 20:49:16.916954+00
186	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 20:49:17.100399+00	2026-09-05 20:49:17.100399+00
187	1	1	8	2026-09-05	\N	Incidente previo para cierre formal.	CERRADO	2026-09-05 20:49:17.288959+00	2026-09-05 20:49:17.329075+00
188	1	1	8	2026-09-05	\N	Incidente para probar alias de descargo y compromisos.	REPORTADO	2026-09-05 20:49:17.471779+00	2026-09-05 20:49:17.471779+00
189	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 20:49:53.670491+00	2026-09-05 20:49:53.670491+00
190	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 20:49:54.122515+00	2026-09-05 20:49:54.122515+00
191	1	1	8	2026-09-05	\N	Incidente para validar alias nuevoEstado del frontend.	EN_INDAGACION	2026-09-05 20:49:54.353803+00	2026-09-05 20:49:54.405448+00
192	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 20:49:54.639139+00	2026-09-05 20:49:54.676347+00
193	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 20:49:54.794262+00	2026-09-05 20:49:54.794262+00
194	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 20:49:54.932078+00	2026-09-05 20:49:54.932078+00
195	1	1	8	2026-09-05	\N	Incidente previo para cierre formal.	CERRADO	2026-09-05 20:49:55.051845+00	2026-09-05 20:49:55.08458+00
196	1	1	8	2026-09-05	\N	Incidente para probar alias de descargo y compromisos.	REPORTADO	2026-09-05 20:49:55.240296+00	2026-09-05 20:49:55.240296+00
197	27	26	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 20:49:58.327861+00	2026-09-05 20:49:58.328411+00
198	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:49:59.180714+00	2026-09-05 20:49:59.180714+00
199	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:49:59.534391+00	2026-09-05 20:49:59.534391+00
200	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:49:59.590316+00	2026-09-05 20:49:59.590316+00
201	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:49:59.682689+00	2026-09-05 20:49:59.682689+00
202	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 20:51:37.55163+00	2026-09-05 20:51:37.55163+00
203	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 20:51:38.252837+00	2026-09-05 20:51:38.252837+00
204	1	1	8	2026-09-05	\N	Incidente para validar alias nuevoEstado del frontend.	EN_INDAGACION	2026-09-05 20:51:38.447855+00	2026-09-05 20:51:38.49494+00
205	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 20:51:38.76563+00	2026-09-05 20:51:38.804432+00
206	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 20:51:38.95864+00	2026-09-05 20:51:38.95864+00
207	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 20:51:39.100599+00	2026-09-05 20:51:39.100599+00
208	1	1	8	2026-09-05	\N	Incidente previo para cierre formal.	CERRADO	2026-09-05 20:51:39.212353+00	2026-09-05 20:51:39.255547+00
209	1	1	8	2026-09-05	\N	Incidente para probar alias de descargo y compromisos.	REPORTADO	2026-09-05 20:51:39.424077+00	2026-09-05 20:51:39.424077+00
210	28	27	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 20:51:43.006544+00	2026-09-05 20:51:43.006544+00
211	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:51:43.98043+00	2026-09-05 20:51:43.98043+00
212	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:51:44.285843+00	2026-09-05 20:51:44.285843+00
213	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:51:44.329423+00	2026-09-05 20:51:44.329423+00
214	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 20:51:44.409648+00	2026-09-05 20:51:44.409648+00
215	1	1	8	2026-09-05	\N	Incidente con falta tipificada Tipo II para validar filtro de ley 1620.	REPORTADO	2026-09-05 22:31:13.160308+00	2026-09-05 22:31:13.160308+00
216	1	1	8	2026-09-05	\N	Incidente para actualizar descargos formales en comite de convivencia.	REPORTADO	2026-09-05 22:31:14.15193+00	2026-09-05 22:31:14.15193+00
217	1	1	8	2026-09-05	\N	Incidente para validar alias nuevoEstado del frontend.	EN_INDAGACION	2026-09-05 22:31:14.598854+00	2026-09-05 22:31:14.670635+00
218	1	1	8	2026-09-05	\N	Situacion de conflicto para verificar la transicion de estados del debido proceso.	EN_INDAGACION	2026-09-05 22:31:14.964977+00	2026-09-05 22:31:15.097863+00
219	1	1	7	2026-09-05	16:30:00	Altercado verbal y agresion fisica durante el recreo escolar en el patio central.	REPORTADO	2026-09-05 22:31:15.299009+00	2026-09-05 22:31:15.299009+00
220	1	1	8	2026-09-05	15:15:00	El estudiante es sorprendido destruyendo material institucional en el aula de clase.	REPORTADO	2026-09-05 22:31:15.449193+00	2026-09-05 22:31:15.449193+00
221	1	1	8	2026-09-05	\N	Incidente previo para cierre formal.	CERRADO	2026-09-05 22:31:15.572345+00	2026-09-05 22:31:15.61801+00
222	1	1	8	2026-09-05	\N	Incidente para probar alias de descargo y compromisos.	REPORTADO	2026-09-05 22:31:15.78516+00	2026-09-05 22:31:15.78516+00
223	1	1	8	2026-09-05	\N	Incidente para probar inmutabilidad de estado al cerrarse.	CERRADO	2026-09-05 22:31:15.954995+00	2026-09-05 22:31:16.007465+00
224	29	28	6	2026-09-05	15:15:00	Incidente para validación de expediente	EN_INDAGACION	2026-09-05 22:31:19.94366+00	2026-09-05 22:31:19.94366+00
225	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 22:31:20.906812+00	2026-09-05 22:31:20.906812+00
226	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 22:31:21.296958+00	2026-09-05 22:31:21.296958+00
227	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 22:31:21.368237+00	2026-09-05 22:31:21.368237+00
228	1	1	13	2026-09-05	15:15:00	Interrupción reiterada de clase y desacato pedagógico.	EN_INDAGACION	2026-09-05 22:31:21.493+00	2026-09-05 22:31:21.493+00
\.


--
-- Data for Name: lugares; Type: TABLE DATA; Schema: public; Owner: admin_disciplina
--

COPY public.lugares (id, nombre, descripcion, activo) FROM stdin;
1	Aula de Clase 101	Salon de ensenanza basica bloque academico piso 1	t
2	Aula de Clase 201	Salon de ensenanza media bloque academico piso 2	t
3	Patio Central	Area principal de recreo y formacion civica	t
4	Cafeteria Escolar	Zona comun de alimentacion y descanso	t
5	Canchas Deportivas	Area de deportes y actividades de educacion fisica	t
6	Biblioteca Institucional	Sala de lectura, consulta e investigacion	t
7	Laboratorio de Ciencias	Laboratorio de quimica, fisica y biologia	t
8	Pasillos y Graderias	Areas de transito peatonal comun	t
9	PATIO_EXP_1788583510226	Patio de descanso	t
10	PATIO_EXP_1788583568979	Patio de descanso	t
11	PATIO_EXP_1788584409150	Patio de descanso	t
12	PATIO_EXP_1788586291694	Patio de descanso	t
13	PATIO_EXP_1788587908318	Patio de descanso	t
14	PATIO_EXP_1788588008016	Patio de descanso	t
15	PATIO_EXP_1788609366130	Patio de descanso	t
16	PATIO_EXP_1788610969944	Patio de descanso	t
17	PATIO_EXP_1788611226775	Patio de descanso	t
18	PATIO_EXP_1788611278573	Patio de descanso	t
19	PATIO_EXP_1788637526445	Patio de descanso	t
20	PATIO_EXP_1788638679438	Patio de descanso	t
21	PATIO_EXP_1788639422817	Patio de descanso	t
22	PATIO_EXP_1788639599589	Patio de descanso	t
23	PATIO_EXP_1788640257171	Patio de descanso	t
24	PATIO_EXP_1788640446691	Patio de descanso	t
25	PATIO_EXP_1788641298296	Patio de descanso	t
26	PATIO_EXP_1788641398311	Patio de descanso	t
27	PATIO_EXP_1788641502987	Patio de descanso	t
28	PATIO_EXP_1788647479922	Patio de descanso	t
\.


--
-- Data for Name: matriculas_estudiante; Type: TABLE DATA; Schema: public; Owner: admin_disciplina
--

COPY public.matriculas_estudiante (id, estudiante_id, anio_lectivo, grado, grupo, jornada, estado_matricula, created_at) FROM stdin;
1	1	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:29:55.820769+00
2	2	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:29:55.868719+00
3	3	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:57.810383+00
4	4	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:57.830988+00
5	5	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:57.849397+00
6	6	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:57.869885+00
7	7	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:57.888743+00
8	8	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:57.907102+00
9	9	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:57.924988+00
10	10	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:57.942056+00
11	11	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:57.963833+00
12	12	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:57.980077+00
13	13	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.001318+00
14	14	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.019399+00
15	15	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.036838+00
16	16	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.055123+00
17	17	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.072485+00
18	18	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.086791+00
19	19	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.103976+00
20	20	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.121055+00
21	21	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.138276+00
22	22	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.156262+00
23	23	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.188514+00
24	24	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.20525+00
25	25	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.219132+00
26	26	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.236285+00
27	27	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.253184+00
28	28	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.270562+00
29	29	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.284579+00
30	30	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.299393+00
31	31	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.314272+00
32	32	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.329373+00
33	33	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.342415+00
34	34	2026	6	1	DIURNA	ACTIVO	2026-09-04 14:30:58.359527+00
35	35	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.378552+00
36	36	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.396706+00
37	37	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.415698+00
38	38	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.433093+00
39	39	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.446813+00
40	40	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.474695+00
41	41	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.491837+00
42	42	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.506029+00
43	43	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.520191+00
44	44	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.536302+00
45	45	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.549541+00
46	46	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.563909+00
47	47	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.577404+00
48	48	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.592214+00
49	49	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.605737+00
50	50	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.617952+00
51	51	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.632164+00
52	52	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.643367+00
53	53	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.657026+00
54	54	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.668498+00
55	55	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.680901+00
56	56	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.694127+00
57	57	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.706454+00
58	58	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.720589+00
59	59	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.73823+00
60	60	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.763284+00
61	61	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.826987+00
62	62	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.873496+00
63	63	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.893744+00
64	64	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.914123+00
65	65	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.968925+00
66	66	2026	6	2	DIURNA	ACTIVO	2026-09-04 14:30:58.984419+00
67	67	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.000242+00
68	68	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.036088+00
69	69	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.054363+00
70	70	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.074305+00
71	71	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.09282+00
72	72	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.109829+00
73	73	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.128346+00
74	74	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.144838+00
75	75	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.161047+00
76	76	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.173048+00
77	77	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.184752+00
78	78	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.196758+00
79	79	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.206495+00
80	80	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.218788+00
81	81	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.230271+00
82	82	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.242968+00
83	83	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.254169+00
84	84	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.26661+00
85	85	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.276466+00
86	86	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.287629+00
87	87	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.299223+00
88	88	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.310381+00
89	89	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.322076+00
90	90	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.33859+00
91	91	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.359119+00
92	92	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.381746+00
93	93	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.407027+00
94	94	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.435509+00
95	95	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.45622+00
96	96	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.470511+00
97	97	2026	6	3	DIURNA	ACTIVO	2026-09-04 14:30:59.48305+00
98	98	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.495766+00
99	99	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.508815+00
100	100	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.520069+00
101	101	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.533431+00
102	102	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.554967+00
103	103	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.566449+00
104	104	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.578342+00
105	105	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.588958+00
106	106	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.600026+00
107	107	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.609891+00
108	108	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.619486+00
109	109	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.631734+00
110	110	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.644234+00
111	111	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.653163+00
112	112	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.664861+00
113	113	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.674705+00
114	114	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.684858+00
115	115	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.695504+00
116	116	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.705216+00
117	117	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.715476+00
118	118	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.727301+00
119	119	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.741887+00
120	120	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.754017+00
121	121	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.766101+00
122	122	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.777654+00
123	123	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.788611+00
124	124	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.799759+00
125	125	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.810779+00
126	126	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.820669+00
127	127	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.833126+00
128	128	2026	6	4	DIURNA	ACTIVO	2026-09-04 14:30:59.845937+00
129	129	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:30:59.858333+00
130	130	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:30:59.870292+00
131	131	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:30:59.881994+00
132	132	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:30:59.893626+00
133	133	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:30:59.905273+00
134	134	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:30:59.916005+00
135	135	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:30:59.927367+00
136	136	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:30:59.940067+00
137	137	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:30:59.958388+00
138	138	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:30:59.968896+00
139	139	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:30:59.979591+00
140	140	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:30:59.990478+00
141	141	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.003536+00
142	142	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.016534+00
143	143	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.034013+00
144	144	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.055622+00
145	145	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.07858+00
146	146	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.100522+00
147	147	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.12047+00
148	148	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.141967+00
149	149	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.163928+00
150	150	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.184895+00
151	151	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.205733+00
152	152	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.223356+00
153	153	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.239719+00
154	154	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.261872+00
155	155	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.281968+00
156	156	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.305377+00
157	157	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.326811+00
158	158	2026	6	5	DIURNA	ACTIVO	2026-09-04 14:31:00.345561+00
159	159	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.36487+00
160	160	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.382678+00
161	161	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.402464+00
162	162	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.420174+00
163	163	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.45112+00
164	164	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.469317+00
165	165	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.48216+00
166	166	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.497364+00
167	167	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.508219+00
168	168	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.518868+00
169	169	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.53157+00
170	170	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.543385+00
171	171	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.560898+00
172	172	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.572556+00
173	173	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.584475+00
174	174	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.59595+00
175	175	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.604919+00
176	176	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.614073+00
177	177	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.625083+00
178	178	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.634887+00
179	179	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.644965+00
180	180	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.658683+00
181	181	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.671716+00
182	182	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.682307+00
183	183	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.694109+00
184	184	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.703466+00
185	185	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.713914+00
186	186	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.724698+00
187	187	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.73377+00
188	188	2026	7	1	DIURNA	ACTIVO	2026-09-04 14:31:00.742738+00
189	189	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.75406+00
190	190	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.774491+00
191	191	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.785594+00
192	192	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.797418+00
193	193	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.808965+00
194	194	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.820955+00
195	195	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.83282+00
196	196	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.842294+00
197	197	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.852701+00
198	198	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.865673+00
199	199	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.877036+00
200	200	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.886076+00
201	201	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.897437+00
202	202	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.907186+00
203	203	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.916879+00
204	204	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.927701+00
205	205	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.937531+00
206	206	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.946858+00
207	207	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.957458+00
208	208	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.970698+00
209	209	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.979478+00
210	210	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.989015+00
211	211	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:00.997626+00
212	212	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:01.007751+00
213	213	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:01.019527+00
214	214	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:01.030645+00
215	215	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:01.040366+00
216	216	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:01.049862+00
217	217	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:01.062976+00
218	218	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:01.080312+00
219	219	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:01.099262+00
220	220	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:01.118739+00
221	221	2026	7	2	DIURNA	ACTIVO	2026-09-04 14:31:01.139261+00
222	222	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.159995+00
223	223	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.181434+00
224	224	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.202255+00
225	225	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.224339+00
226	226	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.244367+00
227	227	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.265633+00
228	228	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.299087+00
229	229	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.314454+00
230	230	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.326203+00
231	231	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.337497+00
232	232	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.347677+00
233	233	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.359359+00
234	234	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.371068+00
235	235	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.3796+00
236	236	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.390819+00
237	237	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.400754+00
238	238	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.410889+00
239	239	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.421542+00
240	240	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.431815+00
241	241	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.444603+00
242	242	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.456733+00
243	243	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.468395+00
244	244	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.478964+00
245	245	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.491843+00
246	246	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.503183+00
247	247	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.515046+00
248	248	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.527559+00
249	249	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.539888+00
250	250	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.566594+00
251	251	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.582143+00
252	252	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.600526+00
253	253	2026	7	3	DIURNA	ACTIVO	2026-09-04 14:31:01.617455+00
254	254	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.631768+00
255	255	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.659341+00
256	256	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.674807+00
257	257	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.6919+00
258	258	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.71153+00
259	259	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.729488+00
260	260	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.742218+00
261	261	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.75841+00
262	262	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.771602+00
263	263	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.786107+00
264	264	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.801728+00
265	265	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.813809+00
266	266	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.825608+00
267	267	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.837067+00
268	268	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.848595+00
269	269	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.863262+00
270	270	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.875171+00
271	271	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.890048+00
272	272	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.902878+00
273	273	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.916352+00
274	274	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.930447+00
275	275	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.941366+00
276	276	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.951235+00
277	277	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.964091+00
278	278	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.973888+00
279	279	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.983802+00
280	280	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:01.995077+00
281	281	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:02.005621+00
282	282	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:02.015216+00
283	283	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:02.025377+00
284	284	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:02.034445+00
285	285	2026	7	4	DIURNA	ACTIVO	2026-09-04 14:31:02.04486+00
286	286	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.056384+00
287	287	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.074152+00
288	288	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.084326+00
289	289	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.094859+00
290	290	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.105215+00
291	291	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.115519+00
292	292	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.125894+00
293	293	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.136098+00
294	294	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.147401+00
295	295	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.160433+00
296	296	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.175782+00
297	297	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.18855+00
298	298	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.20049+00
299	299	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.211345+00
300	300	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.223569+00
301	301	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.234436+00
302	302	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.245122+00
303	303	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.256576+00
304	304	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.268679+00
305	305	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.278275+00
306	306	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.288541+00
307	307	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.300236+00
308	308	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.31136+00
309	309	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.321252+00
310	310	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.331814+00
311	311	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.341724+00
312	312	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.352102+00
313	313	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.365829+00
314	314	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.376445+00
315	315	2026	7	5	DIURNA	ACTIVO	2026-09-04 14:31:02.386413+00
316	316	2026	7	8	DIURNA	ACTIVO	2026-09-04 14:31:02.397693+00
317	317	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.409473+00
318	318	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.432427+00
319	319	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.448826+00
320	320	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.467994+00
321	321	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.478753+00
322	322	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.489068+00
323	323	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.501123+00
324	324	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.513345+00
325	325	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.524481+00
326	326	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.533532+00
327	327	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.542222+00
328	328	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.550175+00
329	329	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.561052+00
330	330	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.572128+00
331	331	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.583407+00
332	332	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.596012+00
333	333	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.606243+00
334	334	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.616443+00
335	335	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.628285+00
336	336	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.639865+00
337	337	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.649707+00
338	338	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.66192+00
339	339	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.67451+00
340	340	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.6926+00
341	341	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.717181+00
342	342	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.739823+00
343	343	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.752139+00
344	344	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.764692+00
345	345	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.798358+00
346	346	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.812279+00
347	347	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.825635+00
348	348	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.836161+00
349	349	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.848754+00
350	350	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.861409+00
351	351	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.875166+00
352	352	2026	8	1	DIURNA	ACTIVO	2026-09-04 14:31:02.886341+00
353	353	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:02.896466+00
354	354	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:02.905184+00
355	355	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:02.915106+00
356	356	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:02.926038+00
357	357	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:02.935636+00
358	358	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:02.943073+00
359	359	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:02.952989+00
360	360	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:02.962221+00
361	361	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:02.97403+00
362	362	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:02.985185+00
363	363	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:02.997491+00
364	364	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.009499+00
365	365	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.020715+00
366	366	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.029917+00
367	367	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.04832+00
368	368	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.068952+00
369	369	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.091781+00
370	370	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.112938+00
371	371	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.134111+00
372	372	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.154046+00
373	373	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.175983+00
374	374	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.196354+00
375	375	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.216009+00
376	376	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.234553+00
377	377	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.253879+00
378	378	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.279106+00
379	379	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.308599+00
380	380	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.327649+00
381	381	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.344384+00
382	382	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.362067+00
383	383	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.378315+00
384	384	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.393419+00
385	385	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.407634+00
386	386	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.420168+00
387	387	2026	8	2	DIURNA	ACTIVO	2026-09-04 14:31:03.432169+00
388	388	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.445616+00
389	389	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.460024+00
390	390	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.469651+00
391	391	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.479322+00
392	392	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.489138+00
393	393	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.499497+00
394	394	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.521357+00
395	395	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.531672+00
396	396	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.540491+00
397	397	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.551452+00
398	398	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.561539+00
399	399	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.570219+00
400	400	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.580558+00
401	401	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.591811+00
402	402	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.600799+00
403	403	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.608745+00
404	404	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.618385+00
405	405	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.629542+00
406	406	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.639804+00
407	407	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.64982+00
408	408	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.703088+00
409	409	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.714903+00
410	410	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.726919+00
411	411	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.740159+00
412	412	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.755179+00
413	413	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.771591+00
414	414	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.783794+00
415	415	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.796138+00
416	416	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.806518+00
417	417	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.817201+00
418	418	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.829057+00
419	419	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.840134+00
420	420	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.850508+00
421	421	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.865403+00
422	422	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.875371+00
423	423	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.88398+00
424	424	2026	8	3	DIURNA	ACTIVO	2026-09-04 14:31:03.894793+00
425	425	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:03.904578+00
426	426	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:03.913977+00
427	427	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:03.925068+00
428	428	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:03.935284+00
429	429	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:03.946422+00
430	430	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:03.960139+00
431	431	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:03.979414+00
432	432	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:03.99051+00
433	433	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.000499+00
434	434	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.011415+00
435	435	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.020902+00
436	436	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.030742+00
437	437	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.043378+00
438	438	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.053698+00
439	439	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.06599+00
440	440	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.076854+00
441	441	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.089426+00
442	442	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.100572+00
443	443	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.111197+00
444	444	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.122278+00
445	445	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.133078+00
446	446	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.142707+00
447	447	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.155369+00
448	448	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.166876+00
449	449	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.177091+00
450	450	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.187034+00
451	451	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.199018+00
452	452	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.20896+00
453	453	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.217705+00
454	454	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.227416+00
455	455	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.236475+00
456	456	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.245675+00
457	457	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.257046+00
458	458	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.267938+00
459	459	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.277529+00
460	460	2026	8	4	DIURNA	ACTIVO	2026-09-04 14:31:04.287557+00
461	461	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.296634+00
462	462	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.306628+00
463	463	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.316257+00
464	464	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.327117+00
465	465	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.335646+00
466	466	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.345209+00
467	467	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.355717+00
468	468	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.367882+00
469	469	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.380047+00
470	470	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.39051+00
471	471	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.398722+00
472	472	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.40803+00
473	473	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.419004+00
474	474	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.430102+00
475	475	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.44145+00
476	476	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.463093+00
477	477	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.47799+00
478	478	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.488278+00
479	479	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.498231+00
480	480	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.511116+00
481	481	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.522726+00
482	482	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.533964+00
483	483	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.544725+00
484	484	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.555093+00
485	485	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.564455+00
486	486	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.578091+00
487	487	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.589484+00
488	488	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.59943+00
489	489	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.608527+00
491	491	2026	9	1	DIURNA	ACTIVO	2026-09-04 14:31:04.628442+00
492	492	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.637054+00
493	493	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.646984+00
494	494	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.657161+00
495	495	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.666192+00
496	496	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.677412+00
497	497	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.687403+00
498	498	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.69509+00
499	499	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.705461+00
500	500	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.715409+00
501	501	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.727376+00
502	502	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.738392+00
503	503	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.748235+00
504	504	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.760622+00
505	505	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.78765+00
506	506	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.799444+00
507	507	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.809942+00
508	508	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.822203+00
509	509	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.832612+00
510	510	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.845295+00
511	511	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.868337+00
512	512	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.897151+00
513	513	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.91507+00
514	514	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.930379+00
515	515	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.943125+00
516	516	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.957477+00
517	517	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.97688+00
518	518	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:04.999158+00
519	519	2026	9	2	DIURNA	ACTIVO	2026-09-04 14:31:05.017288+00
520	520	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.034823+00
521	521	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.050807+00
522	522	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.065673+00
523	523	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.077657+00
524	524	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.094543+00
525	525	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.108971+00
526	526	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.123681+00
527	527	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.13761+00
528	528	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.150695+00
529	529	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.164668+00
530	530	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.179269+00
531	531	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.196864+00
532	532	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.210813+00
533	533	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.223601+00
534	534	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.234089+00
535	535	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.243933+00
536	536	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.254457+00
537	537	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.263019+00
538	538	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.272698+00
539	539	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.28232+00
540	540	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.295836+00
541	541	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.307026+00
542	542	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.318747+00
543	543	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.329816+00
544	544	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.340536+00
545	545	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.349861+00
546	546	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.361112+00
547	547	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.37313+00
548	548	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.4236+00
549	549	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.434647+00
550	550	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.446354+00
551	551	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.46197+00
552	552	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.473375+00
553	553	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.48526+00
490	490	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:04.619702+00
554	554	2026	9	3	DIURNA	ACTIVO	2026-09-04 14:31:05.580313+00
555	555	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.606709+00
556	556	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.628207+00
557	557	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.649532+00
558	558	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.67319+00
559	559	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.693921+00
560	560	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.706461+00
561	561	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.721299+00
562	562	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.738881+00
563	563	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.753057+00
564	564	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.769422+00
565	565	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.781379+00
566	566	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.793081+00
567	567	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.812307+00
568	568	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.831413+00
569	569	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.853266+00
570	570	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.877197+00
571	571	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.898133+00
572	572	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.919864+00
573	573	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.941091+00
574	574	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.962459+00
575	575	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.98245+00
576	576	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:05.995796+00
577	577	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:06.012569+00
578	578	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:06.026244+00
579	579	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:06.039052+00
580	580	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:06.04926+00
581	581	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:06.059549+00
582	582	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:06.070514+00
583	583	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:06.079957+00
584	584	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:06.09027+00
585	585	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:06.098564+00
586	586	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:06.108477+00
587	587	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:06.122191+00
588	588	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:06.130789+00
589	589	2026	9	4	DIURNA	ACTIVO	2026-09-04 14:31:06.139988+00
590	590	2026	9	5	DIURNA	ACTIVO	2026-09-04 14:31:06.148724+00
591	591	2026	9	5	DIURNA	ACTIVO	2026-09-04 14:31:06.157911+00
592	592	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.175479+00
593	593	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.189202+00
594	594	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.19981+00
595	595	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.21127+00
596	596	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.22224+00
597	597	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.230795+00
598	598	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.240478+00
599	599	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.247922+00
600	600	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.2573+00
601	601	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.267715+00
602	602	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.27879+00
603	603	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.288853+00
604	604	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.296588+00
605	605	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.306573+00
606	606	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.315541+00
607	607	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.325905+00
608	608	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.336783+00
609	609	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.344859+00
610	610	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.354241+00
611	611	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.364337+00
612	612	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.377073+00
613	613	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.38657+00
614	614	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.396769+00
615	615	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.405948+00
616	616	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.414165+00
617	617	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.423529+00
618	618	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.43222+00
619	619	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.442394+00
620	620	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.455321+00
621	621	2026	10	1	DIURNA	ACTIVO	2026-09-04 14:31:06.470538+00
622	622	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.485452+00
623	623	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.509125+00
624	624	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.522044+00
625	625	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.540905+00
626	626	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.564502+00
627	627	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.585366+00
628	628	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.59979+00
629	629	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.620133+00
630	630	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.639116+00
631	631	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.661496+00
632	632	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.68231+00
633	633	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.742239+00
634	634	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.765854+00
635	635	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.787071+00
636	636	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.808353+00
637	637	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.8289+00
638	638	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.876422+00
639	639	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.898177+00
640	640	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.913131+00
641	641	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.927634+00
642	642	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.941283+00
643	643	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.957017+00
644	644	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.967216+00
645	645	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.979021+00
646	646	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:06.991298+00
647	647	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:07.000411+00
648	648	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:07.008972+00
649	649	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:07.019001+00
650	650	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:07.027675+00
651	651	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:07.035914+00
652	652	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:07.044781+00
653	653	2026	10	2	DIURNA	ACTIVO	2026-09-04 14:31:07.054355+00
654	654	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.063531+00
655	655	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.086779+00
656	656	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.096947+00
657	657	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.107382+00
658	658	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.121602+00
659	659	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.132901+00
660	660	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.157197+00
661	661	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.170957+00
662	662	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.182039+00
663	663	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.193655+00
664	664	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.203976+00
665	665	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.212734+00
666	666	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.223037+00
667	667	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.235301+00
668	668	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.244669+00
669	669	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.255571+00
670	670	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.26501+00
671	671	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.273417+00
672	672	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.291939+00
673	673	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.303382+00
674	674	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.312675+00
675	675	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.32258+00
676	676	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.330684+00
677	677	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.338948+00
678	678	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.347509+00
679	679	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.356336+00
680	680	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.364254+00
681	681	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.372841+00
682	682	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.383773+00
683	683	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.3931+00
684	684	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.401742+00
685	685	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.410609+00
686	686	2026	10	3	DIURNA	ACTIVO	2026-09-04 14:31:07.421024+00
687	687	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.42903+00
688	688	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.438242+00
689	689	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.447871+00
690	690	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.46131+00
691	691	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.478857+00
692	692	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.498168+00
693	693	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.51757+00
694	694	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.537087+00
695	695	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.556083+00
696	696	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.581774+00
697	697	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.604442+00
698	698	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.621879+00
699	699	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.639532+00
700	700	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.657179+00
701	701	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.67592+00
702	702	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.697602+00
703	703	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.720398+00
704	704	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.740703+00
705	705	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.759201+00
706	706	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.779334+00
707	707	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.801002+00
708	708	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.822585+00
709	709	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.841759+00
710	710	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.859679+00
711	711	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.878539+00
712	712	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.897892+00
713	713	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.914694+00
714	714	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.93368+00
715	715	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.953331+00
716	716	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.973304+00
717	717	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:07.992082+00
718	718	2026	11	1	DIURNA	ACTIVO	2026-09-04 14:31:08.010081+00
719	719	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.026465+00
720	720	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.047281+00
721	721	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.068174+00
722	722	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.109151+00
723	723	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.128793+00
724	724	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.147469+00
725	725	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.16692+00
726	726	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.186536+00
727	727	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.200811+00
728	728	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.21657+00
729	729	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.228053+00
730	730	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.238022+00
731	731	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.247104+00
732	732	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.256564+00
733	733	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.264361+00
734	734	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.275313+00
735	735	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.284942+00
736	736	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.293691+00
737	737	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.302999+00
738	738	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.311532+00
739	739	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.324743+00
740	740	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.333921+00
741	741	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.343317+00
742	742	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.352251+00
743	743	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.359976+00
744	744	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.368537+00
745	745	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.378911+00
746	746	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.389149+00
747	747	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.396809+00
748	748	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.40509+00
749	749	2026	11	2	DIURNA	ACTIVO	2026-09-04 14:31:08.413168+00
750	750	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.4223+00
751	751	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.430671+00
752	752	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.439762+00
753	753	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.450102+00
754	754	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.470178+00
755	755	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.488342+00
756	756	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.497229+00
757	757	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.50644+00
758	758	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.517304+00
759	759	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.526799+00
760	760	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.536685+00
761	761	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.547632+00
762	762	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.559175+00
763	763	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.570608+00
764	764	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.580831+00
765	765	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.626025+00
766	766	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.646912+00
767	767	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.67154+00
768	768	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.693664+00
769	769	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.71384+00
770	770	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.734466+00
771	771	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.753285+00
772	772	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.76859+00
773	773	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.785014+00
774	774	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.800414+00
775	775	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.818716+00
776	776	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.835145+00
777	777	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.850237+00
778	778	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.867537+00
779	779	2026	11	3	DIURNA	ACTIVO	2026-09-04 14:31:08.892994+00
780	780	2026	11	1102	TARDE	ACTIVO	2026-09-04 15:48:52.304891+00
781	784	2026	10	1001	MANANA	ACTIVO	2026-09-04 16:01:28.550589+00
782	787	2026	11	1102	TARDE	ACTIVO	2026-09-04 16:02:37.978882+00
783	791	2026	11	1101	DIURNA	ACTIVO	2026-09-04 20:20:56.645587+00
784	792	2026	07	0701	DIURNA	ACTIVO	2026-09-04 20:20:57.485516+00
785	793	2026	08	0801	DIURNA	ACTIVO	2026-09-04 20:20:58.108336+00
786	794	2026	09	0901	DIURNA	ACTIVO	2026-09-04 20:20:58.485717+00
787	795	2026	09	0902	DIURNA	ACTIVO	2026-09-04 20:20:58.514034+00
788	796	2026	09	0901	DIURNA	ACTIVO	2026-09-04 20:20:58.551029+00
789	797	2026	10	1001	DIURNA	ACTIVO	2026-09-04 20:20:58.865746+00
790	798	2026	11	1102	TARDE	ACTIVO	2026-09-04 20:20:59.245294+00
791	802	2026	11	1101	DIURNA	ACTIVO	2026-09-04 20:22:27.923149+00
792	803	2026	07	0701	DIURNA	ACTIVO	2026-09-04 20:22:28.93393+00
793	804	2026	08	0801	DIURNA	ACTIVO	2026-09-04 20:22:29.304287+00
794	805	2026	09	0901	DIURNA	ACTIVO	2026-09-04 20:22:29.604302+00
795	806	2026	09	0902	DIURNA	ACTIVO	2026-09-04 20:22:29.62516+00
796	807	2026	09	0901	DIURNA	ACTIVO	2026-09-04 20:22:29.645624+00
797	808	2026	10	1001	DIURNA	ACTIVO	2026-09-04 20:22:29.920857+00
798	809	2026	11	1101	DIURNA	ACTIVO	2026-09-04 20:23:03.632829+00
799	810	2026	07	0701	DIURNA	ACTIVO	2026-09-04 20:23:04.134702+00
800	811	2026	08	0801	DIURNA	ACTIVO	2026-09-04 20:23:04.47204+00
801	812	2026	09	0901	DIURNA	ACTIVO	2026-09-04 20:23:04.711386+00
802	813	2026	09	0902	DIURNA	ACTIVO	2026-09-04 20:23:04.743782+00
803	814	2026	09	0901	DIURNA	ACTIVO	2026-09-04 20:23:04.760153+00
804	815	2026	10	1001	DIURNA	ACTIVO	2026-09-04 20:23:04.998004+00
805	816	2026	11	1102	TARDE	ACTIVO	2026-09-04 20:23:05.230211+00
806	820	2026	11	1101	DIURNA	ACTIVO	2026-09-05 03:59:34.952738+00
807	821	2026	07	0701	DIURNA	ACTIVO	2026-09-05 03:59:35.692329+00
808	822	2026	08	0801	DIURNA	ACTIVO	2026-09-05 03:59:36.125163+00
809	823	2026	09	0901	DIURNA	ACTIVO	2026-09-05 03:59:36.37029+00
810	824	2026	09	0902	DIURNA	ACTIVO	2026-09-05 03:59:36.387257+00
811	825	2026	09	0901	DIURNA	ACTIVO	2026-09-05 03:59:36.404239+00
812	826	2026	10	1001	DIURNA	ACTIVO	2026-09-05 03:59:36.657973+00
813	827	2026	11	1102	TARDE	ACTIVO	2026-09-05 03:59:36.909303+00
814	831	2026	11	1101	DIURNA	ACTIVO	2026-09-05 04:21:41.911991+00
815	832	2026	06	0601	DIURNA	ACTIVO	2026-09-05 04:21:42.501297+00
816	833	2026	07	0701	DIURNA	ACTIVO	2026-09-05 04:21:43.337471+00
817	834	2026	08	0801	DIURNA	ACTIVO	2026-09-05 04:21:43.773259+00
818	835	2026	09	0901	DIURNA	ACTIVO	2026-09-05 04:21:43.982788+00
819	836	2026	09	0902	DIURNA	ACTIVO	2026-09-05 04:21:43.998047+00
820	837	2026	09	0901	DIURNA	ACTIVO	2026-09-05 04:21:44.013465+00
821	838	2026	10	1001	DIURNA	ACTIVO	2026-09-05 04:21:44.210163+00
822	839	2026	11	1102	TARDE	ACTIVO	2026-09-05 04:21:44.412214+00
823	843	2026	11	1101	DIURNA	ACTIVO	2026-09-05 04:44:07.457606+00
824	844	2026	06	0601	DIURNA	ACTIVO	2026-09-05 04:44:08.005031+00
825	845	2026	07	0701	DIURNA	ACTIVO	2026-09-05 04:44:08.763296+00
826	846	2026	08	0801	DIURNA	ACTIVO	2026-09-05 04:44:09.184477+00
827	847	2026	09	0901	DIURNA	ACTIVO	2026-09-05 04:44:09.400318+00
828	848	2026	09	0902	DIURNA	ACTIVO	2026-09-05 04:44:09.420152+00
829	849	2026	09	0901	DIURNA	ACTIVO	2026-09-05 04:44:09.455749+00
830	850	2026	10	1001	DIURNA	ACTIVO	2026-09-05 04:44:09.719308+00
831	851	2026	11	1101	DIURNA	ACTIVO	2026-09-05 04:45:03.043365+00
832	852	2026	06	0601	DIURNA	ACTIVO	2026-09-05 04:45:03.487532+00
833	853	2026	07	0701	DIURNA	ACTIVO	2026-09-05 04:45:04.174218+00
834	854	2026	08	0801	DIURNA	ACTIVO	2026-09-05 04:45:04.598381+00
835	855	2026	09	0901	DIURNA	ACTIVO	2026-09-05 04:45:04.850521+00
836	856	2026	09	0902	DIURNA	ACTIVO	2026-09-05 04:45:04.882794+00
837	857	2026	09	0901	DIURNA	ACTIVO	2026-09-05 04:45:04.901704+00
838	858	2026	10	1001	DIURNA	ACTIVO	2026-09-05 04:45:05.101119+00
839	859	2026	11	1102	TARDE	ACTIVO	2026-09-05 04:45:05.335116+00
840	863	2025	07	0701	MANANA	ACTIVO	2026-09-05 04:45:10.170598+00
841	863	2026	08	0802	MANANA	ACTIVO	2026-09-05 04:45:10.184856+00
842	864	2026	11	1101	DIURNA	ACTIVO	2026-09-05 04:46:01.802197+00
843	865	2026	06	0601	DIURNA	ACTIVO	2026-09-05 04:46:02.299299+00
844	866	2026	07	0701	DIURNA	ACTIVO	2026-09-05 04:46:02.991636+00
845	867	2026	08	0801	DIURNA	ACTIVO	2026-09-05 04:46:03.430641+00
846	868	2026	09	0901	DIURNA	ACTIVO	2026-09-05 04:46:03.740228+00
847	869	2026	09	0902	DIURNA	ACTIVO	2026-09-05 04:46:03.77532+00
848	870	2026	09	0901	DIURNA	ACTIVO	2026-09-05 04:46:03.798009+00
849	871	2026	10	1001	DIURNA	ACTIVO	2026-09-05 04:46:04.029679+00
850	872	2026	11	1102	TARDE	ACTIVO	2026-09-05 04:46:04.291523+00
851	876	2025	07	0701	MANANA	ACTIVO	2026-09-05 04:46:08.93704+00
852	876	2026	08	0802	MANANA	ACTIVO	2026-09-05 04:46:08.955421+00
853	877	2026	11	1101	DIURNA	ACTIVO	2026-09-05 05:00:01.961161+00
854	878	2026	06	0601	DIURNA	ACTIVO	2026-09-05 05:00:02.311048+00
855	879	2026	07	0701	DIURNA	ACTIVO	2026-09-05 05:00:03.16069+00
856	880	2026	08	0801	DIURNA	ACTIVO	2026-09-05 05:00:03.547226+00
857	881	2026	09	0901	DIURNA	ACTIVO	2026-09-05 05:00:03.794566+00
858	882	2026	09	0902	DIURNA	ACTIVO	2026-09-05 05:00:03.816981+00
859	883	2026	09	0901	DIURNA	ACTIVO	2026-09-05 05:00:03.835297+00
860	884	2026	10	1001	DIURNA	ACTIVO	2026-09-05 05:00:04.050648+00
861	885	2026	11	1102	TARDE	ACTIVO	2026-09-05 05:00:04.258149+00
862	889	2025	07	0701	MANANA	ACTIVO	2026-09-05 05:00:09.108416+00
863	889	2026	08	0802	MANANA	ACTIVO	2026-09-05 05:00:09.120711+00
864	890	2026	11	1101	DIURNA	ACTIVO	2026-09-05 05:31:27.696753+00
865	891	2026	06	0601	DIURNA	ACTIVO	2026-09-05 05:31:27.8256+00
866	892	2026	07	0701	DIURNA	ACTIVO	2026-09-05 05:31:28.190332+00
867	893	2026	08	0801	DIURNA	ACTIVO	2026-09-05 05:31:28.358321+00
868	894	2026	09	0901	DIURNA	ACTIVO	2026-09-05 05:31:28.449882+00
869	895	2026	09	0902	DIURNA	ACTIVO	2026-09-05 05:31:28.474967+00
870	896	2026	09	0901	DIURNA	ACTIVO	2026-09-05 05:31:28.484157+00
871	897	2026	10	1001	DIURNA	ACTIVO	2026-09-05 05:31:28.580997+00
872	898	2026	11	1102	TARDE	ACTIVO	2026-09-05 05:31:28.70513+00
873	902	2025	07	0701	MANANA	ACTIVO	2026-09-05 05:31:31.626495+00
874	902	2026	08	0802	MANANA	ACTIVO	2026-09-05 05:31:31.640972+00
875	903	2026	11	1101	DIURNA	ACTIVO	2026-09-05 05:58:23.954577+00
876	904	2026	06	0601	DIURNA	ACTIVO	2026-09-05 05:58:24.176835+00
877	905	2026	07	0701	DIURNA	ACTIVO	2026-09-05 05:58:24.406703+00
878	906	2026	08	0801	DIURNA	ACTIVO	2026-09-05 05:58:24.604216+00
879	907	2026	09	0901	DIURNA	ACTIVO	2026-09-05 05:58:24.688903+00
880	908	2026	09	0902	DIURNA	ACTIVO	2026-09-05 05:58:24.703419+00
881	909	2026	09	0901	DIURNA	ACTIVO	2026-09-05 05:58:24.719052+00
882	910	2026	10	1001	DIURNA	ACTIVO	2026-09-05 05:58:24.806177+00
883	911	2026	11	1102	TARDE	ACTIVO	2026-09-05 05:58:24.973338+00
884	915	2025	07	0701	MANANA	ACTIVO	2026-09-05 05:58:28.298228+00
885	915	2026	08	0802	MANANA	ACTIVO	2026-09-05 05:58:28.305054+00
886	916	2026	11	1101	DIURNA	ACTIVO	2026-09-05 05:59:25.089824+00
887	917	2026	06	0601	DIURNA	ACTIVO	2026-09-05 05:59:25.623802+00
888	918	2026	07	0701	DIURNA	ACTIVO	2026-09-05 05:59:26.185322+00
889	919	2026	08	0801	DIURNA	ACTIVO	2026-09-05 05:59:26.493976+00
890	920	2026	09	0901	DIURNA	ACTIVO	2026-09-05 05:59:26.71109+00
891	921	2026	09	0902	DIURNA	ACTIVO	2026-09-05 05:59:26.72937+00
892	922	2026	09	0901	DIURNA	ACTIVO	2026-09-05 05:59:26.744058+00
893	923	2026	10	1001	DIURNA	ACTIVO	2026-09-05 05:59:26.917819+00
894	924	2026	11	1101	DIURNA	ACTIVO	2026-09-05 06:00:03.271+00
895	925	2026	06	0601	DIURNA	ACTIVO	2026-09-05 06:00:03.432184+00
896	926	2026	07	0701	DIURNA	ACTIVO	2026-09-05 06:00:04.052615+00
897	927	2026	08	0801	DIURNA	ACTIVO	2026-09-05 06:00:04.309865+00
898	928	2026	09	0901	DIURNA	ACTIVO	2026-09-05 06:00:04.480354+00
899	929	2026	09	0902	DIURNA	ACTIVO	2026-09-05 06:00:04.498444+00
900	930	2026	09	0901	DIURNA	ACTIVO	2026-09-05 06:00:04.515001+00
901	931	2026	10	1001	DIURNA	ACTIVO	2026-09-05 06:00:04.674011+00
902	932	2026	11	1102	TARDE	ACTIVO	2026-09-05 06:00:04.835778+00
903	936	2025	07	0701	MANANA	ACTIVO	2026-09-05 06:00:07.994583+00
904	936	2026	08	0802	MANANA	ACTIVO	2026-09-05 06:00:08.001797+00
905	937	2026	11	1101	DIURNA	ACTIVO	2026-09-05 11:55:59.943221+00
906	938	2026	06	0601	DIURNA	ACTIVO	2026-09-05 11:56:00.14317+00
907	939	2026	07	0701	DIURNA	ACTIVO	2026-09-05 11:56:00.746202+00
908	940	2026	08	0801	DIURNA	ACTIVO	2026-09-05 11:56:01.006993+00
909	941	2026	09	0901	DIURNA	ACTIVO	2026-09-05 11:56:01.183348+00
910	942	2026	09	0902	DIURNA	ACTIVO	2026-09-05 11:56:01.199288+00
911	943	2026	09	0901	DIURNA	ACTIVO	2026-09-05 11:56:01.211616+00
912	944	2026	10	1001	DIURNA	ACTIVO	2026-09-05 11:56:01.341043+00
913	945	2026	11	1102	TARDE	ACTIVO	2026-09-05 11:56:01.501215+00
914	949	2025	07	0701	MANANA	ACTIVO	2026-09-05 11:56:06.092234+00
915	949	2026	08	0802	MANANA	ACTIVO	2026-09-05 11:56:06.105137+00
916	950	2026	11	1101	DIURNA	ACTIVO	2026-09-05 12:22:43.975231+00
917	951	2026	06	0601	DIURNA	ACTIVO	2026-09-05 12:22:44.203907+00
918	952	2026	07	0701	DIURNA	ACTIVO	2026-09-05 12:22:44.918318+00
919	953	2026	08	0801	DIURNA	ACTIVO	2026-09-05 12:22:45.433207+00
920	954	2026	09	0901	DIURNA	ACTIVO	2026-09-05 12:22:45.643368+00
921	955	2026	09	0902	DIURNA	ACTIVO	2026-09-05 12:22:45.660708+00
922	956	2026	09	0901	DIURNA	ACTIVO	2026-09-05 12:22:45.675234+00
923	957	2026	10	1001	DIURNA	ACTIVO	2026-09-05 12:22:45.813873+00
924	958	2026	11	1102	TARDE	ACTIVO	2026-09-05 12:22:45.987377+00
925	962	2025	07	0701	MANANA	ACTIVO	2026-09-05 12:22:49.912088+00
926	962	2026	08	0802	MANANA	ACTIVO	2026-09-05 12:22:49.922413+00
927	963	2026	11	1101	DIURNA	ACTIVO	2026-09-05 12:27:02.231009+00
928	964	2026	06	0601	DIURNA	ACTIVO	2026-09-05 12:27:02.397167+00
929	965	2026	07	0701	DIURNA	ACTIVO	2026-09-05 12:27:03.042498+00
930	966	2026	08	0801	DIURNA	ACTIVO	2026-09-05 12:27:03.231632+00
931	967	2026	09	0901	DIURNA	ACTIVO	2026-09-05 12:27:03.590761+00
932	968	2026	09	0902	DIURNA	ACTIVO	2026-09-05 12:27:03.609732+00
933	969	2026	09	0901	DIURNA	ACTIVO	2026-09-05 12:27:03.622123+00
934	970	2026	10	1001	DIURNA	ACTIVO	2026-09-05 12:27:03.747131+00
935	971	2026	09	0901	DIURNA	ACTIVO	2026-09-05 12:27:03.866725+00
936	972	2026	11	1102	TARDE	ACTIVO	2026-09-05 12:27:04.03593+00
937	976	2025	07	0701	MANANA	ACTIVO	2026-09-05 12:27:06.751802+00
938	976	2026	08	0802	MANANA	ACTIVO	2026-09-05 12:27:06.759306+00
939	977	2026	11	1101	DIURNA	ACTIVO	2026-09-05 12:27:54.302472+00
940	978	2026	06	0601	DIURNA	ACTIVO	2026-09-05 12:27:54.4852+00
941	979	2026	07	0701	DIURNA	ACTIVO	2026-09-05 12:27:55.046817+00
942	980	2026	08	0801	DIURNA	ACTIVO	2026-09-05 12:27:55.213903+00
943	981	2026	08	0801	DIURNA	ACTIVO	2026-09-05 12:27:55.466906+00
944	982	2026	09	0901	DIURNA	ACTIVO	2026-09-05 12:27:55.584321+00
945	983	2026	09	0902	DIURNA	ACTIVO	2026-09-05 12:27:55.596851+00
946	984	2026	09	0901	DIURNA	ACTIVO	2026-09-05 12:27:55.608263+00
947	985	2026	10	1001	DIURNA	ACTIVO	2026-09-05 12:27:55.745767+00
948	986	2026	09	0901	DIURNA	ACTIVO	2026-09-05 12:27:55.836846+00
949	987	2026	11	1102	TARDE	ACTIVO	2026-09-05 12:27:56.017758+00
950	991	2025	07	0701	MANANA	ACTIVO	2026-09-05 12:27:58.552669+00
951	991	2026	08	0802	MANANA	ACTIVO	2026-09-05 12:27:58.559694+00
952	992	2026	11	1101	DIURNA	ACTIVO	2026-09-05 19:45:20.703291+00
953	993	2026	06	0601	DIURNA	ACTIVO	2026-09-05 19:45:20.915581+00
954	994	2026	07	0701	DIURNA	ACTIVO	2026-09-05 19:45:21.655715+00
955	995	2026	08	0801	DIURNA	ACTIVO	2026-09-05 19:45:21.85899+00
956	996	2026	08	0801	DIURNA	ACTIVO	2026-09-05 19:45:22.142471+00
957	997	2026	09	0901	DIURNA	ACTIVO	2026-09-05 19:45:22.287176+00
958	998	2026	09	0902	DIURNA	ACTIVO	2026-09-05 19:45:22.304915+00
959	999	2026	09	0901	DIURNA	ACTIVO	2026-09-05 19:45:22.320257+00
960	1000	2026	10	1001	DIURNA	ACTIVO	2026-09-05 19:45:22.462552+00
961	1001	2026	09	0901	DIURNA	ACTIVO	2026-09-05 19:45:22.584878+00
962	1002	2026	11	1102	TARDE	ACTIVO	2026-09-05 19:45:22.795785+00
963	1006	2025	07	0701	MANANA	ACTIVO	2026-09-05 19:45:26.405132+00
964	1006	2026	08	0802	MANANA	ACTIVO	2026-09-05 19:45:26.42268+00
965	1007	2026	11	1101	DIURNA	ACTIVO	2026-09-05 20:04:30.07271+00
966	1008	2026	06	0601	DIURNA	ACTIVO	2026-09-05 20:04:30.423673+00
967	1009	2026	07	0701	DIURNA	ACTIVO	2026-09-05 20:04:31.872082+00
968	1010	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:04:32.413805+00
969	1011	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:04:33.003285+00
970	1012	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:04:33.325178+00
971	1013	2026	09	0902	DIURNA	ACTIVO	2026-09-05 20:04:33.348858+00
972	1014	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:04:33.369578+00
973	1015	2026	10	1001	DIURNA	ACTIVO	2026-09-05 20:04:33.582248+00
974	1016	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:04:33.764674+00
975	1017	2026	11	1102	TARDE	ACTIVO	2026-09-05 20:04:34.113675+00
976	1021	2025	07	0701	MANANA	ACTIVO	2026-09-05 20:04:39.410233+00
977	1021	2026	08	0802	MANANA	ACTIVO	2026-09-05 20:04:39.420537+00
978	1022	2026	11	1101	DIURNA	ACTIVO	2026-09-05 20:16:54.289489+00
979	1023	2026	06	0601	DIURNA	ACTIVO	2026-09-05 20:16:54.561456+00
980	1024	2026	07	0701	DIURNA	ACTIVO	2026-09-05 20:16:55.316835+00
981	1025	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:16:55.664784+00
982	1026	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:16:56.30498+00
983	1027	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:16:56.642503+00
984	1028	2026	09	0902	DIURNA	ACTIVO	2026-09-05 20:16:56.666525+00
985	1029	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:16:56.704713+00
986	1030	2026	10	1001	DIURNA	ACTIVO	2026-09-05 20:16:56.973244+00
987	1031	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:16:57.167633+00
988	1032	2026	11	1102	TARDE	ACTIVO	2026-09-05 20:16:57.458029+00
989	1036	2025	07	0701	MANANA	ACTIVO	2026-09-05 20:17:02.765896+00
990	1036	2026	08	0802	MANANA	ACTIVO	2026-09-05 20:17:02.787021+00
991	1037	2026	11	1101	DIURNA	ACTIVO	2026-09-05 20:19:52.231302+00
992	1038	2026	06	0601	DIURNA	ACTIVO	2026-09-05 20:19:52.469997+00
993	1039	2026	07	0701	DIURNA	ACTIVO	2026-09-05 20:19:53.205791+00
994	1040	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:19:53.531493+00
995	1041	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:19:54.006947+00
996	1042	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:19:54.196343+00
997	1043	2026	09	0902	DIURNA	ACTIVO	2026-09-05 20:19:54.210574+00
998	1044	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:19:54.225016+00
999	1045	2026	10	1001	DIURNA	ACTIVO	2026-09-05 20:19:54.40991+00
1000	1046	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:19:54.547999+00
1001	1047	2026	11	1102	TARDE	ACTIVO	2026-09-05 20:19:54.763039+00
1002	1051	2025	07	0701	MANANA	ACTIVO	2026-09-05 20:19:59.519688+00
1003	1051	2026	08	0802	MANANA	ACTIVO	2026-09-05 20:19:59.527865+00
1004	1052	2026	11	1101	DIURNA	ACTIVO	2026-09-05 20:30:49.339367+00
1005	1053	2026	06	0601	DIURNA	ACTIVO	2026-09-05 20:30:49.612354+00
1006	1054	2026	07	0701	DIURNA	ACTIVO	2026-09-05 20:30:50.495509+00
1007	1055	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:30:50.830075+00
1008	1056	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:30:51.280429+00
1009	1057	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:30:51.522045+00
1010	1058	2026	09	0902	DIURNA	ACTIVO	2026-09-05 20:30:51.539488+00
1011	1059	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:30:51.555996+00
1012	1060	2026	10	1001	DIURNA	ACTIVO	2026-09-05 20:30:51.762073+00
1013	1061	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:30:51.930059+00
1014	1062	2026	11	1102	TARDE	ACTIVO	2026-09-05 20:30:52.190564+00
1015	1066	2025	07	0701	MANANA	ACTIVO	2026-09-05 20:30:57.106528+00
1016	1066	2026	08	0802	MANANA	ACTIVO	2026-09-05 20:30:57.12451+00
1017	1067	2026	11	1101	DIURNA	ACTIVO	2026-09-05 20:34:01.944854+00
1018	1068	2026	06	0601	DIURNA	ACTIVO	2026-09-05 20:34:02.127351+00
1019	1069	2026	07	0701	DIURNA	ACTIVO	2026-09-05 20:34:02.553806+00
1020	1070	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:34:02.724267+00
1021	1071	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:34:03.087689+00
1022	1072	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:34:03.223263+00
1023	1073	2026	09	0902	DIURNA	ACTIVO	2026-09-05 20:34:03.241+00
1024	1074	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:34:03.30175+00
1025	1075	2026	10	1001	DIURNA	ACTIVO	2026-09-05 20:34:03.440397+00
1026	1076	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:34:03.5762+00
1027	1077	2026	11	1102	TARDE	ACTIVO	2026-09-05 20:34:03.76596+00
1028	1081	2025	07	0701	MANANA	ACTIVO	2026-09-05 20:34:06.669445+00
1029	1081	2026	08	0802	MANANA	ACTIVO	2026-09-05 20:34:06.676633+00
1030	1082	2026	11	1101	DIURNA	ACTIVO	2026-09-05 20:48:13.215058+00
1031	1083	2026	06	0601	DIURNA	ACTIVO	2026-09-05 20:48:13.460347+00
1032	1084	2026	07	0701	DIURNA	ACTIVO	2026-09-05 20:48:13.872919+00
1033	1085	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:48:14.102564+00
1034	1086	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:48:14.468172+00
1035	1087	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:48:14.655495+00
1036	1088	2026	09	0902	DIURNA	ACTIVO	2026-09-05 20:48:14.672419+00
1037	1089	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:48:14.684366+00
1038	1090	2026	10	1001	DIURNA	ACTIVO	2026-09-05 20:48:14.808709+00
1039	1091	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:48:14.928818+00
1040	1092	2026	11	1102	TARDE	ACTIVO	2026-09-05 20:48:15.15394+00
1041	1096	2025	07	0701	MANANA	ACTIVO	2026-09-05 20:48:18.277608+00
1042	1096	2026	08	0802	MANANA	ACTIVO	2026-09-05 20:48:18.283572+00
1043	1097	2026	11	1101	DIURNA	ACTIVO	2026-09-05 20:49:15.046643+00
1044	1098	2026	06	0601	DIURNA	ACTIVO	2026-09-05 20:49:15.556939+00
1045	1099	2026	07	0701	DIURNA	ACTIVO	2026-09-05 20:49:16.117391+00
1046	1100	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:49:16.336679+00
1047	1101	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:49:16.64252+00
1048	1102	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:49:16.78151+00
1049	1103	2026	09	0902	DIURNA	ACTIVO	2026-09-05 20:49:16.801853+00
1050	1104	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:49:16.857269+00
1051	1105	2026	10	1001	DIURNA	ACTIVO	2026-09-05 20:49:17.019131+00
1052	1106	2026	10	1002	DIURNA	ACTIVO	2026-09-05 20:49:17.244462+00
1053	1107	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:49:17.437865+00
1054	1108	2026	11	1101	DIURNA	ACTIVO	2026-09-05 20:49:53.465365+00
1055	1109	2026	06	0601	DIURNA	ACTIVO	2026-09-05 20:49:53.620624+00
1056	1110	2026	07	0701	DIURNA	ACTIVO	2026-09-05 20:49:54.089211+00
1057	1111	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:49:54.312554+00
1058	1112	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:49:54.610229+00
1059	1113	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:49:54.727865+00
1060	1114	2026	09	0902	DIURNA	ACTIVO	2026-09-05 20:49:54.740892+00
1061	1115	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:49:54.753208+00
1062	1116	2026	10	1001	DIURNA	ACTIVO	2026-09-05 20:49:54.896795+00
1063	1117	2026	10	1002	DIURNA	ACTIVO	2026-09-05 20:49:54.990265+00
1064	1118	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:49:55.172224+00
1065	1119	2026	11	1102	TARDE	ACTIVO	2026-09-05 20:49:55.380894+00
1066	1123	2025	07	0701	MANANA	ACTIVO	2026-09-05 20:49:58.293258+00
1067	1123	2026	08	0802	MANANA	ACTIVO	2026-09-05 20:49:58.298687+00
1068	1124	2026	11	1101	DIURNA	ACTIVO	2026-09-05 20:51:37.271049+00
1069	1125	2026	06	0601	DIURNA	ACTIVO	2026-09-05 20:51:37.496615+00
1070	1126	2026	07	0701	DIURNA	ACTIVO	2026-09-05 20:51:38.217785+00
1071	1127	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:51:38.414081+00
1072	1128	2026	08	0801	DIURNA	ACTIVO	2026-09-05 20:51:38.736378+00
1073	1129	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:51:38.859617+00
1074	1130	2026	09	0902	DIURNA	ACTIVO	2026-09-05 20:51:38.876005+00
1075	1131	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:51:38.916191+00
1076	1132	2026	10	1001	DIURNA	ACTIVO	2026-09-05 20:51:39.025665+00
1077	1133	2026	10	1002	DIURNA	ACTIVO	2026-09-05 20:51:39.166754+00
1078	1134	2026	09	0901	DIURNA	ACTIVO	2026-09-05 20:51:39.383087+00
1079	1135	2026	11	1102	TARDE	ACTIVO	2026-09-05 20:51:39.589887+00
1080	1139	2025	07	0701	MANANA	ACTIVO	2026-09-05 20:51:42.960059+00
1081	1139	2026	08	0802	MANANA	ACTIVO	2026-09-05 20:51:42.97105+00
1082	1140	2026	11	1101	DIURNA	ACTIVO	2026-09-05 22:31:12.590722+00
1083	1141	2026	06	0601	DIURNA	ACTIVO	2026-09-05 22:31:13.066833+00
1084	1142	2026	07	0701	DIURNA	ACTIVO	2026-09-05 22:31:14.081081+00
1085	1143	2026	08	0801	DIURNA	ACTIVO	2026-09-05 22:31:14.513253+00
1086	1144	2026	08	0801	DIURNA	ACTIVO	2026-09-05 22:31:14.921743+00
1087	1145	2026	09	0901	DIURNA	ACTIVO	2026-09-05 22:31:15.193031+00
1088	1146	2026	09	0902	DIURNA	ACTIVO	2026-09-05 22:31:15.208678+00
1089	1147	2026	09	0901	DIURNA	ACTIVO	2026-09-05 22:31:15.225637+00
1090	1148	2026	10	1001	DIURNA	ACTIVO	2026-09-05 22:31:15.385949+00
1091	1149	2026	10	1002	DIURNA	ACTIVO	2026-09-05 22:31:15.537245+00
1092	1150	2026	09	0901	DIURNA	ACTIVO	2026-09-05 22:31:15.741092+00
1093	1151	2026	09	0901	DIURNA	ACTIVO	2026-09-05 22:31:15.894836+00
1094	1152	2026	11	1102	TARDE	ACTIVO	2026-09-05 22:31:16.185631+00
1095	1156	2025	07	0701	MANANA	ACTIVO	2026-09-05 22:31:19.893099+00
1096	1156	2026	08	0802	MANANA	ACTIVO	2026-09-05 22:31:19.906903+00
\.


--
-- Data for Name: planes_intervencion; Type: TABLE DATA; Schema: public; Owner: admin_disciplina
--

COPY public.planes_intervencion (id, estudiante_id, incidente_origen_id, orientador_id, diagnostico_situacional, recomendaciones_ia, acciones_acordadas, compromiso_padres, fecha_proximo_seguimiento, estado, created_at, updated_at) FROM stdin;
1	1	\N	14	Dificultad recurrente en la regulación de impulsos ante frustración académica.	Estrategias de autorregulación emocional y pausas activas.	Asistencia semanal a taller de mediación y acuerdos restaurativos.	Supervisión diaria de agenda escolar y diálogo en casa.	2026-09-20	EN_SEGUIMIENTO	2026-09-05 20:16:09.188413+00	2026-09-05 20:16:09.189416+00
2	1	\N	14	Diagnóstico inicial para seguimiento	\N	Acciones iniciales	\N	\N	CUMPLIDO	2026-09-05 20:16:09.431693+00	2026-09-05 20:16:09.618414+00
3	1	\N	14	Dificultad recurrente en la regulación de impulsos ante frustración académica.	Estrategias de autorregulación emocional y pausas activas.	Asistencia semanal a taller de mediación y acuerdos restaurativos.	Supervisión diaria de agenda escolar y diálogo en casa.	2026-09-20	EN_SEGUIMIENTO	2026-09-05 20:17:03.472904+00	2026-09-05 20:17:03.472904+00
4	1	\N	14	Diagnóstico inicial para seguimiento	\N	Acciones iniciales	\N	\N	CUMPLIDO	2026-09-05 20:17:03.566805+00	2026-09-05 20:17:03.627714+00
5	1	\N	14	Dificultad recurrente en la regulación de impulsos ante frustración académica.	Estrategias de autorregulación emocional y pausas activas.	Asistencia semanal a taller de mediación y acuerdos restaurativos.	Supervisión diaria de agenda escolar y diálogo en casa.	2026-09-20	EN_SEGUIMIENTO	2026-09-05 20:19:59.983466+00	2026-09-05 20:19:59.983466+00
6	1	\N	14	Diagnóstico inicial para seguimiento	\N	Acciones iniciales	\N	\N	CUMPLIDO	2026-09-05 20:20:00.084719+00	2026-09-05 20:20:00.155956+00
7	1	\N	14	Dificultad recurrente en la regulación de impulsos ante frustración académica.	Estrategias de autorregulación emocional y pausas activas.	Asistencia semanal a taller de mediación y acuerdos restaurativos.	Supervisión diaria de agenda escolar y diálogo en casa.	2026-09-20	EN_SEGUIMIENTO	2026-09-05 20:30:57.776053+00	2026-09-05 20:30:57.776053+00
8	1	\N	14	Diagnóstico inicial para seguimiento	\N	Acciones iniciales	\N	\N	EN_SEGUIMIENTO	2026-09-05 20:30:57.880963+00	2026-09-05 20:30:57.880963+00
9	1	\N	14	Dificultad recurrente en la regulación de impulsos ante frustración académica.	Estrategias de autorregulación emocional y pausas activas.	Asistencia semanal a taller de mediación y acuerdos restaurativos.	Supervisión diaria de agenda escolar y diálogo en casa.	2026-09-20	EN_SEGUIMIENTO	2026-09-05 20:31:56.545517+00	2026-09-05 20:31:56.545517+00
10	1	\N	14	Diagnóstico inicial para seguimiento	\N	Acciones iniciales	\N	\N	EN_SEGUIMIENTO	2026-09-05 20:31:56.729457+00	2026-09-05 20:31:56.729457+00
11	1	\N	14	Dificultad recurrente en la regulación de impulsos ante frustración académica.	Estrategias de autorregulación emocional y pausas activas.	Asistencia semanal a taller de mediación y acuerdos restaurativos.	Supervisión diaria de agenda escolar y diálogo en casa.	2026-09-20	EN_SEGUIMIENTO	2026-09-05 20:33:28.800681+00	2026-09-05 20:33:28.800681+00
12	1	\N	14	Diagnóstico inicial para seguimiento	\N	Acciones iniciales	\N	\N	CUMPLIDO	2026-09-05 20:33:28.964239+00	2026-09-05 20:33:29.052012+00
13	1	\N	14	Dificultad recurrente en la regulación de impulsos ante frustración académica.	Estrategias de autorregulación emocional y pausas activas.	Asistencia semanal a taller de mediación y acuerdos restaurativos.	Supervisión diaria de agenda escolar y diálogo en casa.	2026-09-20	EN_SEGUIMIENTO	2026-09-05 20:34:07.201791+00	2026-09-05 20:34:07.201791+00
14	1	\N	14	Diagnóstico inicial para seguimiento	\N	Acciones iniciales	\N	\N	CUMPLIDO	2026-09-05 20:34:07.304539+00	2026-09-05 20:34:07.369934+00
15	1	\N	14	Dificultad recurrente en la regulación de impulsos ante frustración académica.	Estrategias de autorregulación emocional y pausas activas.	Asistencia semanal a taller de mediación y acuerdos restaurativos.	Supervisión diaria de agenda escolar y diálogo en casa.	2026-09-20	EN_SEGUIMIENTO	2026-09-05 20:48:18.64721+00	2026-09-05 20:48:18.64721+00
16	1	\N	14	Diagnóstico inicial para seguimiento	\N	Acciones iniciales	\N	\N	CUMPLIDO	2026-09-05 20:48:18.72215+00	2026-09-05 20:48:18.825557+00
17	1	\N	14	Dificultad recurrente en la regulación de impulsos ante frustración académica.	Estrategias de autorregulación emocional y pausas activas.	Asistencia semanal a taller de mediación y acuerdos restaurativos.	Supervisión diaria de agenda escolar y diálogo en casa.	2026-09-20	EN_SEGUIMIENTO	2026-09-05 20:49:58.64864+00	2026-09-05 20:49:58.64864+00
18	1	\N	14	Diagnóstico inicial para seguimiento	\N	Acciones iniciales	\N	\N	CUMPLIDO	2026-09-05 20:49:58.769928+00	2026-09-05 20:49:58.850041+00
19	1	\N	14	Dificultad recurrente en la regulación de impulsos ante frustración académica.	Estrategias de autorregulación emocional y pausas activas.	Asistencia semanal a taller de mediación y acuerdos restaurativos.	Supervisión diaria de agenda escolar y diálogo en casa.	2026-09-20	EN_SEGUIMIENTO	2026-09-05 20:51:43.405289+00	2026-09-05 20:51:43.405289+00
20	1	\N	14	Diagnóstico inicial para seguimiento	\N	Acciones iniciales	\N	\N	CUMPLIDO	2026-09-05 20:51:43.477731+00	2026-09-05 20:51:43.541336+00
21	1	\N	14	Dificultad recurrente en la regulación de impulsos ante frustración académica.	Estrategias de autorregulación emocional y pausas activas.	Asistencia semanal a taller de mediación y acuerdos restaurativos.	Supervisión diaria de agenda escolar y diálogo en casa.	2026-09-20	EN_SEGUIMIENTO	2026-09-05 22:31:20.347215+00	2026-09-05 22:31:20.347215+00
22	1	\N	14	Diagnóstico inicial para seguimiento	\N	Acciones iniciales	\N	\N	CUMPLIDO	2026-09-05 22:31:20.434102+00	2026-09-05 22:31:20.504726+00
\.


--
-- Data for Name: seguimientos_caso; Type: TABLE DATA; Schema: public; Owner: admin_disciplina
--

COPY public.seguimientos_caso (id, plan_id, usuario_id, observacion, fecha_registro) FROM stdin;
1	2	14	El estudiante asistió puntualmente a las sesiones y presentó avances notables.	2026-09-05 20:16:09.540045+00
2	4	14	El estudiante asistió puntualmente a las sesiones y presentó avances notables.	2026-09-05 20:17:03.616682+00
3	6	14	El estudiante asistió puntualmente a las sesiones y presentó avances notables.	2026-09-05 20:20:00.14354+00
6	12	14	El estudiante asistió puntualmente a las sesiones y presentó avances notables.	2026-09-05 20:33:29.028151+00
7	14	14	El estudiante asistió puntualmente a las sesiones y presentó avances notables.	2026-09-05 20:34:07.355936+00
8	16	14	El estudiante asistió puntualmente a las sesiones y presentó avances notables.	2026-09-05 20:48:18.776004+00
9	18	14	El estudiante asistió puntualmente a las sesiones y presentó avances notables.	2026-09-05 20:49:58.835933+00
10	20	14	El estudiante asistió puntualmente a las sesiones y presentó avances notables.	2026-09-05 20:51:43.527604+00
11	22	14	El estudiante asistió puntualmente a las sesiones y presentó avances notables.	2026-09-05 22:31:20.484469+00
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: admin_disciplina
--

COPY public.usuarios (id, username, password_hash, nombres, apellidos, email, rol, activo, created_at, updated_at) FROM stdin;
2	orientador	$2a$12$TTvJz8KOOZLee7Zs7c7rTuxVAWFn5ygx0qL53XimiicmJuEDUGa4W	Gloria Esperanza	Gomez Morales	orientador@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-04 03:19:15.411093+00	2026-09-04 03:19:15.411093+00
3	test_rector	$2a$12$Gw0CJTcdKSyQmaijH5ZktOB40L3VgB2jv0bgXfyxs.C9pBx0SYHE2	Test	Rector	test.rector@disciplina.edu.co	ROLE_RECTOR	t	2026-09-04 03:19:27.03274+00	2026-09-04 03:19:27.03274+00
4	test_orientador	$2a$12$IfvsBR9hGaR.WQOWewTOQ.RMcCWWFBJygxNgRnvUg61VHw333KE/O	Test	Orientador	test.orientador@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-04 04:04:33.688172+00	2026-09-04 04:04:33.688172+00
5	rector_matricula	$2a$12$WzGP3CdL5B9nCnd9MEvgJuQcnFr3I354qx0gEIdezhG.W/22wLQ7a	Rector	Matricula	rector.matricula@disciplina.edu.co	ROLE_RECTOR	t	2026-09-04 14:29:52.625396+00	2026-09-04 14:29:52.625396+00
6	orientador_matricula	$2a$12$Np0t.VWANI7SRh.M2G/t4enWtyY1sL/dux2B0Q.8iJQquNyGNrEgW	Orientador	Matricula	orientador.matricula@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-04 14:29:53.390024+00	2026-09-04 14:29:53.390024+00
7	rector_inc	$2a$12$.pFOE8TxZj2LOT8K3GilEes.s9H3wn5MTFVD7MU0h0g/syHQOh.7O	Rector	Incidentes	rector.inc@disciplina.edu.co	ROLE_RECTOR	t	2026-09-04 20:20:55.986598+00	2026-09-04 20:20:55.986598+00
8	orientador_inc	$2a$12$hl7S7d0iNKWqfL6fNU9n9ueZWPxhBJBdQJ.ZuIueQUtz73Fak8DI2	Orientador	Incidentes	orientador.inc@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-04 20:20:56.539315+00	2026-09-04 20:20:56.539315+00
9	rector_ia_test	$2a$12$CpbEs0bGS5Ld70hQxd9zJ.Wposg45R8PRNWQFgEX0MyB6ZsvrjD5a	Rector	IA Test	rector.ia@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 04:58:26.981528+00	2026-09-05 04:58:26.981528+00
10	rector_dash_test	$2a$12$L.LTfnI/DYg8lI.HS9mTA.WtyrgYQ3NCOmtDQ00TtJ2JF5OqHxH5y	Rector	Dashboard	rector.dash@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 19:44:29.541308+00	2026-09-05 19:44:29.541308+00
11	orientador_dash_test	$2a$12$5xws8qs6ul1oVzaWpoEn3OjiHch28IKDYA683nRXTq1oiS.U7OUGC	Orientador	Dashboard	orientador.dash@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 19:44:30.448526+00	2026-09-05 19:44:30.448526+00
12	rector_rep_test	$2a$12$WL8nFYTXcjWf2DV7ZjTQ2.c.4xgw5HHsbgq7C1/nmwV5bkDffRxxe	Rector	Reportes	rector.rep@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:02:04.614864+00	2026-09-05 20:02:04.614864+00
13	orientador_rep_test	$2a$12$InoR64q1DS0mxU6eeDQf/eeTx4HDZ43A6Qb/9HzuVBKS6Y5ys4Xsi	Orientador	Reportes	orientador.rep@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:02:05.185325+00	2026-09-05 20:02:05.185325+00
1	rector	$2a$12$TTvJz8KOOZLee7Zs7c7rTuxVAWFn5ygx0qL53XimiicmJuEDUGa4W	Harris	Laguna Lamilla	rector@disciplina.edu.co	ROLE_RECTOR	t	2026-09-04 03:19:15.411093+00	2026-09-04 03:19:15.411093+00
14	orientador_plan_test	$2a$12$Saw3Q4keVRW74GutJnN0B.XjF41tErpIV.bWEIgJAOxlFqZVHj8iC	Orientador	Planes	orientador.plan@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:16:07.082917+00	2026-09-05 20:16:07.082917+00
15	rector_audit_d2dff779	$2a$12$j43l.Xzz1nHNIt1iH3488e2KSfMdpNCFiPxoiaJpB5Ku0Ap6ut5fK	Rector	Auditor	rector_audit_d2dff779@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:28:08.880593+00	2026-09-05 20:28:08.880593+00
16	orientador_audit_d2dff779	$2a$12$eRCtSEnWLVc49OkoOqKJa.sxVffwOp7VZ4/70if.s97Xj5qy0WkhS	Orientador	Usuario	orientador_audit_d2dff779@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:28:09.896206+00	2026-09-05 20:28:09.896206+00
17	rector_audit_9047884e	$2a$12$EpINFaXbbwVRYOo.0rhXyuOYwPOAM1mJGH1CC/786Lpm7oF3y8Qwi	Rector	Auditor	rector_audit_9047884e@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:28:12.007065+00	2026-09-05 20:28:12.007065+00
18	orientador_audit_9047884e	$2a$12$JumtXLFpUzl4hYm5XFallOzRGdXmnk9hSKkZOYMRnBKa5Wu3B4wBu	Orientador	Usuario	orientador_audit_9047884e@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:28:12.53374+00	2026-09-05 20:28:12.53374+00
19	rector_audit_109b4449	$2a$12$v0nmRY/9Ouh90Fep3X.AJ.HFIB0HJFoMgQvuvH4szEU8aEccGC5lS	Rector	Auditor	rector_audit_109b4449@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:28:13.158703+00	2026-09-05 20:28:13.158703+00
20	orientador_audit_109b4449	$2a$12$UPFdIqpfuHfZNkc9ApXX5Ojs96XTcBH8d8wkulv9f6kujXvhUP.YG	Orientador	Usuario	orientador_audit_109b4449@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:28:13.77153+00	2026-09-05 20:28:13.77153+00
21	rector_audit_4c4a62ce	$2a$12$kpkaPoWebDgtjMg0TUxMFe4ZDvoUwLiSs8TDXABI.6RYpOy7rZo/2	Rector	Auditor	rector_audit_4c4a62ce@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:30:00.467821+00	2026-09-05 20:30:00.467821+00
22	orientador_audit_4c4a62ce	$2a$12$4AU8Ay7mxoXeLB5r4kBxsezV73g15gBUY1e5FFZSYF9tl.NT9.Ae.	Orientador	Usuario	orientador_audit_4c4a62ce@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:30:01.240452+00	2026-09-05 20:30:01.240452+00
23	rector_audit_4e82169b	$2a$12$1oLvm8j4Gv0lFnTfeEtvxOOI3qL2s7p8pXdjrzUcLWwnnt1WC86y6	Rector	Auditor	rector_audit_4e82169b@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:30:03.008698+00	2026-09-05 20:30:03.008698+00
24	orientador_audit_4e82169b	$2a$12$RkS56ZEqXWQy1jqcvrLhYOSVGjljP4Pscv251CzEevHmcPbhjNT1S	Orientador	Usuario	orientador_audit_4e82169b@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:30:03.42824+00	2026-09-05 20:30:03.42824+00
25	rector_audit_38920500	$2a$12$w4VgV87XjKXZmZSkltPYDOb/n4a8dxa4vZ2ajP6MVo6L.bP.Oz1ka	Rector	Auditor	rector_audit_38920500@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:30:03.983042+00	2026-09-05 20:30:03.983042+00
26	orientador_audit_38920500	$2a$12$W2edQWSvZrfgJIn15x9rJe3KSzcYPWtsVtGgPcOHUWy8VPNsuAozK	Orientador	Usuario	orientador_audit_38920500@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:30:04.485866+00	2026-09-05 20:30:04.485866+00
27	rector_audit_4d868fdf	$2a$12$y00YRtgU2eTMs3hpRFFKfOHLHJWug8Jh6IkElC3ITYJ2n8gVn5i1i	Rector	Auditor	rector_audit_4d868fdf@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:30:41.185735+00	2026-09-05 20:30:41.185735+00
28	orientador_audit_4d868fdf	$2a$12$t4qq.iiUS2EJHtWOSIGgv.S4Cyu2C0xelzBqik42gBpHPdfQWxA5m	Orientador	Usuario	orientador_audit_4d868fdf@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:30:41.772131+00	2026-09-05 20:30:41.772131+00
29	rector_audit_34ea459e	$2a$12$L1Ymwj6bnCbKDYI.p7mttursdHA9NlM4aMbPHlX7xos4/mYmGoEKi	Rector	Auditor	rector_audit_34ea459e@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:30:43.154617+00	2026-09-05 20:30:43.154617+00
30	orientador_audit_34ea459e	$2a$12$2VjTGoqJgJxDkfKDFdDMH.SPIBtiQWxZmrg7iLR1LjUQRcpywdUF2	Orientador	Usuario	orientador_audit_34ea459e@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:30:43.617199+00	2026-09-05 20:30:43.617199+00
31	rector_audit_52919cb5	$2a$12$xT8o/4VD8yBsOOT2zaFD6uKMV6dd/685XN4U/5mVnU8my7N7Iq0ru	Rector	Auditor	rector_audit_52919cb5@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:30:44.152504+00	2026-09-05 20:30:44.152504+00
32	orientador_audit_52919cb5	$2a$12$tNjerRwVgZFYnm3P3dtBheH3ab1bTI25AZeChIDQIoWcZnFNNYBVi	Orientador	Usuario	orientador_audit_52919cb5@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:30:44.589923+00	2026-09-05 20:30:44.589923+00
33	rector_audit_0b5b6d17	$2a$12$NUYxpauDAllIn2nBbflBYOZBd1ONJKCKtuuUOodP4gZsFi0ROq5nu	Rector	Auditor	rector_audit_0b5b6d17@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:33:56.330868+00	2026-09-05 20:33:56.330868+00
34	orientador_audit_0b5b6d17	$2a$12$C7mQ9CKVOoaiTFOB1cZ2ieipk0X/rMsIb4c8DUpKH9XqSJYIUXU3G	Orientador	Usuario	orientador_audit_0b5b6d17@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:33:56.748929+00	2026-09-05 20:33:56.748929+00
35	rector_audit_a16e24b2	$2a$12$CMG4wC69UlfcS1/PJ1yHfel6JXkhJlY5blQFosG.uJaqhWcdZZRRu	Rector	Auditor	rector_audit_a16e24b2@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:33:57.7019+00	2026-09-05 20:33:57.7019+00
36	orientador_audit_a16e24b2	$2a$12$u5r/r76GcWtlROqCtUN1zuaGXZ3nazQ76B7rKqEpzbMt3SSI2UiCG	Orientador	Usuario	orientador_audit_a16e24b2@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:33:57.979726+00	2026-09-05 20:33:57.979726+00
37	rector_audit_b6562ffb	$2a$12$Jn8CQpAkYElEDO2CahZ97eBroLN4868f93lBjZya.NHW3iNIoG8Te	Rector	Auditor	rector_audit_b6562ffb@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:33:58.351893+00	2026-09-05 20:33:58.351893+00
38	orientador_audit_b6562ffb	$2a$12$n7g6H5hq9Q/ZhlroSipyG.1n6nNhwuEEOoZBt5ZmARRgUrJuCY8tu	Orientador	Usuario	orientador_audit_b6562ffb@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:33:58.651063+00	2026-09-05 20:33:58.651063+00
39	rector_audit_3c3b8dee	$2a$12$ShJizQ7c1vgX4IAkfSGfuu5aIcJjhIzh/1od8/WEh4FkEFiGsTecy	Rector	Auditor	rector_audit_3c3b8dee@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:44:42.630031+00	2026-09-05 20:44:42.630031+00
40	orientador_audit_3c3b8dee	$2a$12$05pWxwGK8s4iwvlOGHBmv.KH7cg.9D0D0NZ3ltJhiKEmqiFqyshz6	Orientador	Usuario	orientador_audit_3c3b8dee@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:44:43.044202+00	2026-09-05 20:44:43.044202+00
41	rector_audit_c75935d3	$2a$12$7Q1I1sxi4uMCA6UOt8jpkOj1Y3js5CogTtjB/qDXEHKIribxBR46K	Rector	Auditor	rector_audit_c75935d3@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:44:43.89657+00	2026-09-05 20:44:43.89657+00
42	orientador_audit_c75935d3	$2a$12$z5geQC0Z2r4OiEActlOJN.dIIKq7lLbVc6hqGDKsPZBzeIO23gn46	Orientador	Usuario	orientador_audit_c75935d3@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:44:44.204498+00	2026-09-05 20:44:44.204498+00
43	rector_audit_09fd313d	$2a$12$gfagzN9tgGEIRSt0yuIjf.9AnK1VHMQYKFlwWaNrlhizt2EHZFIru	Rector	Auditor	rector_audit_09fd313d@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:44:44.555081+00	2026-09-05 20:44:44.555081+00
44	orientador_audit_09fd313d	$2a$12$/CuofFZm4Kc3fo.0dhKbbuQpzosZJ9rEuy7HHiazmcGsx45.48u3e	Orientador	Usuario	orientador_audit_09fd313d@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:44:44.855313+00	2026-09-05 20:44:44.855313+00
45	rector_audit_f33f9fd4	$2a$12$Y6fF/Jmc5b40xS5gt2hIbua7G7GXDP6B6OCCU83/tveaLKzNUFMY6	Rector	Auditor	rector_audit_f33f9fd4@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:48:07.853382+00	2026-09-05 20:48:07.853382+00
46	orientador_audit_f33f9fd4	$2a$12$/6p0UmIEcZdUg2tzUeqg9e9wCDfwSG/fL.KVsEmPiqPcxWvKg135G	Orientador	Usuario	orientador_audit_f33f9fd4@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:48:08.306394+00	2026-09-05 20:48:08.306394+00
47	rector_audit_57fbdbde	$2a$12$VW3Mz61GTTlLZitq/88FL.fB3w5.o4Epg0qc/jjB9h1v.htC4JpEG	Rector	Auditor	rector_audit_57fbdbde@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:48:09.166364+00	2026-09-05 20:48:09.166364+00
48	orientador_audit_57fbdbde	$2a$12$0rmizqbUcVEyJhe/Dq/Q.eGylpd8Z/bdyM15sMjfaUrjJTP0c4lMK	Orientador	Usuario	orientador_audit_57fbdbde@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:48:09.47279+00	2026-09-05 20:48:09.47279+00
49	rector_audit_259c9dd1	$2a$12$P/Mq4F3EKxQJxivTNhB8ROuJ4sx.lZHpKQ8oKN27Au02ymi1xzsyy	Rector	Auditor	rector_audit_259c9dd1@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:48:09.821329+00	2026-09-05 20:48:09.821329+00
50	orientador_audit_259c9dd1	$2a$12$Ue5HvVVlvi51llLtKQ8mVOHc5RzT2CLtfvC2Ab4V5bkgQlyiuguqS	Orientador	Usuario	orientador_audit_259c9dd1@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:48:10.115667+00	2026-09-05 20:48:10.115667+00
51	rector_audit_54cad500	$2a$12$Pv/HtUebfkrB4hINge69Be0wnDY083TJMBcyIBglbqpA2oE5fP2Z.	Rector	Auditor	rector_audit_54cad500@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:49:48.023642+00	2026-09-05 20:49:48.023642+00
52	orientador_audit_54cad500	$2a$12$ePwoprWxDxGFCwZR2LvmmuGnpGE/mhaT2fdNrACKN7SooUPlNpv/.	Orientador	Usuario	orientador_audit_54cad500@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:49:48.515389+00	2026-09-05 20:49:48.515389+00
53	rector_audit_ab1b0fed	$2a$12$EPdNebawBTNGhS0QEqwx.uuhxu7aYTqf/Ym0tj1GtMlJeZN/tnOJG	Rector	Auditor	rector_audit_ab1b0fed@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:49:49.454626+00	2026-09-05 20:49:49.454626+00
54	orientador_audit_ab1b0fed	$2a$12$BH5CGz9fQy2ywIU/gDIRMewyTPjm1RlBELYXsy6MbfypkBAokWieO	Orientador	Usuario	orientador_audit_ab1b0fed@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:49:49.741691+00	2026-09-05 20:49:49.741691+00
55	rector_audit_895ce9ac	$2a$12$Bosu3OWnU3C7Hc0JISBAH.jt.TpPipBUGrYXTmIzxFeJGkF/cHmD.	Rector	Auditor	rector_audit_895ce9ac@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:49:50.113297+00	2026-09-05 20:49:50.113297+00
56	orientador_audit_895ce9ac	$2a$12$QmC/8Pv4s/gAQYFGWy3Tjurb7fDNLTP0ptllCGzenn6VxJrLr3./O	Orientador	Usuario	orientador_audit_895ce9ac@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:49:50.438846+00	2026-09-05 20:49:50.438846+00
57	rector_audit_e09b1d4f	$2a$12$oiPvX.qmT2nI2Nvjly7VMeSIPhZpSU.hiNGAVXVk/Nw6Z0H24wBti	Rector	Auditor	rector_audit_e09b1d4f@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:51:31.872961+00	2026-09-05 20:51:31.872961+00
58	orientador_audit_e09b1d4f	$2a$12$ogUgjUrazoMEm9RIO.7B4O.Qrw4m5AOWl8sffEaYJF6v3pcX8DluW	Orientador	Usuario	orientador_audit_e09b1d4f@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:51:32.354675+00	2026-09-05 20:51:32.354675+00
59	rector_audit_e34b67fc	$2a$12$h4ctkidkee2ubCfGdd8Es.3b/MaaEaVIwFdZHXHeEohHVjlo5IBYK	Rector	Auditor	rector_audit_e34b67fc@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:51:33.260015+00	2026-09-05 20:51:33.260015+00
60	orientador_audit_e34b67fc	$2a$12$fX7LjfGNevUT4dS1u475o.5g4BhujSp12sZIuREtEBhuTabX6NkHK	Orientador	Usuario	orientador_audit_e34b67fc@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:51:33.55049+00	2026-09-05 20:51:33.55049+00
61	rector_audit_17088fb7	$2a$12$4Z4fiZI.M6F2.ZdvmcI7P.rfUB84b5o8ryf8trLvz348DjkPsinxS	Rector	Auditor	rector_audit_17088fb7@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 20:51:33.894171+00	2026-09-05 20:51:33.894171+00
62	orientador_audit_17088fb7	$2a$12$efE/NYQ3jD1KedBxizjPD..3W4W/2rEikPpOm9MMHacvigAgjxyYu	Orientador	Usuario	orientador_audit_17088fb7@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 20:51:34.166301+00	2026-09-05 20:51:34.166301+00
63	rector_audit_c69dc19c	$2a$12$kZJk5G6IN7ZyiguEmVa8iu4q4G/N32T7fgdcqvHEtJ2GeXiXy3Yca	Rector	Auditor	rector_audit_c69dc19c@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 22:31:02.154715+00	2026-09-05 22:31:02.154715+00
64	orientador_audit_c69dc19c	$2a$12$soOaNtkKo35nxyGE0ZE15eO0PFpRBcMoZ2vm44gSq4NOkkS5oNZq2	Orientador	Usuario	orientador_audit_c69dc19c@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 22:31:02.944151+00	2026-09-05 22:31:02.944151+00
65	rector_audit_48d1fe8f	$2a$12$xqQX5J.OXqucg3Y7unOOLeDZngMUsZ.xSa8BEw2fIu7fqXef88P8m	Rector	Auditor	rector_audit_48d1fe8f@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 22:31:04.408978+00	2026-09-05 22:31:04.408978+00
66	orientador_audit_48d1fe8f	$2a$12$eO70RWnWm/qGh0MFBGHFaOfPkADV8nVipjug8wj2Udg0UPz3Y18kS	Orientador	Usuario	orientador_audit_48d1fe8f@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 22:31:04.8321+00	2026-09-05 22:31:04.8321+00
67	rector_audit_208c82e2	$2a$12$IZhU.5I.GcE4T4J6cCFJH.ZR1HAxgWxfP7eRymeFo2vdgvsIsudkG	Rector	Auditor	rector_audit_208c82e2@disciplina.edu.co	ROLE_RECTOR	t	2026-09-05 22:31:05.32343+00	2026-09-05 22:31:05.32343+00
68	orientador_audit_208c82e2	$2a$12$NfwHXJigyNcGiS/W3r0Pe.MEntyEaHlVq6zjaQ4s3jtko537siYN2	Orientador	Usuario	orientador_audit_208c82e2@disciplina.edu.co	ROLE_ORIENTADOR	t	2026-09-05 22:31:05.720784+00	2026-09-05 22:31:05.720784+00
\.


--
-- Name: auditoria_sistema_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_disciplina
--

SELECT pg_catalog.setval('public.auditoria_sistema_id_seq', 137, true);


--
-- Name: catalogo_faltas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_disciplina
--

SELECT pg_catalog.setval('public.catalogo_faltas_id_seq', 22, true);


--
-- Name: docentes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_disciplina
--

SELECT pg_catalog.setval('public.docentes_id_seq', 29, true);


--
-- Name: estudiantes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_disciplina
--

SELECT pg_catalog.setval('public.estudiantes_id_seq', 1156, true);


--
-- Name: incidente_estudiantes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_disciplina
--

SELECT pg_catalog.setval('public.incidente_estudiantes_id_seq', 285, true);


--
-- Name: incidentes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_disciplina
--

SELECT pg_catalog.setval('public.incidentes_id_seq', 228, true);


--
-- Name: lugares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_disciplina
--

SELECT pg_catalog.setval('public.lugares_id_seq', 28, true);


--
-- Name: matriculas_estudiante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_disciplina
--

SELECT pg_catalog.setval('public.matriculas_estudiante_id_seq', 1096, true);


--
-- Name: planes_intervencion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_disciplina
--

SELECT pg_catalog.setval('public.planes_intervencion_id_seq', 22, true);


--
-- Name: seguimientos_caso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_disciplina
--

SELECT pg_catalog.setval('public.seguimientos_caso_id_seq', 11, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin_disciplina
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 68, true);


--
-- Name: auditoria_sistema auditoria_sistema_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.auditoria_sistema
    ADD CONSTRAINT auditoria_sistema_pkey PRIMARY KEY (id);


--
-- Name: catalogo_faltas catalogo_faltas_codigo_key; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.catalogo_faltas
    ADD CONSTRAINT catalogo_faltas_codigo_key UNIQUE (codigo);


--
-- Name: catalogo_faltas catalogo_faltas_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.catalogo_faltas
    ADD CONSTRAINT catalogo_faltas_pkey PRIMARY KEY (id);


--
-- Name: docentes docentes_documento_key; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_documento_key UNIQUE (documento);


--
-- Name: docentes docentes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_pkey PRIMARY KEY (id);


--
-- Name: estudiantes estudiantes_documento_key; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_documento_key UNIQUE (documento);


--
-- Name: estudiantes estudiantes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- Name: incidente_estudiantes incidente_estudiantes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.incidente_estudiantes
    ADD CONSTRAINT incidente_estudiantes_pkey PRIMARY KEY (id);


--
-- Name: incidentes incidentes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.incidentes
    ADD CONSTRAINT incidentes_pkey PRIMARY KEY (id);


--
-- Name: lugares lugares_nombre_key; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.lugares
    ADD CONSTRAINT lugares_nombre_key UNIQUE (nombre);


--
-- Name: lugares lugares_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.lugares
    ADD CONSTRAINT lugares_pkey PRIMARY KEY (id);


--
-- Name: matriculas_estudiante matriculas_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.matriculas_estudiante
    ADD CONSTRAINT matriculas_estudiante_pkey PRIMARY KEY (id);


--
-- Name: planes_intervencion planes_intervencion_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.planes_intervencion
    ADD CONSTRAINT planes_intervencion_pkey PRIMARY KEY (id);


--
-- Name: seguimientos_caso seguimientos_caso_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.seguimientos_caso
    ADD CONSTRAINT seguimientos_caso_pkey PRIMARY KEY (id);


--
-- Name: matriculas_estudiante uq_estudiante_anio; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.matriculas_estudiante
    ADD CONSTRAINT uq_estudiante_anio UNIQUE (estudiante_id, anio_lectivo);


--
-- Name: incidente_estudiantes uq_incidente_estudiante; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.incidente_estudiantes
    ADD CONSTRAINT uq_incidente_estudiante UNIQUE (incidente_id, estudiante_id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: admin_disciplina
--

CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);


--
-- Name: idx_auditoria_entidad; Type: INDEX; Schema: public; Owner: admin_disciplina
--

CREATE INDEX idx_auditoria_entidad ON public.auditoria_sistema USING btree (entidad, entidad_id);


--
-- Name: idx_estudiantes_apellidos_nombres; Type: INDEX; Schema: public; Owner: admin_disciplina
--

CREATE INDEX idx_estudiantes_apellidos_nombres ON public.estudiantes USING btree (apellidos, nombres);


--
-- Name: idx_incidente_estudiantes_estudiante; Type: INDEX; Schema: public; Owner: admin_disciplina
--

CREATE INDEX idx_incidente_estudiantes_estudiante ON public.incidente_estudiantes USING btree (estudiante_id);


--
-- Name: idx_incidente_part_snapshot; Type: INDEX; Schema: public; Owner: admin_disciplina
--

CREATE INDEX idx_incidente_part_snapshot ON public.incidente_estudiantes USING btree (anio_lectivo, grado_momento);


--
-- Name: idx_incidentes_fecha; Type: INDEX; Schema: public; Owner: admin_disciplina
--

CREATE INDEX idx_incidentes_fecha ON public.incidentes USING btree (fecha_incidente);


--
-- Name: idx_matriculas_anio_grado; Type: INDEX; Schema: public; Owner: admin_disciplina
--

CREATE INDEX idx_matriculas_anio_grado ON public.matriculas_estudiante USING btree (anio_lectivo, grado, grupo);


--
-- Name: idx_planes_intervencion_estudiante; Type: INDEX; Schema: public; Owner: admin_disciplina
--

CREATE INDEX idx_planes_intervencion_estudiante ON public.planes_intervencion USING btree (estudiante_id);


--
-- Name: idx_seguimientos_caso_plan; Type: INDEX; Schema: public; Owner: admin_disciplina
--

CREATE INDEX idx_seguimientos_caso_plan ON public.seguimientos_caso USING btree (plan_id);


--
-- Name: auditoria_sistema auditoria_sistema_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.auditoria_sistema
    ADD CONSTRAINT auditoria_sistema_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: incidente_estudiantes incidente_estudiantes_catalogo_falta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.incidente_estudiantes
    ADD CONSTRAINT incidente_estudiantes_catalogo_falta_id_fkey FOREIGN KEY (catalogo_falta_id) REFERENCES public.catalogo_faltas(id) ON DELETE RESTRICT;


--
-- Name: incidente_estudiantes incidente_estudiantes_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.incidente_estudiantes
    ADD CONSTRAINT incidente_estudiantes_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.estudiantes(id) ON DELETE RESTRICT;


--
-- Name: incidente_estudiantes incidente_estudiantes_incidente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.incidente_estudiantes
    ADD CONSTRAINT incidente_estudiantes_incidente_id_fkey FOREIGN KEY (incidente_id) REFERENCES public.incidentes(id) ON DELETE CASCADE;


--
-- Name: incidentes incidentes_docente_reporta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.incidentes
    ADD CONSTRAINT incidentes_docente_reporta_id_fkey FOREIGN KEY (docente_reporta_id) REFERENCES public.docentes(id) ON DELETE RESTRICT;


--
-- Name: incidentes incidentes_lugar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.incidentes
    ADD CONSTRAINT incidentes_lugar_id_fkey FOREIGN KEY (lugar_id) REFERENCES public.lugares(id) ON DELETE RESTRICT;


--
-- Name: incidentes incidentes_usuario_registro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.incidentes
    ADD CONSTRAINT incidentes_usuario_registro_id_fkey FOREIGN KEY (usuario_registro_id) REFERENCES public.usuarios(id) ON DELETE RESTRICT;


--
-- Name: matriculas_estudiante matriculas_estudiante_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.matriculas_estudiante
    ADD CONSTRAINT matriculas_estudiante_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.estudiantes(id) ON DELETE RESTRICT;


--
-- Name: planes_intervencion planes_intervencion_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.planes_intervencion
    ADD CONSTRAINT planes_intervencion_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.estudiantes(id) ON DELETE RESTRICT;


--
-- Name: planes_intervencion planes_intervencion_incidente_origen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.planes_intervencion
    ADD CONSTRAINT planes_intervencion_incidente_origen_id_fkey FOREIGN KEY (incidente_origen_id) REFERENCES public.incidentes(id) ON DELETE SET NULL;


--
-- Name: planes_intervencion planes_intervencion_orientador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.planes_intervencion
    ADD CONSTRAINT planes_intervencion_orientador_id_fkey FOREIGN KEY (orientador_id) REFERENCES public.usuarios(id) ON DELETE RESTRICT;


--
-- Name: seguimientos_caso seguimientos_caso_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.seguimientos_caso
    ADD CONSTRAINT seguimientos_caso_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.planes_intervencion(id) ON DELETE CASCADE;


--
-- Name: seguimientos_caso seguimientos_caso_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_disciplina
--

ALTER TABLE ONLY public.seguimientos_caso
    ADD CONSTRAINT seguimientos_caso_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: admin_disciplina
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict 7pnUNgB1tGDSUxADgm6tS2hqpmYJJy8utuWZ3LguvokoEggGDvNEUzRFyVxEC7e

