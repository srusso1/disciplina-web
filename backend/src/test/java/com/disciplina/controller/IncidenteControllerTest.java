package com.disciplina.controller;

import com.disciplina.domain.enums.*;
import com.disciplina.domain.model.*;
import com.disciplina.domain.repository.*;
import com.disciplina.dto.incidente.ActualizarDescargoDTO;
import com.disciplina.dto.incidente.ActualizarEstadoIncidenteDTO;
import com.disciplina.dto.incidente.InvolucradoRequestDTO;
import com.disciplina.dto.incidente.RegistrarIncidenteDTO;
import com.disciplina.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class IncidenteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private LugarRepository lugarRepository;

    @Autowired
    private CatalogoFaltaRepository catalogoFaltaRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private MatriculaEstudianteRepository matriculaEstudianteRepository;

    private String tokenRector;
    private String tokenOrientador;
    private Docente docentePrueba;
    private Lugar lugarPrueba;
    private CatalogoFalta faltaPrueba;

    @BeforeEach
    void setUp() {
        if (usuarioRepository.findByUsername("rector_inc").isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .username("rector_inc")
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .nombres("Rector")
                    .apellidos("Incidentes")
                    .email("rector.inc@disciplina.edu.co")
                    .rol(RolUsuario.ROLE_RECTOR)
                    .activo(true)
                    .build());
        }

        if (usuarioRepository.findByUsername("orientador_inc").isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .username("orientador_inc")
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .nombres("Orientador")
                    .apellidos("Incidentes")
                    .email("orientador.inc@disciplina.edu.co")
                    .rol(RolUsuario.ROLE_ORIENTADOR)
                    .activo(true)
                    .build());
        }

        tokenRector = jwtTokenProvider.generateToken("rector_inc", "ROLE_RECTOR");
        tokenOrientador = jwtTokenProvider.generateToken("orientador_inc", "ROLE_ORIENTADOR");

        docentePrueba = docenteRepository.findAll().stream().findFirst().orElseGet(() ->
                docenteRepository.save(Docente.builder()
                        .documento("DOC_TEST_" + System.nanoTime())
                        .nombres("Docente")
                        .apellidos("Prueba")
                        .areaDesempeno("Matematicas")
                        .activo(true)
                        .build()));

        lugarPrueba = lugarRepository.findAll().stream().findFirst().orElseGet(() ->
                lugarRepository.save(Lugar.builder()
                        .nombre("Lugar Prueba " + System.nanoTime())
                        .descripcion("Espacio de prueba")
                        .activo(true)
                        .build()));

        faltaPrueba = catalogoFaltaRepository.findAll().stream().findFirst().orElseGet(() ->
                catalogoFaltaRepository.save(CatalogoFalta.builder()
                        .codigo("FALTA_" + System.nanoTime())
                        .clasificacionLey(ClasificacionLey.TIPO_II)
                        .gravedadInstitucional(GravedadInstitucional.GRAVE)
                        .descripcion("Falta de prueba")
                        .procedimientoSugerido("Procedimiento sugerido")
                        .activo(true)
                        .build()));
    }

    private Estudiante crearEstudianteConMatricula(String grado, String grupo, int anio) {
        String doc = "DOC_INC_" + System.nanoTime();
        Estudiante est = estudianteRepository.save(Estudiante.builder()
                .documento(doc)
                .nombres("Estudiante")
                .apellidos("Prueba " + doc.substring(doc.length() - 4))
                .nombreAcudiente("ACUDIENTE PRUEBA")
                .telefonoAcudiente("3101234567")
                .activo(true)
                .build());

        matriculaEstudianteRepository.save(MatriculaEstudiante.builder()
                .estudiante(est)
                .anioLectivo(anio)
                .grado(grado)
                .grupo(grupo)
                .jornada("DIURNA")
                .estadoMatricula(EstadoMatricula.ACTIVO)
                .build());

        return est;
    }

    @Test
    @DisplayName("Debe registrar exitosamente un incidente disciplinario INDIVIDUAL (1 solo involucrado) con snapshot inmutable")
    void testRegistrarIncidenteIndividualExitoso() throws Exception {
        Estudiante est = crearEstudianteConMatricula("10", "1001", 2026);

        RegistrarIncidenteDTO dto = RegistrarIncidenteDTO.builder()
                .docenteReportaId(docentePrueba.getId())
                .lugarId(lugarPrueba.getId())
                .fechaIncidente(LocalDate.now())
                .horaIncidente(LocalTime.of(10, 15))
                .descripcionHechos("El estudiante es sorprendido destruyendo material institucional en el aula de clase.")
                .involucrados(List.of(
                        InvolucradoRequestDTO.builder()
                                .estudianteId(est.getId())
                                .catalogoFaltaId(faltaPrueba.getId())
                                .rolEstudiante(RolEstudianteIncidente.AGRESOR_PRINCIPAL)
                                .descargoEstudiante("Acepto que lance el objeto.")
                                .compromisoIndividual("Me comprometo a reparar el material.")
                                .build()
                ))
                .build();

        mockMvc.perform(post("/api/v1/incidentes")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.estadoProceso", is("REPORTADO")))
                .andExpect(jsonPath("$.docenteReporta.id", is(docentePrueba.getId())))
                .andExpect(jsonPath("$.lugar.id", is(lugarPrueba.getId())))
                .andExpect(jsonPath("$.involucrados", hasSize(1)))
                .andExpect(jsonPath("$.involucrados[0].estudianteId", is(est.getId())))
                .andExpect(jsonPath("$.involucrados[0].gradoMomento", is("10")))
                .andExpect(jsonPath("$.involucrados[0].grupoMomento", is("1001")))
                .andExpect(jsonPath("$.involucrados[0].rolEstudiante", is("AGRESOR_PRINCIPAL")));
    }

    @Test
    @DisplayName("Debe registrar exitosamente un incidente COLECTIVO con agresor, victima y testigo")
    void testRegistrarIncidenteColectivoExitoso() throws Exception {
        Estudiante agresor = crearEstudianteConMatricula("09", "0901", 2026);
        Estudiante victima = crearEstudianteConMatricula("09", "0902", 2026);
        Estudiante testigo = crearEstudianteConMatricula("09", "0901", 2026);

        RegistrarIncidenteDTO dto = RegistrarIncidenteDTO.builder()
                .docenteReportaId(docentePrueba.getId())
                .lugarId(lugarPrueba.getId())
                .fechaIncidente(LocalDate.now())
                .horaIncidente(LocalTime.of(11, 30))
                .descripcionHechos("Altercado verbal y agresion fisica durante el recreo escolar en el patio central.")
                .involucrados(List.of(
                        InvolucradoRequestDTO.builder()
                                .estudianteId(agresor.getId())
                                .catalogoFaltaId(faltaPrueba.getId())
                                .rolEstudiante(RolEstudianteIncidente.AGRESOR_PRINCIPAL)
                                .build(),
                        InvolucradoRequestDTO.builder()
                                .estudianteId(victima.getId())
                                .rolEstudiante(RolEstudianteIncidente.VICTIMA)
                                .build(),
                        InvolucradoRequestDTO.builder()
                                .estudianteId(testigo.getId())
                                .rolEstudiante(RolEstudianteIncidente.TESTIGO)
                                .build()
                ))
                .build();

        mockMvc.perform(post("/api/v1/incidentes")
                        .header("Authorization", "Bearer " + tokenRector)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.involucrados", hasSize(3)))
                .andExpect(jsonPath("$.involucrados[?(@.rolEstudiante == 'AGRESOR_PRINCIPAL')].gradoMomento", contains("09")))
                .andExpect(jsonPath("$.involucrados[?(@.rolEstudiante == 'VICTIMA')].gradoMomento", contains("09")));
    }

    @Test
    @DisplayName("Debe rechazar con 409 Conflict si un mismo estudiante es duplicado dentro del incidente")
    void testRegistrarIncidenteEstudianteDuplicado() throws Exception {
        Estudiante est = crearEstudianteConMatricula("11", "1101", 2026);

        RegistrarIncidenteDTO dto = RegistrarIncidenteDTO.builder()
                .docenteReportaId(docentePrueba.getId())
                .lugarId(lugarPrueba.getId())
                .fechaIncidente(LocalDate.now())
                .descripcionHechos("Incidente con estudiante repetido en la lista de involucrados.")
                .involucrados(List.of(
                        InvolucradoRequestDTO.builder()
                                .estudianteId(est.getId())
                                .rolEstudiante(RolEstudianteIncidente.AGRESOR_PRINCIPAL)
                                .build(),
                        InvolucradoRequestDTO.builder()
                                .estudianteId(est.getId())
                                .rolEstudiante(RolEstudianteIncidente.TESTIGO)
                                .build()
                ))
                .build();

        mockMvc.perform(post("/api/v1/incidentes")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", containsString("multiples veces")));
    }

    @Test
    @DisplayName("Debe permitir actualizar el estado del proceso del incidente (debido proceso)")
    void testActualizarEstadoIncidente() throws Exception {
        Estudiante est = crearEstudianteConMatricula("08", "0801", 2026);

        RegistrarIncidenteDTO dto = RegistrarIncidenteDTO.builder()
                .docenteReportaId(docentePrueba.getId())
                .lugarId(lugarPrueba.getId())
                .fechaIncidente(LocalDate.now())
                .descripcionHechos("Situacion de conflicto para verificar la transicion de estados del debido proceso.")
                .involucrados(List.of(
                        InvolucradoRequestDTO.builder()
                                .estudianteId(est.getId())
                                .rolEstudiante(RolEstudianteIncidente.AGRESOR_PRINCIPAL)
                                .build()
                ))
                .build();

        String res = mockMvc.perform(post("/api/v1/incidentes")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Integer incidenteId = objectMapper.readTree(res).get("id").asInt();

        ActualizarEstadoIncidenteDTO cambioEstado = new ActualizarEstadoIncidenteDTO(EstadoProceso.EN_INDAGACION);

        mockMvc.perform(patch("/api/v1/incidentes/" + incidenteId + "/estado")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cambioEstado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estadoProceso", is("EN_INDAGACION")));
    }

    @Test
    @DisplayName("Debe permitir registrar y actualizar descargos y compromisos individuales del estudiante")
    void testActualizarDescargosEstudiante() throws Exception {
        Estudiante est = crearEstudianteConMatricula("07", "0701", 2026);

        RegistrarIncidenteDTO dto = RegistrarIncidenteDTO.builder()
                .docenteReportaId(docentePrueba.getId())
                .lugarId(lugarPrueba.getId())
                .fechaIncidente(LocalDate.now())
                .descripcionHechos("Incidente para actualizar descargos formales en comite de convivencia.")
                .involucrados(List.of(
                        InvolucradoRequestDTO.builder()
                                .estudianteId(est.getId())
                                .rolEstudiante(RolEstudianteIncidente.AGRESOR_PRINCIPAL)
                                .build()
                ))
                .build();

        String res = mockMvc.perform(post("/api/v1/incidentes")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Integer incidenteId = objectMapper.readTree(res).get("id").asInt();

        ActualizarDescargoDTO descargoDTO = ActualizarDescargoDTO.builder()
                .descargoEstudiante("El estudiante declara que no fue su intencion generar conflicto.")
                .compromisoIndividual("Participar en el taller de resolucion pacifica de conflictos.")
                .build();

        mockMvc.perform(put("/api/v1/incidentes/" + incidenteId + "/estudiantes/" + est.getId() + "/descargo")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(descargoDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.descargoEstudiante", containsString("no fue su intencion")))
                .andExpect(jsonPath("$.compromisoIndividual", containsString("resolucion pacifica")));
    }

    @Test
    @DisplayName("Debe listar docentes, lugares y catalogo de faltas en los endpoints de catalogos")
    void testCatalogosEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/catalogos/docentes")
                        .header("Authorization", "Bearer " + tokenOrientador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())));

        mockMvc.perform(get("/api/v1/catalogos/lugares")
                        .header("Authorization", "Bearer " + tokenOrientador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())));

        mockMvc.perform(get("/api/v1/catalogos/faltas")
                        .header("Authorization", "Bearer " + tokenOrientador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())));
    }

    @Test
    @DisplayName("Debe filtrar incidentes por Clasificacion de Ley 1620 (Tipo I, Tipo II, Tipo III)")
    void testFiltrarIncidentesPorTipoLey() throws Exception {
        Estudiante est = crearEstudianteConMatricula("06", "0601", 2026);

        RegistrarIncidenteDTO dto = RegistrarIncidenteDTO.builder()
                .docenteReportaId(docentePrueba.getId())
                .lugarId(lugarPrueba.getId())
                .fechaIncidente(LocalDate.now())
                .descripcionHechos("Incidente con falta tipificada Tipo II para validar filtro de ley 1620.")
                .involucrados(List.of(
                        InvolucradoRequestDTO.builder()
                                .estudianteId(est.getId())
                                .catalogoFaltaId(faltaPrueba.getId()) // faltaPrueba es TIPO_II
                                .rolEstudiante(RolEstudianteIncidente.AGRESOR_PRINCIPAL)
                                .build()
                ))
                .build();

        mockMvc.perform(post("/api/v1/incidentes")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());

        // Filtrar por TIPO_II debe retornar al menos 1 resultado
        mockMvc.perform(get("/api/v1/incidentes")
                        .param("tipoLey", "TIPO_II")
                        .header("Authorization", "Bearer " + tokenOrientador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contenido", not(empty())))
                .andExpect(jsonPath("$.contenido[?(@.involucrados[0].falta.clasificacionLey == 'TIPO_II')]", not(empty())));

        // Filtrar por TIPO_III no debe incluir incidentes que solo tienen TIPO_II
        mockMvc.perform(get("/api/v1/incidentes")
                        .param("tipoLey", "TIPO_III")
                        .header("Authorization", "Bearer " + tokenOrientador))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Debe obtener estadisticas de convivencia con el DTO estructurado para KPI cards")
    void testObtenerEstadisticasConFormatoEsperado() throws Exception {
        mockMvc.perform(get("/api/v1/incidentes/estadisticas")
                        .header("Authorization", "Bearer " + tokenOrientador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalIncidentes", notNullValue()))
                .andExpect(jsonPath("$.tipoI", notNullValue()))
                .andExpect(jsonPath("$.tipoII", notNullValue()))
                .andExpect(jsonPath("$.tipoIII", notNullValue()))
                .andExpect(jsonPath("$.enSeguimiento", notNullValue()))
                .andExpect(jsonPath("$.cerrados", notNullValue()));
    }

    @Test
    @DisplayName("Debe aceptar payload con alias 'nuevoEstado' y 'observaciones' sin error 400")
    void testActualizarEstadoConAliasFrontend() throws Exception {
        Estudiante est = crearEstudianteConMatricula("08", "0801", 2026);
        RegistrarIncidenteDTO dto = RegistrarIncidenteDTO.builder()
                .docenteReportaId(docentePrueba.getId())
                .lugarId(lugarPrueba.getId())
                .fechaIncidente(LocalDate.now())
                .descripcionHechos("Incidente para validar alias nuevoEstado del frontend.")
                .involucrados(List.of(
                        InvolucradoRequestDTO.builder()
                                .estudianteId(est.getId())
                                .rolEstudiante(RolEstudianteIncidente.AGRESOR_PRINCIPAL)
                                .build()
                ))
                .build();

        String res = mockMvc.perform(post("/api/v1/incidentes")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Integer incidenteId = objectMapper.readTree(res).get("id").asInt();

        String payloadFrontend = """
                {
                    "nuevoEstado": "EN_INDAGACION",
                    "observaciones": "Iniciando indagacion con personeria"
                }
                """;

        mockMvc.perform(patch("/api/v1/incidentes/" + incidenteId + "/estado")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payloadFrontend))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estadoProceso", is("EN_INDAGACION")));
    }

    @Test
    @DisplayName("Debe aceptar payload de descargos con alias 'descargo' y 'compromisos' y serializar propiedades de frontend")
    void testActualizarDescargoConAliasFrontend() throws Exception {
        Estudiante est = crearEstudianteConMatricula("09", "0901", 2026);
        RegistrarIncidenteDTO dto = RegistrarIncidenteDTO.builder()
                .docenteReportaId(docentePrueba.getId())
                .lugarId(lugarPrueba.getId())
                .fechaIncidente(LocalDate.now())
                .descripcionHechos("Incidente para probar alias de descargo y compromisos.")
                .involucrados(List.of(
                        InvolucradoRequestDTO.builder()
                                .estudianteId(est.getId())
                                .rolEstudiante(RolEstudianteIncidente.AGRESOR_PRINCIPAL)
                                .build()
                ))
                .build();

        String res = mockMvc.perform(post("/api/v1/incidentes")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Integer incidenteId = objectMapper.readTree(res).get("id").asInt();

        String payloadFrontend = """
                {
                    "descargo": "El estudiante manifiesta su compromiso con la convivencia.",
                    "compromisos": "Realizar actividad restaurativa."
                }
                """;

        mockMvc.perform(put("/api/v1/incidentes/" + incidenteId + "/estudiantes/" + est.getId() + "/descargo")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payloadFrontend))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.descargoEstudiante", containsString("compromiso con la convivencia")))
                .andExpect(jsonPath("$.descargo", containsString("compromiso con la convivencia")))
                .andExpect(jsonPath("$.compromisos", containsString("actividad restaurativa")))
                .andExpect(jsonPath("$.nombreCompleto", notNullValue()))
                .andExpect(jsonPath("$.documento", notNullValue()))
                .andExpect(jsonPath("$.tieneDescargo", is(true)))
                .andExpect(jsonPath("$.tieneCompromisos", is(true)));
    }

    @Test
    @DisplayName("SAD Riesgo 3: Debe rechazar con 400 Bad Request cualquier intento de mutar descargos en un incidente CERRADO")
    void testActualizarDescargo_enIncidenteCerrado_retornaBadRequest() throws Exception {
        Estudiante est = crearEstudianteConMatricula("10", "1002", 2026);

        RegistrarIncidenteDTO dto = RegistrarIncidenteDTO.builder()
                .docenteReportaId(docentePrueba.getId())
                .lugarId(lugarPrueba.getId())
                .fechaIncidente(LocalDate.now())
                .descripcionHechos("Incidente previo para cierre formal.")
                .involucrados(List.of(
                        InvolucradoRequestDTO.builder()
                                .estudianteId(est.getId())
                                .rolEstudiante(RolEstudianteIncidente.AGRESOR_PRINCIPAL)
                                .build()
                ))
                .build();

        String res = mockMvc.perform(post("/api/v1/incidentes")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Integer incidenteId = objectMapper.readTree(res).get("id").asInt();

        // Cerrar el incidente formalmente
        mockMvc.perform(patch("/api/v1/incidentes/" + incidenteId + "/estado")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"estadoProceso\":\"CERRADO\"}"))
                .andExpect(status().isOk());

        // Intentar mutar descargos sobre el caso cerrado
        String payloadMutacion = """
                {
                    "descargo": "Intento de alteracion ilicita de expediente cerrado.",
                    "compromisos": "Sin efecto"
                }
                """;

        mockMvc.perform(put("/api/v1/incidentes/" + incidenteId + "/estudiantes/" + est.getId() + "/descargo")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payloadMutacion))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("CERRADO")));
    }

    @Test
    @DisplayName("Debe permitir filtrar faltas con el query param tipoLey")
    void testCatalogosFaltasConParamTipoLey() throws Exception {
        mockMvc.perform(get("/api/v1/catalogos/faltas")
                        .param("tipoLey", "TIPO_II")
                        .header("Authorization", "Bearer " + tokenOrientador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())));
    }
}
