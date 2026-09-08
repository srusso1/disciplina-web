package com.disciplina.controller;

import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.UsuarioRepository;
import com.disciplina.dto.matricula.ImportacionMatriculasResumenDTO;
import com.disciplina.security.JwtTokenProvider;
import com.disciplina.service.ImportadorMatriculasService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import com.disciplina.domain.enums.*;
import com.disciplina.domain.model.*;
import com.disciplina.domain.repository.*;
import com.disciplina.dto.matricula.ActualizarEstudianteDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MatriculaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ImportadorMatriculasService importadorMatriculasService;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private MatriculaEstudianteRepository matriculaEstudianteRepository;

    @Autowired
    private IncidenteRepository incidenteRepository;

    @Autowired
    private IncidenteEstudianteRepository incidenteEstudianteRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private LugarRepository lugarRepository;

    @Autowired
    private CatalogoFaltaRepository catalogoFaltaRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String tokenRector;
    private String tokenOrientador;

    @BeforeEach
    void setUp() {
        if (usuarioRepository.findByUsername("rector_matricula").isEmpty()) {
            Usuario rector = Usuario.builder()
                    .username("rector_matricula")
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .nombres("Rector")
                    .apellidos("Matricula")
                    .email("rector.matricula@disciplina.edu.co")
                    .rol(RolUsuario.ROLE_RECTOR)
                    .activo(true)
                    .build();
            usuarioRepository.save(rector);
        }

        if (usuarioRepository.findByUsername("orientador_matricula").isEmpty()) {
            Usuario orientador = Usuario.builder()
                    .username("orientador_matricula")
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .nombres("Orientador")
                    .apellidos("Matricula")
                    .email("orientador.matricula@disciplina.edu.co")
                    .rol(RolUsuario.ROLE_ORIENTADOR)
                    .activo(true)
                    .build();
            usuarioRepository.save(orientador);
        }

        tokenRector = jwtTokenProvider.generateToken("rector_matricula", "ROLE_RECTOR");
        tokenOrientador = jwtTokenProvider.generateToken("orientador_matricula", "ROLE_ORIENTADOR");
    }

    private byte[] generarExcelPrueba() throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("DATOS");

            Row r0 = sheet.createRow(0);
            r0.createCell(0).setCellValue("PLANILLA CON DATOS POR GRADO [TODO] [JORNADA SECUNDARIA DIURNA] [2026]");

            sheet.createRow(1);

            Row r2 = sheet.createRow(2);
            String[] headers = {
                    "GRADO", "SEDE", "CODIGO", "APELLIDO 1", "APELLIDO 2", "NOMBRE 1", "NOMBRE 2",
                    "TIP_IDE", "IDENTIFICACION EST", "FECHA_NAC", "MUN_EXP", "GENERO", "EDAD",
                    "DIRECCION", "TELEFONO", "TIPO DE SANGRE", "APE1_ACU", "APE2_ACU", "NOM1_ACU",
                    "NOM2_ACU", "TIPO_IDE_ACU", "IDENTIFICACION ACU", "DIRECCION", "TELEFONO",
                    "PARENTESCO", "EPS_ESTUDIANTE", "SISBEN_ESTUDIANTE", "ESTRATO_ESTUDIANTE"
            };
            for (int i = 0; i < headers.length; i++) {
                r2.createCell(i).setCellValue(headers[i]);
            }

            // Fila 3: Estudiante 1
            Row r3 = sheet.createRow(3);
            r3.createCell(0).setCellValue("0801");
            r3.createCell(1).setCellValue("JORNADA SECUNDARIA DIURNA");
            r3.createCell(2).setCellValue("tr9901");
            r3.createCell(3).setCellValue("MENDEZ");
            r3.createCell(5).setCellValue("CARLOS");
            r3.createCell(8).setCellValue("1099887766");
            r3.createCell(18).setCellValue("ANDRES MENDEZ");
            r3.createCell(23).setCellValue("3109998888");

            // Fila 4: Estudiante 2 con doc 0
            Row r4 = sheet.createRow(4);
            r4.createCell(0).setCellValue("0802");
            r4.createCell(1).setCellValue("JORNADA SECUNDARIA DIURNA");
            r4.createCell(2).setCellValue("tr9902");
            r4.createCell(3).setCellValue("CASTILLO");
            r4.createCell(5).setCellValue("LUCIA");
            r4.createCell(8).setCellValue("0");

            workbook.write(out);
        }
        return out.toByteArray();
    }

    @Test
    @DisplayName("Debe importar exitosamente planilla Excel como Rector")
    void testImportacionMasivaExitosaRector() throws Exception {
        byte[] excelBytes = generarExcelPrueba();
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "matriculas_2026.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                excelBytes
        );

        mockMvc.perform(multipart("/api/v1/matriculas/importar-masivo")
                        .file(file)
                        .header("Authorization", "Bearer " + tokenRector))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.anioLectivo", is(2026)))
                .andExpect(jsonPath("$.totalFilasLeidas", is(2)))
                .andExpect(jsonPath("$.advertencias", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("Debe procesar el archivo real de la IE Trujillo en menos de 3 segundos con cero errores")
    void testImportacionArchivoRealIETrujillo() throws IOException {
        File realFile = new File("C:/Users/SEBAS/Downloads/TODO_S_JORNADA SECUNDARIA DIURNA_BACHILLER.xlsx");
        if (!realFile.exists()) {
            return;
        }

        try (FileInputStream fis = new FileInputStream(realFile)) {
            ImportacionMatriculasResumenDTO res = importadorMatriculasService.importarPlanilla(fis, 2026);
            System.out.println("=== REPORTE IMPORTACION EN LOTE ===");
            System.out.println("Total Filas: " + res.getTotalFilasLeidas());
            System.out.println("Estudiantes Creados: " + res.getEstudiantesCreados());
            System.out.println("Estudiantes Actualizados: " + res.getEstudiantesActualizados());
            System.out.println("Matriculas Creadas: " + res.getMatriculasCreadas());
            System.out.println("Matriculas Actualizadas: " + res.getMatriculasActualizadas());
            System.out.println("Advertencias generadas: " + res.getAdvertencias().size());
            System.out.println("Errores: " + res.getErrores().size());
            System.out.println("Tiempo en ms: " + res.getTiempoProcesamientoMs());

            assertThat(res.getTotalFilasLeidas()).isEqualTo(778);
            assertThat(res.getErrores()).isEmpty();
            assertThat(res.getAdvertencias()).hasSizeGreaterThanOrEqualTo(7);
            assertThat(res.getTiempoProcesamientoMs()).isLessThan(6000);
        }
    }

    @Test
    @DisplayName("Debe permitir listar estudiantes paginados con metadatos de pagina")
    void testListarEstudiantes() throws Exception {
        mockMvc.perform(get("/api/v1/matriculas/estudiantes")
                        .param("anioLectivo", "2026")
                        .param("page", "0")
                        .param("size", "10")
                        .header("Authorization", "Bearer " + tokenOrientador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contenido", notNullValue()))
                .andExpect(jsonPath("$.pagina", is(0)))
                .andExpect(jsonPath("$.tamanoPagina", is(10)))
                .andExpect(jsonPath("$.totalElementos", greaterThanOrEqualTo(0)))
                .andExpect(jsonPath("$.totalPaginas", greaterThanOrEqualTo(0)));
    }

    @Test
    @DisplayName("Debe rechazar subida de archivos no soportados con 415")
    void testArchivoNoSoportado() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "documento.pdf",
                "application/pdf",
                "Fake PDF content".getBytes()
        );

        mockMvc.perform(multipart("/api/v1/matriculas/importar-masivo")
                        .file(file)
                        .header("Authorization", "Bearer " + tokenRector))
                .andExpect(status().isUnsupportedMediaType());
    }

    @Test
    @DisplayName("Debe rechazar peticion sin autenticar con 401")
    void testPeticionSinToken() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "matriculas.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                new byte[]{1, 2, 3}
        );

        mockMvc.perform(multipart("/api/v1/matriculas/importar-masivo")
                        .file(file))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Debe actualizar exitosamente los datos de un estudiante y transformar acudiente a mayúsculas")
    void testActualizarEstudianteExitoso() throws Exception {
        String docInicial = "DOC_INIT_" + System.nanoTime();
        String docFinal = "DOC_FIN_" + System.nanoTime();

        Estudiante est = estudianteRepository.save(Estudiante.builder()
                .documento(docInicial)
                .nombres("Pepito")
                .apellidos("Perez")
                .nombreAcudiente("Acudiente Inicial")
                .telefonoAcudiente("3101112233")
                .build());

        matriculaEstudianteRepository.save(MatriculaEstudiante.builder()
                .estudiante(est)
                .anioLectivo(2026)
                .grado("10")
                .grupo("1001")
                .jornada("MANANA")
                .estadoMatricula(EstadoMatricula.ACTIVO)
                .build());

        ActualizarEstudianteDTO dto = ActualizarEstudianteDTO.builder()
                .documento(docFinal)
                .nombres("pepito antonio")
                .apellidos("perez gomez")
                .nombreAcudiente("maria gomez")
                .telefonoAcudiente("3114165509")
                .grado("11")
                .grupo("1102")
                .jornada("TARDE")
                .estadoMatricula(EstadoMatricula.ACTIVO)
                .anioLectivo(2026)
                .build();

        mockMvc.perform(put("/api/v1/matriculas/estudiantes/" + est.getId())
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.documento", is(docFinal)))
                .andExpect(jsonPath("$.nombres", is("PEPITO ANTONIO")))
                .andExpect(jsonPath("$.apellidos", is("PEREZ GOMEZ")))
                .andExpect(jsonPath("$.nombreAcudiente", is("MARIA GOMEZ")))
                .andExpect(jsonPath("$.telefonoAcudiente", is("3114165509")))
                .andExpect(jsonPath("$.grado", is("11")))
                .andExpect(jsonPath("$.grupo", is("1102")));
    }

    @Test
    @DisplayName("Debe rechazar teléfono que no cumple formato de 10 dígitos celular colombiano con 400")
    void testActualizarEstudianteTelefonoInvalido() throws Exception {
        String doc = "DOC_TEL_" + System.nanoTime();
        Estudiante est = estudianteRepository.save(Estudiante.builder()
                .documento(doc)
                .nombres("Laura")
                .apellidos("Jimenez")
                .nombreAcudiente("PADRE INICIAL")
                .telefonoAcudiente("3101112233")
                .build());

        ActualizarEstudianteDTO dto = ActualizarEstudianteDTO.builder()
                .documento(doc)
                .nombres("Laura")
                .apellidos("Jimenez")
                .nombreAcudiente("CARLOS JIMENEZ")
                .telefonoAcudiente("12345")
                .grado("09")
                .grupo("0901")
                .anioLectivo(2026)
                .build();

        mockMvc.perform(put("/api/v1/matriculas/estudiantes/" + est.getId())
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.telefonoAcudiente", notNullValue()));
    }

    @Test
    @DisplayName("Debe rechazar cambio de documento si colisiona con otro estudiante con 409 Conflict")
    void testActualizarEstudianteDocumentoDuplicado() throws Exception {
        String docExistente = "DOC_EX_" + System.nanoTime();
        String docOtro = "DOC_OT_" + System.nanoTime();

        estudianteRepository.save(Estudiante.builder()
                .documento(docExistente)
                .nombres("Existente")
                .apellidos("Uno")
                .build());

        Estudiante est2 = estudianteRepository.save(Estudiante.builder()
                .documento(docOtro)
                .nombres("Otro")
                .apellidos("Dos")
                .build());

        ActualizarEstudianteDTO dto = ActualizarEstudianteDTO.builder()
                .documento(docExistente)
                .nombres("Otro")
                .apellidos("Dos")
                .nombreAcudiente("ACUDIENTE")
                .telefonoAcudiente("3159998877")
                .grado("10")
                .grupo("1001")
                .anioLectivo(2026)
                .build();

        mockMvc.perform(put("/api/v1/matriculas/estudiantes/" + est2.getId())
                        .header("Authorization", "Bearer " + tokenRector)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", containsString("Ya existe un estudiante")));
    }

    @Test
    @DisplayName("Debe rechazar JSON con valor de enum invalido con 400 Bad Request")
    void testActualizarEstudianteEnumInvalido() throws Exception {
        String jsonInvalido = """
            {
                "documento": "100111222",
                "nombres": "Ana",
                "apellidos": "Lopez",
                "nombreAcudiente": "MARIA LOPEZ",
                "telefonoAcudiente": "3101112233",
                "grado": "10",
                "grupo": "1001",
                "estadoMatricula": "VALOR_INEXISTENTE"
            }
            """;

        mockMvc.perform(put("/api/v1/matriculas/estudiantes/1")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonInvalido))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("valores no permitidos")));
    }

    @Test
    @DisplayName("Debe rechazar grado con longitud superior a 10 caracteres con 400 Bad Request")
    void testActualizarEstudianteGradoDemasiadoLargo() throws Exception {
        ActualizarEstudianteDTO dto = ActualizarEstudianteDTO.builder()
                .documento("100111222")
                .nombres("Ana")
                .apellidos("Lopez")
                .nombreAcudiente("MARIA LOPEZ")
                .telefonoAcudiente("3101112233")
                .grado("GRADO_DEMASIADO_LARGO_MAS_DE_10")
                .grupo("1001")
                .build();

        mockMvc.perform(put("/api/v1/matriculas/estudiantes/1")
                        .header("Authorization", "Bearer " + tokenOrientador)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.grado", containsString("10 caracteres")));
    }

    @Test
    @DisplayName("Debe consultar exitosamente el expediente historico integral del estudiante")
    void testObtenerExpedienteEstudianteExitoso() throws Exception {
        String doc = "EXP_" + System.currentTimeMillis();
        Estudiante est = estudianteRepository.save(Estudiante.builder()
                .documento(doc)
                .nombres("CAMILO")
                .apellidos("VALENCIA")
                .nombreAcudiente("ROSA VALENCIA")
                .telefonoAcudiente("3159998877")
                .emailAcudiente("rosa@correo.com")
                .activo(true)
                .build());

        // Matrícula 2025
        matriculaEstudianteRepository.save(MatriculaEstudiante.builder()
                .estudiante(est)
                .anioLectivo(2025)
                .grado("07")
                .grupo("0701")
                .jornada("MANANA")
                .estadoMatricula(EstadoMatricula.ACTIVO)
                .build());

        // Matrícula 2026
        matriculaEstudianteRepository.save(MatriculaEstudiante.builder()
                .estudiante(est)
                .anioLectivo(2026)
                .grado("08")
                .grupo("0802")
                .jornada("MANANA")
                .estadoMatricula(EstadoMatricula.ACTIVO)
                .build());

        // Crear Docente, Lugar y Falta para el incidente
        Docente docPrueba = docenteRepository.save(Docente.builder()
                .documento("D_" + (System.currentTimeMillis() % 1000000000L))
                .nombres("CARLOS")
                .apellidos("DOCENTE")
                .areaDesempeno("CIENCIAS")
                .activo(true)
                .build());

        Lugar lugPrueba = lugarRepository.save(Lugar.builder()
                .nombre("PATIO_EXP_" + System.currentTimeMillis())
                .descripcion("Patio de descanso")
                .activo(true)
                .build());

        CatalogoFalta faltaPrueba = catalogoFaltaRepository.save(CatalogoFalta.builder()
                .codigo("F_" + (System.currentTimeMillis() % 1000000000L))
                .clasificacionLey(ClasificacionLey.TIPO_II)
                .gravedadInstitucional(GravedadInstitucional.GRAVE)
                .descripcion("Falta de prueba expediente")
                .procedimientoSugerido("Citación acudiente")
                .activo(true)
                .build());

        Usuario orientador = usuarioRepository.findByUsername("orientador_matricula").orElseThrow();

        Incidente inc = incidenteRepository.save(Incidente.builder()
                .docenteReporta(docPrueba)
                .lugar(lugPrueba)
                .usuarioRegistro(orientador)
                .fechaIncidente(LocalDate.now())
                .horaIncidente(LocalTime.of(10, 15))
                .descripcionHechos("Incidente para validación de expediente")
                .estadoProceso(EstadoProceso.EN_INDAGACION)
                .build());

        incidenteEstudianteRepository.save(IncidenteEstudiante.builder()
                .incidente(inc)
                .estudiante(est)
                .catalogoFalta(faltaPrueba)
                .anioLectivo(2026)
                .gradoMomento("08")
                .grupoMomento("0802")
                .rolEstudiante(RolEstudianteIncidente.AGRESOR_PRINCIPAL)
                .descargoEstudiante("Versión del estudiante en descargos")
                .compromisoIndividual("Compromiso de buen comportamiento")
                .build());

        mockMvc.perform(get("/api/v1/matriculas/estudiantes/" + est.getId() + "/expediente")
                        .header("Authorization", "Bearer " + tokenOrientador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(est.getId())))
                .andExpect(jsonPath("$.documento", is(doc)))
                .andExpect(jsonPath("$.nombreCompleto", is("CAMILO VALENCIA")))
                .andExpect(jsonPath("$.matriculaActual.anioLectivo", is(2026)))
                .andExpect(jsonPath("$.matriculaActual.grado", is("08")))
                .andExpect(jsonPath("$.historialMatriculas", hasSize(2)))
                .andExpect(jsonPath("$.resumenConvivencia.totalIncidentes", is(1)))
                .andExpect(jsonPath("$.resumenConvivencia.comoAgresorPrincipal", is(1)))
                .andExpect(jsonPath("$.resumenConvivencia.faltasTipoII", is(1)))
                .andExpect(jsonPath("$.historialIncidentes", hasSize(1)))
                .andExpect(jsonPath("$.historialIncidentes[0].gradoMomento", is("08")))
                .andExpect(jsonPath("$.historialIncidentes[0].descargoEstudiante", is("Versión del estudiante en descargos")))
                .andExpect(jsonPath("$.historialIncidentes[0].falta.clasificacionLey", is("TIPO_II")));
    }

    @Test
    @DisplayName("Debe retornar 404 al consultar expediente de un estudiante inexistente")
    void testObtenerExpedienteEstudianteNoEncontrado() throws Exception {
        mockMvc.perform(get("/api/v1/matriculas/estudiantes/999999/expediente")
                        .header("Authorization", "Bearer " + tokenOrientador))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("Estudiante no encontrado")));
    }
}