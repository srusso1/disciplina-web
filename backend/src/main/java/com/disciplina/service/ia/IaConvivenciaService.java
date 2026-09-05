package com.disciplina.service.ia;

import com.disciplina.common.exception.RecursoNoEncontradoException;
import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.enums.RolEstudianteIncidente;
import com.disciplina.domain.model.*;
import com.disciplina.domain.repository.*;
import com.disciplina.dto.ia.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class IaConvivenciaService {

    private final GeminiClient geminiClient;
    private final EstudianteRepository estudianteRepository;
    private final MatriculaEstudianteRepository matriculaEstudianteRepository;
    private final CatalogoFaltaRepository catalogoFaltaRepository;
    private final LugarRepository lugarRepository;
    private final DocenteRepository docenteRepository;
    private final IncidenteRepository incidenteRepository;
    private final IncidenteEstudianteRepository incidenteEstudianteRepository;
    private final ObjectMapper objectMapper;

    public NarrativaProcesadaDTO procesarNarrativa(ProcesarNarrativaRequestDTO dto) {
        String relato = dto.getRelato().trim();
        int anio = (dto.getAnioLectivo() != null && dto.getAnioLectivo() > 2000)
                ? dto.getAnioLectivo()
                : LocalDate.now().getYear();

        List<Lugar> lugares = lugarRepository.findByActivoTrueOrderByNombreAsc();
        List<Docente> docentes = docenteRepository.findByActivoTrueOrderByApellidosAscNombresAsc();
        List<CatalogoFalta> faltas = catalogoFaltaRepository.findByActivoTrueOrderByClasificacionLeyAscCodigoAsc();
        List<MatriculaEstudiante> matriculas = matriculaEstudianteRepository.findByAnioLectivoConEstudiante(anio);

        if (geminiClient.isConfigurado()) {
            String promptSistema = construirPromptSistemaNarrativa(lugares, docentes, faltas);
            Optional<String> respuestaIa = geminiClient.generarContenidoEstructurado(promptSistema, relato);

            if (respuestaIa.isPresent()) {
                try {
                    NarrativaProcesadaDTO resultado = parsearRespuestaIaNarrativa(
                            respuestaIa.get(), lugares, docentes, faltas, matriculas, relato
                    );
                    resultado.setAsistidoPorIa(true);
                    resultado.setMensajeAsistente("Entidades y narrativa estructuradas con éxito mediante Google Gemini (Human-in-the-Loop: valide los campos antes de guardar).");
                    return resultado;
                } catch (Exception e) {
                    log.error("Error al deserializar respuesta JSON de Gemini: {}", e.getMessage());
                }
            }
        }

        // Fallback Heurístico Local Robusto cuando no hay API Key o hay falla de red
        return procesarNarrativaHeuristica(relato, lugares, docentes, faltas, matriculas);
    }

    public PropuestaIntervencionIADTO generarPropuestaIntervencion(GenerarPropuestaIntervencionDTO dto) {
        Estudiante est = estudianteRepository.findById(dto.getEstudianteId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Estudiante no encontrado con ID: " + dto.getEstudianteId()));

        Incidente incOrigen = null;
        if (dto.getIncidenteOrigenId() != null) {
            incOrigen = incidenteRepository.findById(dto.getIncidenteOrigenId()).orElse(null);
        }

        List<IncidenteEstudiante> antecedentes = incidenteEstudianteRepository.findByEstudianteIdConIncidente(est.getId());

        if (geminiClient.isConfigurado()) {
            String promptSistema = construirPromptSistemaIntervencion();
            String contextoUsuario = construirContextoUsuarioIntervencion(est, incOrigen, antecedentes);
            Optional<String> respuestaIa = geminiClient.generarContenidoEstructurado(promptSistema, contextoUsuario);

            if (respuestaIa.isPresent()) {
                try {
                    JsonNode root = objectMapper.readTree(respuestaIa.get());
                    return PropuestaIntervencionIADTO.builder()
                            .estudianteId(est.getId())
                            .estudianteNombre(est.getNombreCompleto())
                            .incidenteOrigenId(dto.getIncidenteOrigenId())
                            .diagnosticoSituacional(root.path("diagnosticoSituacional").asText("Diagnóstico formativo generado."))
                            .recomendacionesIa(root.path("recomendacionesIa").asText("Recomendaciones pedagógicas."))
                            .accionesAcordadasSugeridas(root.path("accionesAcordadasSugeridas").asText("Acciones de mediación y reparación."))
                            .compromisoPadresSugerido(root.path("compromisoPadresSugerido").asText("Acompañamiento familiar en casa."))
                            .semanasSeguimientoSugeridas(root.path("semanasSeguimientoSugeridas").asInt(4))
                            .asistidoPorIa(true)
                            .advertenciaGobierno("Propuesta pedagógica preliminar generada por IA. El Orientador Escolar debe evaluar y firmar el acuerdo según el Manual de Convivencia.")
                            .build();
                } catch (Exception e) {
                    log.error("Error al procesar JSON de propuesta de intervencion: {}", e.getMessage());
                }
            }
        }

        // Fallback Heurístico Local para Planes de Intervención
        return generarPropuestaIntervencionHeuristica(est, incOrigen, antecedentes);
    }

    private String construirPromptSistemaNarrativa(
            List<Lugar> lugares,
            List<Docente> docentes,
            List<CatalogoFalta> faltas) {

        String listaLugares = lugares.stream().map(Lugar::getNombre).collect(Collectors.joining(", "));
        String listaDocentes = docentes.stream().map(Docente::getNombreCompleto).collect(Collectors.joining(", "));
        String listaFaltas = faltas.stream()
                .map(f -> f.getCodigo() + " (" + f.getClasificacionLey() + ": " + f.getDescripcion() + ")")
                .collect(Collectors.joining("; "));

        return """
            Eres un Asistente Jurídico y Pedagógico Experto en Convivencia Escolar y Debido Proceso para instituciones educativas en Colombia (Ley 1620 de 2013 y Decreto 1965 de 2013, Art. 40).
            Tu objetivo es analizar relatos informales redactados por docentes o directivos y estructurarlos formalmente en el marco legal escolar colombiano.

            CRITERIOS JURÍDICOS ESTRICTOS DE CLASIFICACIÓN (DECRETO 1965 DE 2013, ART. 40):
            - TIPO_I: Conflictos cotidianos manejados inadecuadamente y situaciones esporádicas que inciden negativamente en el clima escolar, sin generar daño al cuerpo o a la salud física o mental (ej: discusiones verbales esporádicas, desavenencias, uso indebido de celular, indisciplina menor).
            - TIPO_II: Situaciones de agresión física (golpes, puñetazos, bofetadas, zancadillas, peleas o riñas entre estudiantes), agresión verbal reiterada, acoso escolar (bullying) o ciberacoso que NO revistan características de delito penal y que NO causen incapacidad médica certificada. Toda pelea, riña o agresión física ordinaria entre estudiantes dentro del plantel donde NO hubo armas ni hospitalización o incapacidad médica formal debe clasificarse ESTRICTAMENTE como TIPO_II (falta ART-201-T2).
            - TIPO_III: ÚNICAMENTE situaciones constitutivas de presuntos DELITOS PENALES bajo la legislación colombiana (porte o uso de armas de fuego o cortopunzantes, tráfico de estupefacientes, delitos contra la libertad y formación sexual, o agresiones físicas extremas con lesiones personales que causen hospitalización o incapacidad médica legal). NUNCA clasifiques un golpe simple, riña ordinaria o agresión entre pares como TIPO_III a menos que el relato manifieste explícitamente armas, abuso sexual o daño corporal grave con incapacidad médica legal.

            CRITERIOS JURÍDICOS DE ROLES Y ATRIBUCIÓN DE FALTAS (DEBIDO PROCESO):
            - AGRESOR_PRINCIPAL: Estudiante que ejecuta directamente la agresión física, verbal o psicológica. DEBE llevar faltaCodigoSugerido asignado del catálogo.
            - PARTICIPE: Estudiante que colabora activamente o interviene en riña mutua. DEBE llevar faltaCodigoSugerido.
            - VICTIMA: Estudiante receptor de la agresión o violencia (quien recibe el golpe, agresión o insulto). Su faltaCodigoSugerido DEBE SER OBLIGATORIAMENTE null (no cometió ninguna falta disciplinaria).
            - TESTIGO: Estudiante que presenció los hechos sin participar. Su faltaCodigoSugerido DEBE SER OBLIGATORIAMENTE null.

            Catálogos institucionales disponibles:
            - Lugares: %s
            - Docentes: %s
            - Tipificación Faltas: %s

            Debes responder OBLIGATORIAMENTE un JSON con esta estructura exacta:
            {
              "hechosEstandarizados": "Redacción objetiva, formal y cronológica de los hechos en tercera persona, sin adjetivos subjetivos",
              "lugarSugerido": "Nombre exacto del lugar más probable del catálogo o null",
              "docenteReporta": "Nombre del docente que reporta si se menciona o null",
              "clasificacionLeySugerida": "TIPO_I | TIPO_II | TIPO_III",
              "fechaMencionada": "YYYY-MM-DD si se menciona fecha específica o null",
              "horaMencionada": "HH:MM si se menciona hora o null",
              "estudiantes": [
                {
                  "nombreMencionado": "Nombre tal como se menciona en el relato",
                  "rolSugerido": "AGRESOR_PRINCIPAL | PARTICIPE | VICTIMA | TESTIGO",
                  "faltaCodigoSugerido": "Código exacto de la falta del catálogo (ej: ART-201-T2). OBLIGATORIO: null si es VICTIMA o TESTIGO",
                  "justificacionRol": "Breve explicación objetiva del rol asignado"
                }
              ]
            }
            """.formatted(listaLugares, listaDocentes, listaFaltas);
    }

    private NarrativaProcesadaDTO parsearRespuestaIaNarrativa(
            String json,
            List<Lugar> lugares,
            List<Docente> docentes,
            List<CatalogoFalta> faltas,
            List<MatriculaEstudiante> matriculas,
            String relatoOriginal) throws Exception {

        JsonNode root = objectMapper.readTree(json);

        String hechos = root.path("hechosEstandarizados").asText(relatoOriginal);
        String lugarTxt = root.path("lugarSugerido").asText(null);
        String docenteTxt = root.path("docenteReporta").asText(null);
        String clasifTxt = root.path("clasificacionLeySugerida").asText(null);
        String fechaTxt = root.path("fechaMencionada").asText(LocalDate.now().toString());
        String horaTxt = root.path("horaMencionada").asText(null);

        // Mapear Lugar
        Integer lugarId = null;
        String lugarNombre = null;
        if (lugarTxt != null && !lugarTxt.trim().isEmpty() && !lugarTxt.trim().equalsIgnoreCase("null")) {
            Lugar match = buscarMejorCoincidenciaLugar(lugarTxt, lugares);
            if (match != null) {
                lugarId = match.getId();
                lugarNombre = match.getNombre();
            } else {
                lugarNombre = lugarTxt.trim();
            }
        }

        // Mapear Docente
        Integer docenteId = null;
        String docenteNombre = null;
        if (docenteTxt != null && !docenteTxt.trim().isEmpty() && !docenteTxt.trim().equalsIgnoreCase("null")) {
            Docente match = buscarMejorCoincidenciaDocente(docenteTxt, docentes);
            if (match != null) {
                docenteId = match.getId();
                docenteNombre = match.getNombreCompleto();
            } else {
                docenteNombre = docenteTxt.trim();
            }
        }

        ClasificacionLey clasificacionLey = null;
        if (clasifTxt != null) {
            String cNormal = clasifTxt.trim().replace(" ", "_").replace("-", "_").toUpperCase();
            if (cNormal.contains("III") || cNormal.endsWith("_3") || cNormal.equals("3")) {
                clasificacionLey = ClasificacionLey.TIPO_III;
            } else if (cNormal.contains("II") || cNormal.endsWith("_2") || cNormal.equals("2")) {
                clasificacionLey = ClasificacionLey.TIPO_II;
            } else if (cNormal.contains("I") || cNormal.endsWith("_1") || cNormal.equals("1")) {
                clasificacionLey = ClasificacionLey.TIPO_I;
            }
        }

        List<EstudianteIdentificadoIADTO> estudiantesIdentificados = new ArrayList<>();
        JsonNode estArray = root.path("estudiantes");
        if (estArray.isArray()) {
            for (JsonNode estNode : estArray) {
                String nombreMencionado = estNode.path("nombreMencionado").asText("");
                String rolTxt = estNode.path("rolSugerido").asText("PARTICIPE");
                String faltaCod = estNode.path("faltaCodigoSugerido").asText(null);
                String justificacion = estNode.path("justificacionRol").asText("");

                RolEstudianteIncidente rol = RolEstudianteIncidente.PARTICIPE;
                try {
                    rol = RolEstudianteIncidente.valueOf(rolTxt.trim().toUpperCase());
                } catch (IllegalArgumentException e) {
                    log.warn("Rol sugerido por IA '{}' no reconocido para {}. Asignando PARTICIPE por defecto.", rolTxt, nombreMencionado);
                }

                // Matching con la base de datos de estudiantes
                MatriculaEstudiante matchMatricula = buscarMejorCoincidenciaEstudiante(nombreMencionado, matriculas);

                Integer faltaId = null;
                CatalogoFalta cfMatch = null;
                boolean esParteProtegida = (rol == RolEstudianteIncidente.VICTIMA || rol == RolEstudianteIncidente.TESTIGO);

                // Salvaguarda jurídica de Debido Proceso: Víctimas y Testigos NO cometen falta disciplinaria
                String faltaCodigoEfectivo = esParteProtegida ? null : faltaCod;

                if (faltaCodigoEfectivo != null) {
                    cfMatch = faltas.stream()
                            .filter(f -> f.getCodigo().equalsIgnoreCase(faltaCodigoEfectivo.trim()))
                            .findFirst().orElse(null);
                    if (cfMatch != null) {
                        faltaId = cfMatch.getId();
                        if (clasificacionLey == null) {
                            clasificacionLey = cfMatch.getClasificacionLey();
                        }
                    }
                }

                EstudianteIdentificadoIADTO.EstudianteIdentificadoIADTOBuilder b = EstudianteIdentificadoIADTO.builder()
                        .nombreMencionado(nombreMencionado)
                        .rolSugerido(rol)
                        .catalogoFaltaId(faltaId)
                        .faltaCodigo(faltaCodigoEfectivo)
                        .justificacionRol(justificacion);

                if (matchMatricula != null) {
                    Estudiante e = matchMatricula.getEstudiante();
                    b.estudianteId(e.getId())
                     .documento(e.getDocumento())
                     .nombreCompleto(e.getNombreCompleto())
                     .gradoMomento(matchMatricula.getGrado())
                     .grupoMomento(matchMatricula.getGrupo());
                }

                estudiantesIdentificados.add(b.build());
            }
        }

        return NarrativaProcesadaDTO.builder()
                .hechosEstandarizados(hechos)
                .lugarSugeridoId(lugarId)
                .lugarNombre(lugarNombre)
                .docenteReportaId(docenteId)
                .docenteReportaNombre(docenteNombre)
                .clasificacionLeySugerida(clasificacionLey)
                .fechaSugerida(fechaTxt)
                .horaSugerida(horaTxt)
                .estudiantes(estudiantesIdentificados)
                .build();
    }

    private NarrativaProcesadaDTO procesarNarrativaHeuristica(
            String relato,
            List<Lugar> lugares,
            List<Docente> docentes,
            List<CatalogoFalta> faltas,
            List<MatriculaEstudiante> matriculas) {

        String relatoLower = relato.toLowerCase();

        // 1. Detectar Lugar
        Lugar lugarDetectado = buscarMejorCoincidenciaLugar(relato, lugares);

        // 2. Detectar Docente
        Docente docenteDetectado = buscarMejorCoincidenciaDocente(relato, docentes);

        // 3. Detectar Clasificación Ley 1620 y Falta
        ClasificacionLey leyDetectada = ClasificacionLey.TIPO_I;
        CatalogoFalta faltaDetectada = null;

        if (relatoLower.contains("arma") || relatoLower.contains("drog") || relatoLower.contains("delito") || relatoLower.contains("abuso")) {
            leyDetectada = ClasificacionLey.TIPO_III;
        } else if (relatoLower.contains("golpe") || relatoLower.contains("pelea") || relatoLower.contains("pego") || relatoLower.contains("pegó") || relatoLower.contains("agred") || relatoLower.contains("lesion") || relatoLower.contains("acoso") || relatoLower.contains("hurto")) {
            leyDetectada = ClasificacionLey.TIPO_II;
        }

        final ClasificacionLey finalLey = leyDetectada;
        faltaDetectada = faltas.stream()
                .filter(f -> f.getClasificacionLey() == finalLey)
                .findFirst().orElse(null);

        // 4. Detectar Estudiantes del plantel que aparecen en el relato
        List<EstudianteIdentificadoIADTO> estudiantes = new ArrayList<>();
        boolean primerEstudiante = true;

        for (MatriculaEstudiante m : matriculas) {
            Estudiante e = m.getEstudiante();
            String nombreCompleto = e.getNombreCompleto().toLowerCase();
            String nombres = e.getNombres().toLowerCase();
            String apellidos = e.getApellidos().toLowerCase();

            boolean coincide = relatoLower.contains(nombreCompleto) ||
                    (nombres.length() > 3 && relatoLower.contains(nombres) && apellidos.length() > 3 && relatoLower.contains(apellidos));

            if (coincide) {
                RolEstudianteIncidente rol = primerEstudiante
                        ? RolEstudianteIncidente.AGRESOR_PRINCIPAL
                        : RolEstudianteIncidente.VICTIMA;

                boolean esSujetoPasivo = (rol == RolEstudianteIncidente.VICTIMA || rol == RolEstudianteIncidente.TESTIGO);
                Integer faltaIdHeuristica = esSujetoPasivo ? null : (faltaDetectada != null ? faltaDetectada.getId() : null);
                String faltaCodHeuristica = esSujetoPasivo ? null : (faltaDetectada != null ? faltaDetectada.getCodigo() : null);

                estudiantes.add(EstudianteIdentificadoIADTO.builder()
                        .nombreMencionado(e.getNombreCompleto())
                        .estudianteId(e.getId())
                        .documento(e.getDocumento())
                        .nombreCompleto(e.getNombreCompleto())
                        .gradoMomento(m.getGrado())
                        .grupoMomento(m.getGrupo())
                        .rolSugerido(rol)
                        .catalogoFaltaId(faltaIdHeuristica)
                        .faltaCodigo(faltaCodHeuristica)
                        .justificacionRol(esSujetoPasivo
                                ? "Identificado como parte afectada / víctima (no incurre en falta disciplinaria)."
                                : "Identificado por análisis de coincidencia nominal en el relato.")
                        .build());

                primerEstudiante = false;
            }
        }

        // Si no se encontró ningún estudiante por coincidencia exacta, dejar un marcador para completitud
        if (estudiantes.isEmpty()) {
            estudiantes.add(EstudianteIdentificadoIADTO.builder()
                    .nombreMencionado("Estudiante(s) por vincular")
                    .rolSugerido(RolEstudianteIncidente.AGRESOR_PRINCIPAL)
                    .catalogoFaltaId(faltaDetectada != null ? faltaDetectada.getId() : null)
                    .faltaCodigo(faltaDetectada != null ? faltaDetectada.getCodigo() : null)
                    .justificacionRol("Por favor seleccione el estudiante involucrado desde el buscador.")
                    .build());
        }

        return NarrativaProcesadaDTO.builder()
                .hechosEstandarizados(relato)
                .lugarSugeridoId(lugarDetectado != null ? lugarDetectado.getId() : null)
                .lugarNombre(lugarDetectado != null ? lugarDetectado.getNombre() : null)
                .docenteReportaId(docenteDetectado != null ? docenteDetectado.getId() : null)
                .docenteReportaNombre(docenteDetectado != null ? docenteDetectado.getNombreCompleto() : null)
                .clasificacionLeySugerida(leyDetectada)
                .fechaSugerida(LocalDate.now().toString())
                .estudiantes(estudiantes)
                .asistidoPorIa(false)
                .mensajeAsistente("Asistente PLN operando en modo heurístico institucional (sin conexión externa a Gemini). Verifique y ajuste cada campo según el caso.")
                .build();
    }

    private MatriculaEstudiante buscarMejorCoincidenciaEstudiante(String texto, List<MatriculaEstudiante> matriculas) {
        if (texto == null || texto.trim().isEmpty() || matriculas == null) return null;
        String t = normalizarTexto(texto);

        // Coincidencia exacta de nombre completo
        for (MatriculaEstudiante m : matriculas) {
            if (normalizarTexto(m.getEstudiante().getNombreCompleto()).equals(t)) {
                return m;
            }
        }

        // Coincidencia de inclusión
        for (MatriculaEstudiante m : matriculas) {
            String nc = normalizarTexto(m.getEstudiante().getNombreCompleto());
            if (nc.contains(t) || t.contains(nc)) {
                return m;
            }
        }

        // Coincidencia por apellidos o nombres individuales
        String[] partes = t.split("\\s+");
        for (MatriculaEstudiante m : matriculas) {
            Estudiante e = m.getEstudiante();
            String nombresNorm = normalizarTexto(e.getNombres());
            String apellidosNorm = normalizarTexto(e.getApellidos());
            int coincidencias = 0;
            for (String p : partes) {
                if (p.length() > 3 && (nombresNorm.contains(p) || apellidosNorm.contains(p))) {
                    coincidencias++;
                }
            }
            if (coincidencias >= 2) {
                return m;
            }
        }

        return null;
    }

    private Docente buscarMejorCoincidenciaDocente(String texto, List<Docente> docentes) {
        if (texto == null || texto.trim().isEmpty() || docentes == null || docentes.isEmpty()) {
            return null;
        }

        String tNorm = normalizarTexto(texto);

        // 1. Coincidencia exacta de nombre completo
        for (Docente d : docentes) {
            if (normalizarTexto(d.getNombreCompleto()).equals(tNorm)) {
                return d;
            }
        }

        // 2. Coincidencia por contención bidireccional
        for (Docente d : docentes) {
            String ncNorm = normalizarTexto(d.getNombreCompleto());
            if (ncNorm.contains(tNorm) || tNorm.contains(ncNorm)) {
                return d;
            }
        }

        // 3. Coincidencia por tokens significativos (nombre + apellido)
        Set<String> stopWords = Set.of("docente", "profesor", "profesora", "profe", "licenciado", "licenciada", "el", "la", "de", "del");
        List<String> tokensTexto = Arrays.stream(tNorm.split("\\s+"))
                .filter(tk -> tk.length() > 2 && !stopWords.contains(tk))
                .toList();

        Docente mejorCandidato = null;
        int maxCoincidencias = 0;

        for (Docente d : docentes) {
            String nombresNorm = normalizarTexto(d.getNombres());
            String apellidosNorm = normalizarTexto(d.getApellidos());

            int coincidencias = 0;
            boolean tieneNombre = false;
            boolean tieneApellido = false;

            for (String tk : tokensTexto) {
                if (nombresNorm.contains(tk)) {
                    coincidencias++;
                    tieneNombre = true;
                } else if (apellidosNorm.contains(tk)) {
                    coincidencias++;
                    tieneApellido = true;
                }
            }

            if ((tieneNombre && tieneApellido) || coincidencias >= 2) {
                if (coincidencias > maxCoincidencias) {
                    maxCoincidencias = coincidencias;
                    mejorCandidato = d;
                }
            }
        }

        return mejorCandidato;
    }

    private Lugar buscarMejorCoincidenciaLugar(String texto, List<Lugar> lugares) {
        if (texto == null || texto.trim().isEmpty() || lugares == null || lugares.isEmpty()) {
            return null;
        }

        String tNorm = normalizarTexto(texto);

        // 1. Coincidencia exacta
        for (Lugar l : lugares) {
            if (normalizarTexto(l.getNombre()).equals(tNorm)) {
                return l;
            }
        }

        // 2. Coincidencia por contención bidireccional
        for (Lugar l : lugares) {
            String lNorm = normalizarTexto(l.getNombre());
            if (lNorm.contains(tNorm) || tNorm.contains(lNorm)) {
                return l;
            }
        }

        // 3. Coincidencia por tokens significativos
        Set<String> stopWords = Set.of("en", "el", "la", "de", "los", "las", "del", "un", "una", "institucional", "escolar");
        List<String> tokens = Arrays.stream(tNorm.split("\\s+"))
                .filter(tk -> tk.length() > 3 && !stopWords.contains(tk))
                .toList();

        Lugar mejorLugar = null;
        int maxPuntos = 0;

        for (Lugar l : lugares) {
            String lNorm = normalizarTexto(l.getNombre());
            int puntos = 0;
            for (String tk : tokens) {
                if (lNorm.contains(tk)) {
                    puntos++;
                }
            }
            if (puntos > maxPuntos) {
                maxPuntos = puntos;
                mejorLugar = l;
            }
        }

        return mejorLugar;
    }

    private String normalizarTexto(String texto) {
        if (texto == null) return "";
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .trim();
    }

    private String construirPromptSistemaIntervencion() {
        return """
            Eres un Orientador Escolar y Pedagogo experto en Convivencia Escolar y Justicia Restaurativa en Colombia (Ley 1620 de 2013).
            Debes generar una propuesta estructurada de Plan de Intervención Pedagógica individual para un estudiante con antecedentes disciplinarios.
            El enfoque DEBE ser restaurativo y formativo, no punitivo.
            
            Responde OBLIGATORIAMENTE un JSON con esta estructura exacta:
            {
              "diagnosticoSituacional": "Análisis comprensivo del comportamiento del estudiante y factores de riesgo observados",
              "recomendacionesIa": "Estrategias pedagógicas y socioemocionales sugeridas para orientación y docentes",
              "accionesAcordadasSugeridas": "Acciones pedagógicas concretas, compromisos restaurativos y talleres socioemocionales",
              "compromisoPadresSugerido": "Pautas de acompañamiento, supervisión y comunicación asertiva para la familia",
              "semanasSeguimientoSugeridas": 4
            }
            """;
    }

    private String construirContextoUsuarioIntervencion(
            Estudiante est,
            Incidente incOrigen,
            List<IncidenteEstudiante> antecedentes) {

        StringBuilder sb = new StringBuilder();
        sb.append("Estudiante: ").append(est.getNombreCompleto()).append("\n");
        sb.append("Total antecedentes registrados: ").append(antecedentes.size()).append("\n");

        if (incOrigen != null) {
            sb.append("Incidente origen de la intervención:\n");
            sb.append("- Fecha: ").append(incOrigen.getFechaIncidente()).append("\n");
            sb.append("- Hechos: ").append(incOrigen.getDescripcionHechos()).append("\n");
            sb.append("- Estado actual: ").append(incOrigen.getEstadoProceso()).append("\n");
        }

        if (!antecedentes.isEmpty()) {
            sb.append("Historial previo de incidentes:\n");
            for (IncidenteEstudiante ie : antecedentes) {
                sb.append("- Rol: ").append(ie.getRolEstudiante());
                if (ie.getCatalogoFalta() != null) {
                    sb.append(" | Falta: ").append(ie.getCatalogoFalta().getCodigo())
                      .append(" (").append(ie.getCatalogoFalta().getClasificacionLey()).append(")");
                }
                if (ie.getDescargoEstudiante() != null) {
                    sb.append(" | Descargo: ").append(ie.getDescargoEstudiante());
                }
                sb.append("\n");
            }
        }

        return sb.toString();
    }

    private PropuestaIntervencionIADTO generarPropuestaIntervencionHeuristica(
            Estudiante est,
            Incidente incOrigen,
            List<IncidenteEstudiante> antecedentes) {

        String hechos = incOrigen != null ? incOrigen.getDescripcionHechos() : "Conductas que alteran la convivencia escolar.";

        return PropuestaIntervencionIADTO.builder()
                .estudianteId(est.getId())
                .estudianteNombre(est.getNombreCompleto())
                .incidenteOrigenId(incOrigen != null ? incOrigen.getId() : null)
                .diagnosticoSituacional("El estudiante " + est.getNombreCompleto() + " presenta situaciones de convivencia que requieren intervención pedagógica formativa (" + antecedentes.size() + " antecedentes registrados). Situación detonante: " + hechos)
                .recomendacionesIa("1. Sesión individual de orientación para desarrollar empatía y manejo de la frustración. 2. Acompañamiento docente en aula para canalizar su liderazgo de forma positiva. 3. Monitoreo formativo quincenal.")
                .accionesAcordadasSugeridas("Compromiso de autorregulación emocional, participación en taller de resolución pacífica de conflictos y realización de una actividad pedagógica reparadora en su salón.")
                .compromisoPadresSugerido("Acudiente se compromete a dialogar diariamente sobre la jornada escolar, reforzar pautas de respeto en casa y asistir puntualmente a citaciones de seguimiento.")
                .semanasSeguimientoSugeridas(4)
                .asistidoPorIa(false)
                .advertenciaGobierno("Plantilla institucional formativa generada por defecto. Ajuste los acuerdos en conjunto con el estudiante y su acudiente.")
                .build();
    }
}
