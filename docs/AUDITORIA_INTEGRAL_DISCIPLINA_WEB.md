# INFORME DE AUDITORÍA TÉCNICA INTEGRAL • DISCIPLINA WEB
> **Evaluación Arquitectónica, Postura de Seguridad, Calidad de Código y Detección de "Vibecoding"**  
> *Fecha:* Septiembre 2026 | *Clasificación:* Senior Technical Assessment  
> *Stack Auditado:* Spring Boot 3.3.4 (Java 21/24) • PostgreSQL 16 • React 18.3 (TypeScript) • Vite • Tailwind CSS

---

## 1. Resumen Ejecutivo y Diagnóstico Global

El software **Disciplina Web** cuenta con una base conceptual sobresaliente en cuanto a modelado del dominio escolar colombiano (Ley 1620 de 2013, snapshot histórico inmutable de matrícula y debido proceso). Sin embargo, el análisis estático y dinámico revela **brechas de seguridad críticas**, **errores de compilación en entornos modernos**, **antipatrones de rendimiento (N+1, O(N) en memoria)** y **síntomas evidentes de "vibecoding"** (heurísticas arbitrarias generadas por IA que contradicen las reglas de negocio y duplicación masiva de componentes).

### Matriz de Severidad de Hallazgos

| Categoría | Crítico | Alto | Medio | Bajo | Total |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Seguridad & Autenticación (OWASP)** | 1 | 2 | 2 | 1 | **6** |
| **Bugs Funcionales & Compilación** | 1 | 1 | 1 | 0 | **3** |
| **Arquitectura & Rendimiento (DB/Backend)** | 0 | 2 | 2 | 1 | **5** |
| **Vibecoding & Calidad Frontend** | 1 | 1 | 2 | 1 | **5** |
| **TOTAL** | **3** | **6** | **7** | **3** | **19** |

---

## 2. Brechas de Seguridad y Control de Acceso (Security Review)

### 2.1 [CRÍTICO] Spoofing de IP y Evasión del Rate Limiting vía `X-Forwarded-For`
- **Ubicación:** [`AuthController.java#L88-L97`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/backend/src/main/java/com/disciplina/controller/AuthController.java#L88-L97) y [`AuditoriaService.java#L193-L207`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/backend/src/main/java/com/disciplina/service/AuditoriaService.java#L193-L207)
- **Problema:** El método `obtenerIpCliente()` confía ciegamente en la cabecera HTTP `X-Forwarded-For` enviada por el cliente:
  ```java
  String xForwardedFor = request.getHeader("X-Forwarded-For");
  if (xForwardedFor != null && !xForwardedFor.isBlank()) {
      return xForwardedFor.split(",")[0].trim();
  }
  ```
- **Impacto:** Cualquier atacante puede enviar un valor falso (`X-Forwarded-For: 1.2.3.4`) en cada intento de login. Esto elude por completo el bloqueo por fuerza bruta de `LoginRateLimiterService` o permite bloquear intencionalmente a usuarios legítimos suplantando su dirección IP (*Denial of Service* selectivo). Además, contamina la trazabilidad legal en `auditoria_sistema`.
- **Remediación:** Utilizar únicamente `request.getRemoteAddr()`, a menos que Spring Boot esté configurado explícitamente con `server.forward-headers-strategy=native` y una lista estricta de *trusted proxies* verificados a nivel de infraestructura.

### 2.2 [ALTO] Omisión Absoluta de Auditoría en `ConfiguracionService`
- **Ubicación:** [`ConfiguracionService.java`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/backend/src/main/java/com/disciplina/service/ConfiguracionService.java)
- **Problema:** A diferencia de `IncidenteService` y `PlanIntervencionService`, el servicio de configuración no inyecta ni invoca `AuditoriaService.registrarAuditoria` en **ninguna** de sus operaciones críticas:
  - Creación y edición de usuarios del personal (`ROLE_RECTOR`, `ROLE_ORIENTADOR`).
  - Cambio forzado de contraseñas hash BCrypt.
  - Modificación o eliminación lógica del Catálogo de Faltas institucionales.
  - Alteración de áreas de desempeño, docentes y lugares.
- **Impacto:** Vulneración de la trazabilidad forense. Un directivo o un atacante con credenciales comprometidas puede crear cuentas administrativas fantasmas o alterar tipologías de faltas sin que quede registro en `auditoria_sistema`.
- **Remediación:** Integrar llamadas obligatorias a `auditoriaService.registrarAuditoria` en `crearUsuario`, `actualizarUsuario`, `toggleActivoUsuario` y en los catálogos base (enmascarando siempre el campo `passwordHash`).

### 2.3 [ALTO] Escalación / Auto-Desactivación en `ConfiguracionService.actualizarUsuario`
- **Ubicación:** [`ConfiguracionService.java#L290-L306`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/backend/src/main/java/com/disciplina/service/ConfiguracionService.java#L290-L306)
- **Problema:** En `toggleActivoUsuario` existe una guarda para evitar que el usuario autenticado se desactive a sí mismo:
  ```java
  if (usuario.getUsername().equals(currentUsername) && Boolean.TRUE.equals(usuario.getActivo())) {
      throw new IllegalStateException("No puede desactivar su propia cuenta activa.");
  }
  ```
  Sin embargo, en el método `actualizarUsuario` (invocado por `PUT /api/v1/configuracion/usuarios/{id}`), **esa guarda no existe**.
- **Impacto:** Si un rector edita su propio usuario enviando `activo: false` o alterando el campo `rol` a `ROLE_ORIENTADOR`, el sistema lo ejecutará de inmediato, dejándolo fuera del sistema o sin acceso al panel directivo sin posibilidad de recuperación autónoma.
- **Remediación:** Replicar la validación contra `SecurityContextHolder` en `actualizarUsuario` para prohibir la auto-desactivación y la auto-degradación de rol.

### 2.4 [MEDIO] Exposición de API Key de Gemini en URL Query Parameters
- **Ubicación:** [`GeminiClient.java#L51-L54`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/backend/src/main/java/com/disciplina/service/ia/GeminiClient.java#L51-L54)
- **Problema:** La clave de API se interpola directamente en el query string:
  ```java
  String url = String.format("https://generativelanguage.googleapis.com/...:generateContent?key=%s", model, apiKey);
  ```
- **Impacto:** Las URLs quedan registradas en texto claro en logs de proxys corporativos, herramientas de monitoreo APM y volcados de trazas de red.
- **Remediación:** Migrar al encabezado oficial HTTP `x-goog-api-key: <API_KEY>`, manteniendo la URL limpia.

### 2.5 [MEDIO] Almacenamiento de Token JWT en `localStorage` (Riesgo XSS)
- **Ubicación:** [`useAuthStore.ts#L50`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/frontend/src/core/auth/useAuthStore.ts#L50) y [`apiClient.ts#L14`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/frontend/src/core/api/apiClient.ts#L14)
- **Problema:** Los tokens JWT con vigencia de 8 horas se guardan en `localStorage`.
- **Impacto:** Cualquier vulnerabilidad XSS introducida en dependencias NPM o componentes permite a un script malicioso leer `localStorage.getItem('disciplina_token')` y exfiltrar la sesión completa.
- **Remediación:** En una siguiente fase enterprise, migrar a cookies `HttpOnly; Secure; SameSite=Strict` o `Lax`, con rotación de Refresh Tokens.

---

## 3. Bugs Funcionales y Problemas de Compilación

### 3.1 [CRÍTICO] Falla Catastrófica de Compilación en JDK 24 (Incompatibilidad Lombok)
- **Evidencia Técnica:** Al ejecutar `.\mvnw.cmd test -q`, la compilación aborta con:
  `[ERROR] Fatal error compiling: java.lang.ExceptionInInitializerError: com.sun.tools.javac.code.TypeTag :: UNKNOWN`
- **Causa Raíz:** El entorno tiene instalado JDK 24 (`build 24.0.2`), pero Spring Boot 3.3.4 importa por defecto Lombok `1.18.34`. Java 24 modificó la clase interna del compilador `com.sun.tools.javac.code.TypeTag`, haciendo que Lombok 1.18.34 falle en tiempo de compilación.
- **Remediación:**
  1. Forzar en `pom.xml` la propiedad `<lombok.version>1.18.36</lombok.version>` (versión que añade soporte para JDK 24), o
  2. Configurar explícitamente Maven Toolchains para obligar a compilar exclusivamente con JDK 21 LTS como exige la documentación.

### 3.2 [ALTO] Desincronización de Rutas en Reporte Consolidado Anual
- **Evidencia:**
  - En `SecurityConfig.java#L122`: `.requestMatchers("/reportes/pdf/consolidado-anual").hasAuthority("ROLE_RECTOR")`
  - En `CONTEXT.md#L277`: `GET /reportes/pdf/consolidado-anual`
  - En `ReporteController.java#L43`: `@GetMapping("/pdf/consolidado-rectoria")`
- **Impacto:** En `SecurityConfig.java`, la ruta `/reportes/**` está permitida para `ROLE_ORIENTADOR`. Al no coincidir el nombre exacto de la excepción en `SecurityConfig`, la seguridad recae únicamente en la anotación `@PreAuthorize` del método. Si un desarrollador altera las anotaciones o desactiva method security, el endpoint queda expuesto a Orientadores.
- **Remediación:** Estandarizar la URI a `/reportes/pdf/consolidado-anual` tanto en el controlador como en `rectoriaApi.ts` y `SecurityConfig.java`.

### 3.3 [MEDIO] Deriva en Privilegios de Carga Masiva de Matrículas (SAD vs Código)
- **Evidencia:**
  - `SAD-DisciplinaWeb-v3.md` (CU-02 y Tabla 15) y `CONTEXT.md` (Diagrama de Flujo 6) especifican que el **Orientador** puede cargar matrículas Excel.
  - En `MatriculaController.java#L44`: `@PreAuthorize("hasRole('RECTOR')")`.
  - En `AppRoutes.tsx#L67`: La ruta `/rectoria/matriculas` solo existe en el layout del Rector.
- **Impacto:** Si un Orientador intenta ingresar a la funcionalidad o consultar la plantilla, el backend responde `403 Forbidden`. Hay inconsistencia de especificación funcional.
- **Remediación:** Alinear la definición: si la carga masiva es competencia exclusiva de Rectoría (lo recomendado por seguridad de censo), actualizar la documentación oficial del SAD y CONTEXT.md.

---

## 4. Antipatrones de Arquitectura y Rendimiento (Full-Stack Audit)

### 4.1 [ALTO] Problema de Consultas N+1 en Listado de Planes de Intervención
- **Ubicación:** [`PlanIntervencionService.java#L100-L104`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/backend/src/main/java/com/disciplina/service/PlanIntervencionService.java#L100-L104) y [`L120-L124`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/backend/src/main/java/com/disciplina/service/PlanIntervencionService.java#L120-L124)
- **Antipatrón:**
  ```java
  List<PlanIntervencionResponseDTO> dtos = resultado.getContent().stream()
      .map(p -> {
          List<SeguimientoCaso> segs = seguimientoCasoRepository.findByPlanIdConUsuario(p.getId());
          return mapearADTO(p, segs);
      })
      .collect(Collectors.toList());
  ```
- **Impacto:** Para paginar 20 planes, Hibernate dispara **21 consultas SQL consecutivas** a PostgreSQL (1 para los planes + 20 para los seguimientos de cada plan).
- **Remediación:** En vistas tabulares paginadas, **no se deben cargar los seguimientos históricos completos de cada plan**. Debe mostrarse solo el conteo o el último seguimiento, o resolverse mediante una consulta con `JOIN FETCH` / batch fetch (`findByPlanIdIn(...)`).

### 4.2 [ALTO] Volcado Completo de Base de Datos en Memoria (`findAll()`) en Importación Excel
- **Ubicación:** [`ImportadorMatriculasService.java#L183-L185`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/backend/src/main/java/com/disciplina/service/ImportadorMatriculasService.java#L183-L185)
- **Antipatrón:**
  ```java
  Map<String, Estudiante> estudiantesCache = estudianteRepository.findAll().stream()
      .collect(Collectors.toMap(Estudiante::getDocumento, e -> e, (a, b) -> a, HashMap::new));
  ```
- **Impacto:** En una institución consolidada con 5,000 a 10,000 alumnos acumulados a lo largo de varios años, cada vez que se sube un Excel, el backend hace `SELECT * FROM estudiantes`, transfiriendo toda la tabla por red y saturando la memoria Heap de la JVM.
- **Remediación:** Extraer primero el `Set<String>` de documentos presentes en el archivo Excel procesado y consultar únicamente los coincidentes:
  `estudianteRepository.findByDocumentoIn(documentosDelExcel)`.

### 4.3 [MEDIO] Rate Limiting en Memoria Volátil (`ConcurrentHashMap`)
- **Ubicación:** [`LoginRateLimiterService.java`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/backend/src/main/java/com/disciplina/security/LoginRateLimiterService.java)
- **Antipatrón:** Almacenamiento de estado transaccional de seguridad en memoria local de la instancia.
- **Impacto:**
  1. Si la aplicación se escala horizontalmente en dos o más réplicas o contenedores Docker, los intentos fallidos no se sincronizan.
  2. La limpieza periódica (`limpiarExpirados`) solo se ejecuta si el mapa supera 500 entradas (`size() > 500`), reteniendo memoria de forma innecesaria ante escaneos de IPs aleatorias.
- **Remediación:** Para entornos distribuidos, delegar el control de tasa a Redis o a un API Gateway. Para instancia única, utilizar una caché acotada con TTL nativo como Caffeine (`Caffeine.newBuilder().expireAfterWrite(...).maximumSize(1000)`).

### 4.4 [MEDIO] Redundancia de Rutas por Confusión de `context-path`
- **Ubicación:** [`application.yml#L4`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/backend/src/main/resources/application.yml#L4) y todos los `@RestController`
- **Problema:** `application.yml` define `context-path: /api/v1`. Luego, los controladores declaran:
  `@RequestMapping({"/incidentes", "/api/v1/incidentes"})`
- **Impacto:** El backend responde en `/api/v1/incidentes` y simultáneamente en `/api/v1/api/v1/incidentes`. Esta duplicidad es una solución de "parche" que enturbia la arquitectura y la documentación OpenAPI/Swagger.
- **Remediación:** Mantener `context-path: /api/v1` en `application.yml` y limpiar los `@RequestMapping` en todos los controladores para que utilicen únicamente su ruta base relativa (`@RequestMapping("/incidentes")`).

---

## 5. Detección de "Vibecoding" y Deuda Técnica en IA (Vibe-Proofing)

### 5.1 [CRÍTICO] Heurística Arbitraria de Culpa en Fallback de Narrativas
- **Ubicación:** [`IaConvivenciaService.java#L342-L345`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/backend/src/main/java/com/disciplina/service/ia/IaConvivenciaService.java#L342-L345)
- **Código Detectado:**
  ```java
  RolEstudianteIncidente rol = primerEstudiante
          ? RolEstudianteIncidente.AGRESOR_PRINCIPAL
          : RolEstudianteIncidente.VICTIMA;
  ```
- **Diagnóstico:** Cuando Gemini no está disponible o falla la red, el sistema activa un algoritmo heurístico local. Este algoritmo busca qué estudiantes coinciden en el texto. **Al primer estudiante encontrado en el orden arbitrario del censo lo marca como `AGRESOR_PRINCIPAL`, y a todos los demás como `VICTIMA`**.
- **Gravedad Ética y Jurídica:** Si en una riña el nombre de la víctima aparece primero en el censo o en la lista, el sistema le imputa automáticamente la falta disciplinaria y el rol de agresor. Esto destruye la presunción de inocencia y genera fallas graves de debido proceso.
- **Remediación:** El fallback heurístico **NUNCA** debe presumir quién fue el agresor. Si la IA no está disponible para analizar la semántica del relato, todos los involucrados deben ingresar con rol `PARTICIPE` o requerir selección manual obligatoria por parte del orientador, con una alerta clara: *"Rol no determinado automáticamente; asigne los roles de acuerdo con la versión libre de los hechos"*.

### 5.2 [ALTO] Duplicación Masiva de Componentes en Frontend (1,428 líneas de código redundante)
- **Ubicación:**
  - [`PlanesIntervencionTab.tsx`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/frontend/src/features/matriculas/components/PlanesIntervencionTab.tsx) (834 líneas)
  - [`FormularPlanModal.tsx`](file:///C:/Users/sebas/Documents/GitHub/disciplina-web/frontend/src/features/planes/components/FormularPlanModal.tsx) (594 líneas)
- **Diagnóstico:** Ambos archivos implementan exactamente los mismos campos (diagnóstico, compromisos, recomendaciones de IA, fecha de control), las mismas llamadas a la API de Gemini y el mismo renderizado de advertencias. Fueron generados de forma aislada por IA para satisfacer dos vistas distintas (el expediente del alumno y la lista global de planes).
- **Impacto:** Cualquier cambio de diseño, validación o nuevo campo requiere modificar manualmente dos archivos gigantescos, con alto riesgo de desincronización y regresiones visuales.
- **Remediación:** Extraer un componente compartido `FormularioPlanIntervencion` y un custom hook `useFormularPlan` que maneje el estado y la invocación de IA de forma centralizada.

### 5.3 [MEDIO] Manejo Mudo de Excepciones en Vistas (`console.error`)
- **Ubicación:** Detectado en más de 15 componentes frontend (ej. `ExpedienteEstudianteModal.tsx#L67`, `PlanesIntervencionTab.tsx#L126`, `ConfiguracionPage.tsx#L462`).
- **Problema:** Bloques `catch (err) { console.error('Error...', err); }` donde la interfaz no muestra ninguna notificación toast ni mensaje de alerta al usuario, dejando la pantalla en un spinner infinito o sin respuesta perceptible.
- **Remediación:** Estandarizar la captura de errores mediante la utilidad centralizada `notify.error(extraerMensajeError(err))` o el hook de notificaciones existente.

---

## 6. Plan de Acción y Hoja de Ruta Priorizada

```mermaid
flowchart TD
    subgraph Fase 1 [Fase 1: Estabilización Inmediata & Seguridad Crítica]
        F1_1[Corregir compatibilidad Lombok 1.18.36 / JDK 24]
        F1_2[Sanitizar IP en AuthController eliminando spoofing X-Forwarded-For]
        F1_3[Eliminar heurística ciega de Agresor en fallback de IA]
        F1_4[Blindar auto-desactivación en actualizarUsuario]
    end

    subgraph Fase 2 [Fase 2: Integridad & Auditoría Forense]
        F2_1[Incorporar registrarAuditoria en ConfiguracionService]
        F2_2[Estandarizar rutas y SecurityConfig consolidado-anual]
        F2_3[Migrar clave de Gemini a header x-goog-api-key]
        F2_4[Alinear definición de permisos de Matrículas SAD vs Código]
    end

    subgraph Fase 3 [Fase 3: Rendimiento & Refactorización Frontend]
        F3_1[Eliminar N+1 en listarPlanesPaginados]
        F3_2[Optimizar carga de estudiantes en importador Excel]
        F3_3[Unificar FormularPlanModal y PlanesIntervencionTab]
        F3_4[Limpiar doble context-path /api/v1 en controladores]
    end

    Fase 1 --> Fase 2 --> Fase 3
```

### Tabla de Tareas Técnicas

| Prioridad | Tarea | Archivos Clave | Impacto |
| :---: | :--- | :--- | :--- |
| **P0** | Actualizar Lombok a `1.18.36` en `pom.xml` | `backend/pom.xml` | Restaura compilación en JDK 24 |
| **P0** | Desactivar spoofing de `X-Forwarded-For` no verificado | `AuthController.java`, `AuditoriaService.java` | Cierra brecha de evasión de rate limit |
| **P0** | Eliminar presunción de culpabilidad en fallback IA | `IaConvivenciaService.java` | Garantiza presunción de inocencia (Ley 1620) |
| **P1** | Auditar transacciones de configuración y usuarios | `ConfiguracionService.java` | Completa trazabilidad forense legal |
| **P1** | Impedir auto-desactivación en `PUT /usuarios/{id}` | `ConfiguracionService.java` | Previene bloqueo accidental de administradores |
| **P1** | Estandarizar URI reporte consolidado | `ReporteController.java`, `SecurityConfig.java` | Elimina desalineación de seguridad |
| **P2** | Resolver N+1 en listado de planes | `PlanIntervencionService.java` | Reduce de 20+ queries a 1 sola por página |
| **P2** | Filtrar estudiantes por documento en Excel | `ImportadorMatriculasService.java` | Evita volcado de miles de registros en RAM |
| **P2** | Unificar componentes de formulario de planes | `PlanesIntervencionTab.tsx`, `FormularPlanModal.tsx` | Elimina 1,400 líneas de código duplicado |
| **P3** | Limpiar `@RequestMapping` redundantes | Todos los controladores backend | Simplifica enrutamiento y contratos |
