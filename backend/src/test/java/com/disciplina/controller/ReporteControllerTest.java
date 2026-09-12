package com.disciplina.controller;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.enums.EstadoProceso;
import com.disciplina.domain.enums.GravedadInstitucional;
import com.disciplina.domain.enums.RolEstudianteIncidente;
import com.disciplina.domain.enums.RolUsuario;
import com.disciplina.domain.model.*;
import com.disciplina.domain.repository.*;
import com.disciplina.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ReporteControllerTest {

    @Autowired
    private MockMvc mockMvc;

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
    private IncidenteRepository incidenteRepository;

    private String tokenRector;
    private String tokenOrientador;
    private Incidente incidentePrueba;

    @BeforeEach
    void setUp() {
        usuarioRepository.findByUsername("rector_rep_test").orElseGet(() ->
                usuarioRepository.save(Usuario.builder()
                        .username("rector_rep_test")
                        .passwordHash(passwordEncoder.encode("Password123!"))
                        .nombres("Rector")
                        .apellidos("Reportes")
                        .email("rector.rep@disciplina.edu.co")
                        .rol(RolUsuario.ROLE_RECTOR)
                        .activo(true)
                        .build()));

        Usuario orientador = usuarioRepository.findByUsername("orientador_rep_test").orElseGet(() ->
                usuarioRepository.save(Usuario.builder()
                        .username("orientador_rep_test")
                        .passwordHash(passwordEncoder.encode("Password123!"))
                        .nombres("Orientador")
                        .apellidos("Reportes")
                        .email("orientador.rep@disciplina.edu.co")
                        .rol(RolUsuario.ROLE_ORIENTADOR)
                        .activo(true)
                        .build()));

        tokenRector = jwtTokenProvider.generateToken("rector_rep_test", "ROLE_RECTOR");
        tokenOrientador = jwtTokenProvider.generateToken("orientador_rep_test", "ROLE_ORIENTADOR");

        Docente docente = docenteRepository.findAll().stream().findFirst().orElseGet(() ->
                docenteRepository.save(Docente.builder()
                        .documento("DOC_REP_" + System.nanoTime())
                        .nombres("Docente")
                        .apellidos("Reporte")
                        .activo(true)
                        .build()));

        Lugar lugar = lugarRepository.findAll().stream().findFirst().orElseGet(() ->
                lugarRepository.save(Lugar.builder()
                        .nombre("Patio Central " + System.nanoTime())
                        .descripcion("Zona deportiva")
                        .activo(true)
                        .build()));

        CatalogoFalta falta = catalogoFaltaRepository.findAll().stream().findFirst().orElseGet(() ->
                catalogoFaltaRepository.save(CatalogoFalta.builder()
                        .codigo("FALTA_REP_" + System.nanoTime())
                        .clasificacionLey(ClasificacionLey.TIPO_I)
                        .gravedadInstitucional(GravedadInstitucional.LEVE)
                        .descripcion("Uso indebido de celular")
                        .procedimientoSugerido("Amonestación verbal")
                        .activo(true)
                        .build()));

        Estudiante estudiante = estudianteRepository.findAll().stream().findFirst().orElseGet(() ->
                estudianteRepository.save(Estudiante.builder()
                        .documento("EST_REP_" + System.nanoTime())
                        .nombres("Camilo")
                        .apellidos("Torres")
                        .nombreAcudiente("Marta Torres")
                        .telefonoAcudiente("3101234567")
                        .activo(true)
                        .build()));

        incidentePrueba = Incidente.builder()
                .docenteReporta(docente)
                .lugar(lugar)
                .usuarioRegistro(orientador)
                .fechaIncidente(LocalDate.now())
                .horaIncidente(LocalTime.of(10, 15))
                .descripcionHechos("Interrupción reiterada de clase y desacato pedagógico.")
                .estadoProceso(EstadoProceso.EN_INDAGACION)
                .build();

        IncidenteEstudiante ie = IncidenteEstudiante.builder()
                .estudiante(estudiante)
                .catalogoFalta(falta)
                .anioLectivo(2026)
                .gradoMomento("8")
                .grupoMomento("02")
                .rolEstudiante(RolEstudianteIncidente.AGRESOR_PRINCIPAL)
                .descargoEstudiante("Reconozco que no guardé el teléfono a tiempo.")
                .compromisoIndividual("Dejar el teléfono en el casillero.")
                .build();

        incidentePrueba.agregarInvolucrado(ie);
        incidentePrueba = incidenteRepository.save(incidentePrueba);
    }

    @Test
    @DisplayName("Debe generar y descargar exitosamente el acta formal de descargos en PDF (200 OK)")
    void descargarActaIncidentePdf_exitoso() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/v1/reportes/pdf/incidente/" + incidentePrueba.getId())
                        .header("Authorization", "Bearer " + tokenOrientador))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString("Acta-Incidente-" + incidentePrueba.getId())))
                .andReturn();

        byte[] pdfBytes = result.getResponse().getContentAsByteArray();
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 500, "El PDF generado debe tener contenido sustancial");

        // Validar firma mágica de archivo PDF (%PDF-)
        String headerMagic = new String(pdfBytes, 0, 5);
        assertEquals("%PDF-", headerMagic, "El documento generado debe iniciar con el número mágico %PDF-");

        java.nio.file.Files.write(java.nio.file.Paths.get("target/acta-incidente-prueba.pdf"), pdfBytes);
        com.lowagie.text.pdf.PdfReader reader = new com.lowagie.text.pdf.PdfReader(pdfBytes);
        assertTrue(reader.getNumberOfPages() >= 1, "Debe tener al menos 1 página");
        reader.close();
    }

    @Test
    @DisplayName("Debe generar y descargar el informe ejecutivo consolidado para Rectoría")
    void descargarConsolidadoRectoriaPdf_comoRector_retornaPdf() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/v1/reportes/pdf/consolidado-rectoria")
                        .header("Authorization", "Bearer " + tokenRector))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString("Informe-Ejecutivo-Convivencia-2026")))
                .andReturn();

        byte[] pdfBytes = result.getResponse().getContentAsByteArray();
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 500);

        String headerMagic = new String(pdfBytes, 0, 5);
        assertEquals("%PDF-", headerMagic);

        java.nio.file.Files.write(java.nio.file.Paths.get("target/consolidado-rectoria-prueba.pdf"), pdfBytes);
        com.lowagie.text.pdf.PdfReader reader = new com.lowagie.text.pdf.PdfReader(pdfBytes);
        assertTrue(reader.getNumberOfPages() >= 1, "Debe tener al menos 1 página");
        reader.close();
    }

    @Test
    @DisplayName("Debe rechazar con 403 Forbidden cuando un Orientador intenta generar el consolidado exclusivo de Rectoría")
    void descargarConsolidadoRectoriaPdf_comoOrientador_retornaForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/reportes/pdf/consolidado-rectoria")
                        .header("Authorization", "Bearer " + tokenOrientador))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Debe rechazar con 401 Unauthorized cuando no se provee token")
    void descargarActaIncidentePdf_sinToken_retornaUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/reportes/pdf/incidente/" + incidentePrueba.getId()))
                .andExpect(status().isUnauthorized());
    }
}
