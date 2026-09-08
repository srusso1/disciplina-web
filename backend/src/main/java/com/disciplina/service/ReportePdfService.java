package com.disciplina.service;

import com.disciplina.common.exception.RecursoNoEncontradoException;
import com.disciplina.domain.enums.EstadoProceso;
import com.disciplina.domain.enums.RolEstudianteIncidente;
import com.disciplina.domain.model.Docente;
import com.disciplina.domain.model.Estudiante;
import com.disciplina.domain.model.Incidente;
import com.disciplina.domain.model.IncidenteEstudiante;
import com.disciplina.domain.model.Lugar;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.IncidenteEstudianteRepository;
import com.disciplina.domain.repository.IncidenteRepository;
import com.disciplina.dto.rectoria.*;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportePdfService {

    private final IncidenteRepository incidenteRepository;
    private final IncidenteEstudianteRepository incidenteEstudianteRepository;
    private final RectoriaService rectoriaService;

    // Paleta Institucional (Institución Educativa Trujillo)
    private static final Color COLOR_NAVY = new Color(30, 58, 138);       // #1E3A8A - Azul Institucional Primario
    private static final Color COLOR_SKY = new Color(2, 132, 199);        // #0284C7 - Acento Celeste
    private static final Color COLOR_SLATE_DARK = new Color(15, 23, 42);   // #0F172A - Texto Principal
    private static final Color COLOR_BG_HEADER = new Color(241, 245, 249); // #F1F5F9 - Fondo Cabeceras
    private static final Color COLOR_BG_SUBTLE = new Color(248, 250, 252); // #F8FAFC - Fondo Celdas
    private static final Color COLOR_BORDER = new Color(203, 213, 225);    // #CBD5E1 - Bordes Tablas
    private static final Color COLOR_TEXT_MUTED = new Color(100, 116, 139);// #64748B - Gris Secundario
    private static final Color COLOR_TIPO_I = new Color(161, 98, 7);      // Ámbar - Falta Leve
    private static final Color COLOR_TIPO_II = new Color(194, 65, 12);     // Naranja - Falta Grave
    private static final Color COLOR_TIPO_III = new Color(185, 28, 28);    // Rojo - Falta Gravísima

    // Tipografías Oficiales
    private static final Font FONT_TITLE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12f, COLOR_NAVY);
    private static final Font FONT_COUNTRY = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7.5f, COLOR_SLATE_DARK);
    private static final Font FONT_SECRETARIA = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7.5f, COLOR_NAVY);
    private static final Font FONT_MUTED_BOLD = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 6.5f, COLOR_TEXT_MUTED);
    private static final Font FONT_LEMA = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 7f, COLOR_TEXT_MUTED);
    private static final Font FONT_LEGAL_HEADER = FontFactory.getFont(FontFactory.HELVETICA, 6.5f, COLOR_SLATE_DARK);
    private static final Font FONT_MUTED_SMALL = FontFactory.getFont(FontFactory.HELVETICA, 6.5f, COLOR_TEXT_MUTED);

    private static final Font FONT_DOC_TITLE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9.5f, COLOR_NAVY);
    private static final Font FONT_DOC_SUBTITLE = FontFactory.getFont(FontFactory.HELVETICA, 7.5f, COLOR_TEXT_MUTED);
    private static final Font FONT_FORMAT_CODE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 6.5f, COLOR_NAVY);

    private static final Font FONT_SECTION = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8.5f, COLOR_NAVY);
    private static final Font FONT_BOLD = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7.5f, COLOR_SLATE_DARK);
    private static final Font FONT_NORMAL = FontFactory.getFont(FontFactory.HELVETICA, 7.5f, COLOR_SLATE_DARK);
    private static final Font FONT_MUTED = FontFactory.getFont(FontFactory.HELVETICA, 7f, COLOR_TEXT_MUTED);
    private static final Font FONT_LEGAL = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 6.8f, COLOR_TEXT_MUTED);

    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FORMATO_FECHA_HORA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    /**
     * Genera en memoria el acta formal de descargos y debido proceso por incidente.
     */
    public byte[] generarActaIncidentePdf(Integer incidenteId) {
        Incidente incidente = incidenteRepository.findByIdWithDetails(incidenteId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Incidente no encontrado con ID: " + incidenteId));

        List<IncidenteEstudiante> involucrados = incidenteEstudianteRepository.findByIncidenteIdConDetalles(incidenteId);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            // Márgenes estándar de papelería institucional (Letter): izq 36, der 36, sup 36, inf 46
            Document document = new Document(PageSize.LETTER, 36f, 36f, 36f, 46f);
            PdfWriter writer = PdfWriter.getInstance(document, out);
            writer.setPageEvent(new EventosPaginaInstitucional());
            document.open();

            // 1. Membrete Institucional con Escudo y Normativa
            agregarMembreteInstitucional(document,
                    "ACTA FORMAL DE DEBIDO PROCESO Y DESCARGOS DISCIPLINARIOS",
                    "Expediente Radicado #" + incidente.getId() + " • Sistema Escolar de Convivencia (Ley 1620 de 2013)",
                    "FORMATO: FOR-CONV-04 | VERSIÓN: 02");

            // 2. Metadatos del Incidente
            agregarTablaMetadatos(document, incidente);

            // 3. Descripción de los Hechos
            agregarSeccionHechos(document, incidente.getDescripcionHechos());

            // 4. Detalle de Estudiantes Involucrados, Tipificación y Descargos
            agregarSeccionInvolucrados(document, involucrados);

            // 5. Marco Normativo y Garantía Constitucional
            agregarMarcoLegal(document);

            // 6. Diligencia de Notificación y Firmas
            agregarBloqueFirmas(document, incidente, involucrados);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error al generar el acta formal en PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Error al generar el acta formal en PDF: " + e.getMessage(), e);
        }
    }

    /**
     * Genera en memoria el informe ejecutivo consolidado para Rectoría.
     */
    public byte[] generarConsolidadoRectoriaPdf() {
        MetricasDashboardRectoriaDTO metricas = rectoriaService.obtenerMetricasDashboard();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.LETTER, 36f, 36f, 36f, 46f);
            PdfWriter writer = PdfWriter.getInstance(document, out);
            writer.setPageEvent(new EventosPaginaInstitucional());
            document.open();

            // Membrete Institucional de Rectoría
            agregarMembreteInstitucional(document,
                    "INFORME EJECUTIVO CONSOLIDADO DE CONVIVENCIA ESCOLAR",
                    "Observatorio Institucional de Convivencia • Despacho de Rectoría",
                    "FORMATO: FOR-CONV-01 | VERSIÓN: 03");

            // Resumen Ejecutivo de Métricas
            Paragraph pResumen = new Paragraph("1. INDICADORES GLOBALES DE CONVIVENCIA Y DEBIDO PROCESO", FONT_SECTION);
            pResumen.setSpacingBefore(4f);
            pResumen.setSpacingAfter(3f);
            document.add(pResumen);

            PdfPTable tableKpi = new PdfPTable(5);
            tableKpi.setWidthPercentage(100f);
            tableKpi.setSpacingAfter(5f);

            agregarCeldaKpi(tableKpi, "TOTAL CASOS", String.valueOf(metricas.getTotalIncidentes()), COLOR_NAVY);
            agregarCeldaKpi(tableKpi, "TIPO I (LEVES)", String.valueOf(metricas.getTipoI()), COLOR_TIPO_I);
            agregarCeldaKpi(tableKpi, "TIPO II (GRAVES)", String.valueOf(metricas.getTipoII()), COLOR_TIPO_II);
            agregarCeldaKpi(tableKpi, "TIPO III (GRAVÍSIMAS)", String.valueOf(metricas.getTipoIII()), COLOR_TIPO_III);
            agregarCeldaKpi(tableKpi, "RESOLUCIÓN", metricas.getTasaResolucion() + "%", new Color(21, 128, 61));

            document.add(tableKpi);

            // Focos Críticos de Convivencia (Lugares)
            Paragraph pLugares = new Paragraph("2. MAPA DE CRITICIDAD POR ESPACIOS INSTITUCIONALES", FONT_SECTION);
            pLugares.setSpacingBefore(4f);
            pLugares.setSpacingAfter(3f);
            document.add(pLugares);

            PdfPTable tableLugares = new PdfPTable(new float[]{50f, 25f, 25f});
            tableLugares.setWidthPercentage(100f);
            tableLugares.setSpacingAfter(5f);

            agregarCeldaCabecera(tableLugares, "Espacio / Lugar");
            agregarCeldaCabecera(tableLugares, "Casos Registrados");
            agregarCeldaCabecera(tableLugares, "% del Total");

            if (metricas.getFocosCriticosLugares() != null && !metricas.getFocosCriticosLugares().isEmpty()) {
                for (LugarMetricaDTO l : metricas.getFocosCriticosLugares()) {
                    agregarCelda(tableLugares, l.getNombreLugar(), Element.ALIGN_LEFT, false);
                    agregarCelda(tableLugares, String.valueOf(l.getCantidad()), Element.ALIGN_CENTER, false);
                    agregarCelda(tableLugares, l.getPorcentaje() + "%", Element.ALIGN_CENTER, false);
                }
            } else {
                PdfPCell emptyCell = new PdfPCell(new Phrase("Sin registros de lugares", FONT_NORMAL));
                emptyCell.setColspan(3);
                emptyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                tableLugares.addCell(emptyCell);
            }
            document.add(tableLugares);

            // Estados del Debido Proceso
            Paragraph pEstados = new Paragraph("3. ESTADO DEL DEBIDO PROCESO Y TRAMITACIÓN DE EXPEDIENTES", FONT_SECTION);
            pEstados.setSpacingBefore(4f);
            pEstados.setSpacingAfter(3f);
            document.add(pEstados);

            PdfPTable tableEstados = new PdfPTable(new float[]{50f, 25f, 25f});
            tableEstados.setWidthPercentage(100f);
            tableEstados.setSpacingAfter(5f);

            agregarCeldaCabecera(tableEstados, "Fase Procesal");
            agregarCeldaCabecera(tableEstados, "Expedientes");
            agregarCeldaCabecera(tableEstados, "% Proporción");

            for (EstadoMetricaDTO est : metricas.getDistribucionEstados()) {
                agregarCelda(tableEstados, est.getEtiqueta(), Element.ALIGN_LEFT, false);
                agregarCelda(tableEstados, String.valueOf(est.getCantidad()), Element.ALIGN_CENTER, false);
                agregarCelda(tableEstados, est.getPorcentaje() + "%", Element.ALIGN_CENTER, false);
            }
            document.add(tableEstados);

            // Incidencia por Grado y Franja Horaria (Limpio de jerga técnica)
            Paragraph pGrados = new Paragraph("4. DISTRIBUCIÓN POR GRADOS ESCOLARES (HISTÓRICO INSTITUCIONAL DE MATRÍCULAS)", FONT_SECTION);
            pGrados.setSpacingBefore(4f);
            pGrados.setSpacingAfter(3f);
            document.add(pGrados);

            PdfPTable tableGrados = new PdfPTable(new float[]{50f, 25f, 25f});
            tableGrados.setWidthPercentage(100f);
            tableGrados.setSpacingAfter(6f);

            agregarCeldaCabecera(tableGrados, "Grado Escolar");
            agregarCeldaCabecera(tableGrados, "Casos Asociados");
            agregarCeldaCabecera(tableGrados, "Porcentaje");

            if (metricas.getDistribucionPorGrado() != null && !metricas.getDistribucionPorGrado().isEmpty()) {
                for (GradoMetricaDTO g : metricas.getDistribucionPorGrado()) {
                    agregarCelda(tableGrados, "Grado " + g.getGrado() + "°", Element.ALIGN_LEFT, false);
                    agregarCelda(tableGrados, String.valueOf(g.getCantidad()), Element.ALIGN_CENTER, false);
                    agregarCelda(tableGrados, g.getPorcentaje() + "%", Element.ALIGN_CENTER, false);
                }
            } else {
                PdfPCell emptyGrado = new PdfPCell(new Phrase("Sin datos de grados registrados", FONT_NORMAL));
                emptyGrado.setColspan(3);
                emptyGrado.setHorizontalAlignment(Element.ALIGN_CENTER);
                tableGrados.addCell(emptyGrado);
            }
            document.add(tableGrados);

            // Firmas Rectoría y Comité (Empaquetadas con keepTogether para evitar firmas huérfanas)
            PdfPTable tFirmasContenedor = new PdfPTable(1);
            tFirmasContenedor.setWidthPercentage(100f);
            tFirmasContenedor.setKeepTogether(true);
            tFirmasContenedor.setSpacingBefore(8f);

            PdfPCell cTituloFirmas = new PdfPCell();
            cTituloFirmas.setBorder(Rectangle.NO_BORDER);
            cTituloFirmas.setPaddingBottom(18f);
            Paragraph pFirmas = new Paragraph("5. CONSTANCIA Y RADICACIÓN DIRECTIVA", FONT_SECTION);
            cTituloFirmas.addElement(pFirmas);
            tFirmasContenedor.addCell(cTituloFirmas);

            PdfPTable tFirmas = new PdfPTable(2);
            tFirmas.setWidthPercentage(100f);

            PdfPCell cFirma1 = new PdfPCell();
            cFirma1.setBorder(Rectangle.NO_BORDER);
            cFirma1.addElement(new Paragraph("____________________________________________", FONT_BOLD));
            cFirma1.addElement(new Paragraph("Rector(a) / Presidente Comité de Convivencia", FONT_BOLD));
            cFirma1.addElement(new Paragraph("Institución Educativa Trujillo", FONT_MUTED));
            tFirmas.addCell(cFirma1);

            PdfPCell cFirma2 = new PdfPCell();
            cFirma2.setBorder(Rectangle.NO_BORDER);
            cFirma2.addElement(new Paragraph("____________________________________________", FONT_BOLD));
            cFirma2.addElement(new Paragraph("Secretaría Técnica / Orientación Escolar", FONT_BOLD));
            cFirma2.addElement(new Paragraph("Custodia Oficial del Observatorio de Convivencia", FONT_MUTED));
            tFirmas.addCell(cFirma2);

            PdfPCell cCuerpoFirmas = new PdfPCell();
            cCuerpoFirmas.setBorder(Rectangle.NO_BORDER);
            cCuerpoFirmas.addElement(tFirmas);
            tFirmasContenedor.addCell(cCuerpoFirmas);

            document.add(tFirmasContenedor);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error al generar el consolidado de Rectoría en PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Error al generar el consolidado de Rectoría en PDF: " + e.getMessage(), e);
        }
    }

    /**
     * Construye el membrete oficial con escudo, datos legales de la I.E. Trujillo y barra institucional.
     */
    private void agregarMembreteInstitucional(Document doc, String titulo, String subtitulo, String codigoFormato) throws DocumentException {
        PdfPTable headerTable = new PdfPTable(new float[]{14f, 86f});
        headerTable.setWidthPercentage(100f);
        headerTable.setSpacingAfter(3f);

        // Celda Escudo Institucional
        PdfPCell cellEscudo = new PdfPCell();
        cellEscudo.setBorder(Rectangle.NO_BORDER);
        cellEscudo.setHorizontalAlignment(Element.ALIGN_CENTER);
        cellEscudo.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cellEscudo.setPadding(2f);

        Image escudo = obtenerEscudoInstitucional();
        if (escudo != null) {
            cellEscudo.addElement(escudo);
        }
        headerTable.addCell(cellEscudo);

        // Celda Identificación Legal de la Institución
        PdfPCell cellTexto = new PdfPCell();
        cellTexto.setBorder(Rectangle.NO_BORDER);
        cellTexto.setHorizontalAlignment(Element.ALIGN_CENTER);
        cellTexto.setPaddingLeft(4f);

        Paragraph pPais = new Paragraph("REPÚBLICA DE COLOMBIA", FONT_COUNTRY);
        pPais.setAlignment(Element.ALIGN_CENTER);
        cellTexto.addElement(pPais);

        Paragraph pMuni = new Paragraph("DEPARTAMENTO DEL CESAR • ALCALDÍA MUNICIPAL DE BECERRIL", FONT_MUTED_BOLD);
        pMuni.setAlignment(Element.ALIGN_CENTER);
        cellTexto.addElement(pMuni);

        Paragraph pSecr = new Paragraph("SECRETARÍA DE EDUCACIÓN DEPARTAMENTAL", FONT_SECRETARIA);
        pSecr.setAlignment(Element.ALIGN_CENTER);
        cellTexto.addElement(pSecr);

        Paragraph pColegio = new Paragraph("INSTITUCIÓN EDUCATIVA TRUJILLO", FONT_TITLE);
        pColegio.setAlignment(Element.ALIGN_CENTER);
        cellTexto.addElement(pColegio);

        Paragraph pLema = new Paragraph("“Ciencia, Orden y Trabajo”", FONT_LEMA);
        pLema.setAlignment(Element.ALIGN_CENTER);
        cellTexto.addElement(pLema);

        Paragraph pLegal = new Paragraph("Reconocimiento Oficial de Estudios • Código DANE: 120045000024 • NIT: 824.006.035-4", FONT_LEGAL_HEADER);
        pLegal.setAlignment(Element.ALIGN_CENTER);
        cellTexto.addElement(pLegal);

        Paragraph pSede = new Paragraph("Sede Principal: Becerril, Cesar - Colombia", FONT_MUTED_SMALL);
        pSede.setAlignment(Element.ALIGN_CENTER);
        cellTexto.addElement(pSede);

        headerTable.addCell(cellTexto);
        doc.add(headerTable);

        // Barra decorativa institucional doble (Navy + Sky)
        PdfPTable divider = new PdfPTable(1);
        divider.setWidthPercentage(100f);
        divider.setSpacingAfter(5f);

        PdfPCell lineCell = new PdfPCell();
        lineCell.setBorder(Rectangle.TOP | Rectangle.BOTTOM);
        lineCell.setBorderWidthTop(2f);
        lineCell.setBorderColorTop(COLOR_NAVY);
        lineCell.setBorderWidthBottom(0.75f);
        lineCell.setBorderColorBottom(COLOR_SKY);
        lineCell.setFixedHeight(3.5f);
        divider.addCell(lineCell);
        doc.add(divider);

        // Caja de Título Formal del Documento con Código de Calidad
        PdfPTable boxTitle = new PdfPTable(new float[]{74f, 26f});
        boxTitle.setWidthPercentage(100f);
        boxTitle.setSpacingAfter(6f);

        PdfPCell cTitulo = new PdfPCell();
        cTitulo.setBackgroundColor(COLOR_BG_HEADER);
        cTitulo.setBorderColor(COLOR_BORDER);
        cTitulo.setBorderWidth(0.75f);
        cTitulo.setPadding(5f);
        cTitulo.addElement(new Paragraph(titulo, FONT_DOC_TITLE));
        cTitulo.addElement(new Paragraph(subtitulo, FONT_DOC_SUBTITLE));

        PdfPCell cCodigo = new PdfPCell();
        cCodigo.setBackgroundColor(COLOR_BG_HEADER);
        cCodigo.setBorderColor(COLOR_BORDER);
        cCodigo.setBorderWidth(0.75f);
        cCodigo.setPadding(5f);
        cCodigo.setHorizontalAlignment(Element.ALIGN_RIGHT);
        Paragraph pCod = new Paragraph(codigoFormato, FONT_FORMAT_CODE);
        pCod.setAlignment(Element.ALIGN_RIGHT);
        cCodigo.addElement(pCod);
        Paragraph pRad = new Paragraph("EXPEDICIÓN " + LocalDateTime.now().format(FORMATO_FECHA_HORA), FONT_MUTED_SMALL);
        pRad.setAlignment(Element.ALIGN_RIGHT);
        cCodigo.addElement(pRad);

        boxTitle.addCell(cTitulo);
        boxTitle.addCell(cCodigo);
        doc.add(boxTitle);
    }

    private Image obtenerEscudoInstitucional() {
        try (InputStream is = getClass().getResourceAsStream("/static/images/escudo-ie-trujillo.png")) {
            if (is != null) {
                byte[] bytes = is.readAllBytes();
                Image img = Image.getInstance(bytes);
                img.scaleToFit(54f, 54f);
                return img;
            }
        } catch (Exception e) {
            log.warn("No se pudo cargar el escudo desde classpath: {}", e.getMessage());
        }

        // Fallback local durante desarrollo si el target aún no refresca
        try {
            java.io.File file = new java.io.File("frontend/public/escudo-ie-trujillo.png");
            if (file.exists()) {
                Image img = Image.getInstance(file.getAbsolutePath());
                img.scaleToFit(54f, 54f);
                return img;
            }
        } catch (Exception e) {
            log.warn("No se pudo cargar el escudo desde fallback: {}", e.getMessage());
        }

        return null;
    }

    private void agregarTablaMetadatos(Document doc, Incidente i) throws DocumentException {
        Paragraph pSec = new Paragraph("1. INFORMACIÓN GENERAL DEL EXPEDIENTE", FONT_SECTION);
        pSec.setSpacingBefore(3f);
        pSec.setSpacingAfter(3f);
        doc.add(pSec);

        PdfPTable table = new PdfPTable(new float[]{25f, 25f, 25f, 25f});
        table.setWidthPercentage(100f);
        table.setSpacingAfter(5f);

        Docente d = i.getDocenteReporta();
        Lugar l = i.getLugar();
        Usuario u = i.getUsuarioRegistro();

        agregarCampo(table, "Radicado N°:", "#INC-" + i.getId());
        agregarCampo(table, "Fecha del Hecho:", i.getFechaIncidente() != null ? i.getFechaIncidente().format(FORMATO_FECHA) : "Sin fecha");
        agregarCampo(table, "Hora:", i.getHoraIncidente() != null ? i.getHoraIncidente().toString() : "08:00");
        agregarCampo(table, "Lugar:", l != null ? l.getNombre() : "No especificado");

        agregarCampo(table, "Docente Reportante:", d != null ? (d.getNombres() + " " + d.getApellidos()) : "No especificado");
        agregarCampo(table, "Área Docente:", d != null && d.getAreaDesempeno() != null ? d.getAreaDesempeno() : "Docente de Aula");
        agregarCampo(table, "Registrado Por:", u != null ? (u.getNombres() + " " + u.getApellidos()) : "Orientación");
        agregarCampo(table, "Estado Procesal:", formatearEstado(i.getEstadoProceso()));

        doc.add(table);
    }

    private void agregarSeccionHechos(Document doc, String hechos) throws DocumentException {
        Paragraph pSec = new Paragraph("2. RELACIÓN FÁCTICA Y CIRCUNSTANCIAS DEL INCIDENTE", FONT_SECTION);
        pSec.setSpacingBefore(3f);
        pSec.setSpacingAfter(3f);
        doc.add(pSec);

        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100f);
        table.setSpacingAfter(5f);

        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(COLOR_BG_SUBTLE);
        cell.setBorderColor(COLOR_BORDER);
        cell.setBorderWidth(0.75f);
        cell.setPadding(5f);
        cell.addElement(new Paragraph(hechos != null ? hechos : "Sin descripción registrada.", FONT_NORMAL));

        table.addCell(cell);
        doc.add(table);
    }

    private void agregarSeccionInvolucrados(Document doc, List<IncidenteEstudiante> involucrados) throws DocumentException {
        Paragraph pSec = new Paragraph("3. ESTUDIANTES VINCULADOS, TIPIFICACIÓN DE FALTAS Y DESCARGOS", FONT_SECTION);
        pSec.setSpacingBefore(3f);
        pSec.setSpacingAfter(3f);
        doc.add(pSec);

        if (involucrados == null || involucrados.isEmpty()) {
            Paragraph pEmpty = new Paragraph("No se registran participantes vinculados formalmente a este incidente.", FONT_MUTED);
            pEmpty.setSpacingAfter(5f);
            doc.add(pEmpty);
            return;
        }

        for (int idx = 0; idx < involucrados.size(); idx++) {
            IncidenteEstudiante ie = involucrados.get(idx);
            Estudiante est = ie.getEstudiante();

            PdfPTable table = new PdfPTable(new float[]{28f, 72f});
            table.setWidthPercentage(100f);
            table.setSpacingAfter(5f);

            // Cabecera estudiante
            PdfPCell cellHead = new PdfPCell();
            cellHead.setColspan(2);
            cellHead.setBackgroundColor(COLOR_BG_HEADER);
            cellHead.setBorderColor(COLOR_BORDER);
            cellHead.setBorderWidth(0.75f);
            cellHead.setPadding(4f);

            String nomEst = est != null ? (est.getNombres() + " " + est.getApellidos()) : "Estudiante";
            String docEst = est != null ? est.getDocumento() : "Sin documento";
            String matriculaMomento = "Grado " + ie.getGradoMomento() + "°-" + ie.getGrupoMomento() + " (Año Lectivo " + ie.getAnioLectivo() + ")";
            String rol = formatearRol(ie.getRolEstudiante());

            Paragraph pEst = new Paragraph((idx + 1) + ". " + nomEst + "  |  Doc: " + docEst + "  |  " + matriculaMomento + "  |  Rol: " + rol, FONT_BOLD);
            cellHead.addElement(pEst);
            table.addCell(cellHead);

            // Tipificación individual
            String faltaDesc = ie.getCatalogoFalta() != null
                    ? (ie.getCatalogoFalta().getCodigo() + " - " + ie.getCatalogoFalta().getDescripcion() + " (" + ie.getCatalogoFalta().getClasificacionLey() + ")")
                    : "Tipificación institucional ordinaria";
            agregarFilaDetalle(table, "Falta Tipificada:", faltaDesc);

            // Descargo / Versión libre
            String descargo = ie.getDescargoEstudiante() != null && !ie.getDescargoEstudiante().isBlank()
                    ? ie.getDescargoEstudiante()
                    : "Pendiente de registro de descargos formales.";
            agregarFilaDetalle(table, "Versión / Descargo:", descargo);

            // Compromisos formativos
            String compromisos = ie.getCompromisoIndividual() != null && !ie.getCompromisoIndividual().isBlank()
                    ? ie.getCompromisoIndividual()
                    : "Sin compromisos individuales suscritos a la fecha.";
            agregarFilaDetalle(table, "Compromiso Formativo:", compromisos);

            doc.add(table);
        }
    }

    private void agregarMarcoLegal(Document doc) throws DocumentException {
        Paragraph pMarco = new Paragraph(
                "Marco Jurídico y Garantías del Debido Proceso: La presente actuación se adelanta en estricto cumplimiento del Artículo 29 de la Constitución Política de Colombia (Garantía Fundamental del Debido Proceso), la Ley 1098 de 2006 (Código de la Infancia y la Adolescencia - Principio del Interés Superior del Menor y Protección Integral), la Ley 1620 de 2013 (Sistema Nacional de Convivencia Escolar), el Decreto Reglamentario 1965 de 2013 y el Manual de Convivencia Institucional de la Institución Educativa Trujillo. Se salvaguardan en todo momento la presunción de inocencia, el derecho a ser escuchado en descargos, el derecho a la defensa y el fin pedagógico, formativo y restaurativo de las medidas acordadas.",
                FONT_LEGAL
        );
        pMarco.setSpacingBefore(3f);
        pMarco.setSpacingAfter(6f);
        doc.add(pMarco);
    }

    private void agregarBloqueFirmas(Document doc, Incidente inc, List<IncidenteEstudiante> involucrados) throws DocumentException {
        PdfPTable tableFirmasContenedor = new PdfPTable(1);
        tableFirmasContenedor.setWidthPercentage(100f);
        tableFirmasContenedor.setKeepTogether(true);
        tableFirmasContenedor.setSpacingBefore(4f);

        PdfPCell cTituloFirmas = new PdfPCell();
        cTituloFirmas.setBorder(Rectangle.NO_BORDER);
        cTituloFirmas.setPaddingBottom(12f);
        Paragraph pSec = new Paragraph("4. DILIGENCIA DE NOTIFICACIÓN Y SUSCRIPCIÓN DE COMPROMISOS", FONT_SECTION);
        cTituloFirmas.addElement(pSec);
        tableFirmasContenedor.addCell(cTituloFirmas);

        PdfPTable tableFirmas = new PdfPTable(2);
        tableFirmas.setWidthPercentage(100f);

        // 1. Firma Funcionario / Orientador
        Usuario u = inc.getUsuarioRegistro();
        String nomFunc = u != null ? (u.getNombres() + " " + u.getApellidos()) : "Orientador(a) Escolar";
        PdfPCell cFunc = new PdfPCell();
        cFunc.setBorder(Rectangle.NO_BORDER);
        cFunc.setPaddingBottom(14f);
        cFunc.addElement(new Paragraph("____________________________________________", FONT_BOLD));
        cFunc.addElement(new Paragraph(nomFunc, FONT_BOLD));
        cFunc.addElement(new Paragraph("Funcionario de Orientación Escolar / Rectoría", FONT_MUTED));
        cFunc.addElement(new Paragraph("Institución Educativa Trujillo", FONT_MUTED));
        tableFirmas.addCell(cFunc);

        // 2. Firma Acudiente Principal
        String nomAcudiente = "Acudiente / Representante Legal";
        String telAcudiente = "Tel: ___________________";
        if (involucrados != null && !involucrados.isEmpty()) {
            Estudiante e = involucrados.get(0).getEstudiante();
            if (e != null && e.getNombreAcudiente() != null) {
                nomAcudiente = e.getNombreAcudiente();
                telAcudiente = "Tel: " + (e.getTelefonoAcudiente() != null ? e.getTelefonoAcudiente() : "Sin registro");
            }
        }
        PdfPCell cAcud = new PdfPCell();
        cAcud.setBorder(Rectangle.NO_BORDER);
        cAcud.setPaddingBottom(14f);
        cAcud.addElement(new Paragraph("____________________________________________", FONT_BOLD));
        cAcud.addElement(new Paragraph(nomAcudiente, FONT_BOLD));
        cAcud.addElement(new Paragraph("Acudiente / Notificado(a) - C.C. ________________", FONT_MUTED));
        cAcud.addElement(new Paragraph(telAcudiente, FONT_MUTED));
        tableFirmas.addCell(cAcud);

        // 3. Firmas de Estudiantes con Casilla de Huella Dactilar
        if (involucrados != null) {
            for (IncidenteEstudiante ie : involucrados) {
                Estudiante est = ie.getEstudiante();
                String nom = est != null ? (est.getNombres() + " " + est.getApellidos()) : "Estudiante";
                String docNum = est != null ? est.getDocumento() : "T.I.";

                PdfPCell cEst = new PdfPCell();
                cEst.setBorder(Rectangle.NO_BORDER);
                cEst.setPaddingBottom(12f);

                // Subtabla interna para firma + recuadro de huella
                PdfPTable subFirma = new PdfPTable(new float[]{72f, 28f});
                subFirma.setWidthPercentage(100f);

                PdfPCell cDatos = new PdfPCell();
                cDatos.setBorder(Rectangle.NO_BORDER);
                cDatos.addElement(new Paragraph("____________________________________", FONT_BOLD));
                cDatos.addElement(new Paragraph(nom, FONT_BOLD));
                cDatos.addElement(new Paragraph("Estudiante | Doc: " + docNum, FONT_MUTED));
                cDatos.addElement(new Paragraph("Rol: " + formatearRol(ie.getRolEstudiante()) + " • Grado: " + ie.getGradoMomento() + "°", FONT_MUTED));
                subFirma.addCell(cDatos);

                PdfPCell cHuella = new PdfPCell();
                cHuella.setBorderColor(COLOR_BORDER);
                cHuella.setBorderWidth(0.75f);
                cHuella.setFixedHeight(36f);
                cHuella.setHorizontalAlignment(Element.ALIGN_CENTER);
                cHuella.setVerticalAlignment(Element.ALIGN_MIDDLE);
                Paragraph pHuella = new Paragraph("Huella\nÍndice Der.", FontFactory.getFont(FontFactory.HELVETICA, 5.5f, COLOR_TEXT_MUTED));
                pHuella.setAlignment(Element.ALIGN_CENTER);
                cHuella.addElement(pHuella);
                subFirma.addCell(cHuella);

                cEst.addElement(subFirma);
                tableFirmas.addCell(cEst);
            }
        }

        // Si la cantidad de celdas es impar, completar la fila para asegurar que se dibuje
        tableFirmas.completeRow();

        PdfPCell cCuerpoFirmas = new PdfPCell();
        cCuerpoFirmas.setBorder(Rectangle.NO_BORDER);
        cCuerpoFirmas.addElement(tableFirmas);
        tableFirmasContenedor.addCell(cCuerpoFirmas);

        doc.add(tableFirmasContenedor);
    }

    private void agregarCampo(PdfPTable table, String etiqueta, String valor) {
        PdfPCell cell = new PdfPCell();
        cell.setBorderColor(COLOR_BORDER);
        cell.setBorderWidth(0.75f);
        cell.setBackgroundColor(COLOR_BG_SUBTLE);
        cell.setPadding(3.5f);

        Paragraph p = new Paragraph();
        p.add(new Chunk(etiqueta + " ", FONT_BOLD));
        p.add(new Chunk(valor != null ? valor : "-", FONT_NORMAL));
        cell.addElement(p);

        table.addCell(cell);
    }

    private void agregarFilaDetalle(PdfPTable table, String etiqueta, String valor) {
        PdfPCell cEti = new PdfPCell(new Phrase(etiqueta, FONT_BOLD));
        cEti.setBackgroundColor(COLOR_BG_SUBTLE);
        cEti.setBorderColor(COLOR_BORDER);
        cEti.setBorderWidth(0.75f);
        cEti.setPadding(3f);
        table.addCell(cEti);

        PdfPCell cVal = new PdfPCell(new Phrase(valor != null ? valor : "-", FONT_NORMAL));
        cVal.setBorderColor(COLOR_BORDER);
        cVal.setBorderWidth(0.75f);
        cVal.setPadding(3f);
        table.addCell(cVal);
    }

    private void agregarCeldaCabecera(PdfPTable table, String texto) {
        PdfPCell cell = new PdfPCell(new Phrase(texto, FONT_BOLD));
        cell.setBackgroundColor(COLOR_BG_HEADER);
        cell.setBorderColor(COLOR_BORDER);
        cell.setBorderWidth(0.75f);
        cell.setPadding(3.5f);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }

    private void agregarCelda(PdfPTable table, String texto, int alineacion, boolean bold) {
        PdfPCell cell = new PdfPCell(new Phrase(texto != null ? texto : "-", bold ? FONT_BOLD : FONT_NORMAL));
        cell.setBorderColor(COLOR_BORDER);
        cell.setBorderWidth(0.75f);
        cell.setPadding(3f);
        cell.setHorizontalAlignment(alineacion);
        table.addCell(cell);
    }

    private void agregarCeldaKpi(PdfPTable table, String titulo, String valor, Color colorValor) {
        PdfPCell cell = new PdfPCell();
        cell.setBorderColor(COLOR_BORDER);
        cell.setBorderWidth(0.75f);
        cell.setBackgroundColor(COLOR_BG_SUBTLE);
        cell.setPadding(4f);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph pTit = new Paragraph(titulo, FONT_MUTED);
        pTit.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(pTit);

        Font fVal = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, colorValor);
        Paragraph pVal = new Paragraph(valor, fVal);
        pVal.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(pVal);

        table.addCell(cell);
    }

    private String formatearEstado(EstadoProceso ep) {
        if (ep == null) return "Reportado";
        return switch (ep) {
            case REPORTADO -> "1. Reportado";
            case EN_INDAGACION -> "2. En Indagación";
            case CITACION_PADRES -> "3. Citación Acudientes";
            case EN_INTERVENCION -> "4. En Intervención";
            case CERRADO -> "5. Proceso Cerrado";
        };
    }

    private String formatearRol(RolEstudianteIncidente rol) {
        if (rol == null) return "Partícipe";
        return switch (rol) {
            case AGRESOR_PRINCIPAL -> "Agresor Principal";
            case PARTICIPE -> "Partícipe";
            case VICTIMA -> "Víctima";
            case TESTIGO -> "Testigo";
        };
    }

    /**
     * Evento de página para inyectar pie de página institucional con numeración "Página X de Y"
     * y leyenda oficial de reserva legal.
     */
    private static class EventosPaginaInstitucional extends PdfPageEventHelper {
        private PdfTemplate totalPaginasTemplate;
        private BaseFont baseFont;

        @Override
        public void onOpenDocument(PdfWriter writer, Document document) {
            totalPaginasTemplate = writer.getDirectContent().createTemplate(20, 10);
            try {
                baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
            } catch (Exception e) {
                log.warn("No se pudo inicializar BaseFont para el pie de página del PDF: {}", e.getMessage());
            }
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfContentByte cb = writer.getDirectContent();
            float left = document.left();
            float right = document.right();
            float bottom = document.bottom() - 22;

            // Línea divisoria del pie de página
            cb.setColorStroke(COLOR_BORDER);
            cb.setLineWidth(0.5f);
            cb.moveTo(left, bottom + 16);
            cb.lineTo(right, bottom + 16);
            cb.stroke();

            // Texto legal y de confidencialidad institucional (Lado izquierdo)
            cb.beginText();
            if (baseFont != null) {
                cb.setFontAndSize(baseFont, 6.2f);
            }
            cb.setColorFill(COLOR_TEXT_MUTED);
            cb.showTextAligned(PdfContentByte.ALIGN_LEFT,
                    "Institución Educativa Trujillo • Becerril, Cesar | Código DANE: 120045000024 • NIT: 824.006.035-4",
                    left, bottom + 8, 0);
            cb.showTextAligned(PdfContentByte.ALIGN_LEFT,
                    "Documento oficial reservado expedido bajo reserva legal y protección de datos de menores (Ley 1581 de 2012 y Ley 1620 de 2013).",
                    left, bottom, 0);

            // Numeración de página (Lado derecho)
            String textoPagina = String.format("Página %d de ", writer.getPageNumber());
            if (baseFont != null) {
                cb.setFontAndSize(baseFont, 7f);
            }
            cb.setColorFill(COLOR_SLATE_DARK);
            cb.showTextAligned(PdfContentByte.ALIGN_RIGHT, textoPagina, right - 12, bottom + 4, 0);
            cb.endText();

            // Template con el número total de páginas colocado justo al lado de "de "
            cb.addTemplate(totalPaginasTemplate, right - 11, bottom + 4);
        }

        @Override
        public void onCloseDocument(PdfWriter writer, Document document) {
            totalPaginasTemplate.beginText();
            if (baseFont != null) {
                totalPaginasTemplate.setFontAndSize(baseFont, 7f);
            }
            totalPaginasTemplate.setColorFill(COLOR_SLATE_DARK);
            totalPaginasTemplate.showText(String.valueOf(writer.getPageNumber() - 1));
            totalPaginasTemplate.endText();
        }
    }
}
