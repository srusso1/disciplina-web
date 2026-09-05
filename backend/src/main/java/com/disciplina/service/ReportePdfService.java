package com.disciplina.service;

import com.disciplina.common.exception.RecursoNoEncontradoException;
import com.disciplina.domain.enums.ClasificacionLey;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportePdfService {

    private final IncidenteRepository incidenteRepository;
    private final IncidenteEstudianteRepository incidenteEstudianteRepository;
    private final RectoriaService rectoriaService;

    // Paleta institucional
    private static final Color COLOR_NAVY = new Color(30, 58, 138);       // #1E3A8A
    private static final Color COLOR_NAVY_LIGHT = new Color(37, 99, 235); // #2563EB
    private static final Color COLOR_SLATE_DARK = new Color(15, 23, 42);   // #0F172A
    private static final Color COLOR_BG_HEADER = new Color(241, 245, 249); // #F1F5F9
    private static final Color COLOR_BG_SUBTLE = new Color(248, 250, 252); // #F8FAFC
    private static final Color COLOR_BORDER = new Color(226, 232, 240);    // #E2E8F0
    private static final Color COLOR_TEXT_MUTED = new Color(100, 116, 139);// #64748B
    private static final Color COLOR_TIPO_I = new Color(161, 98, 7);      // Ámbar
    private static final Color COLOR_TIPO_II = new Color(194, 65, 12);     // Naranja
    private static final Color COLOR_TIPO_III = new Color(185, 28, 28);    // Rojo

    private static final Font FONT_TITLE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, COLOR_NAVY);
    private static final Font FONT_SUBTITLE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, COLOR_TEXT_MUTED);
    private static final Font FONT_SECTION = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, COLOR_NAVY);
    private static final Font FONT_BOLD = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8.5f, COLOR_SLATE_DARK);
    private static final Font FONT_NORMAL = FontFactory.getFont(FontFactory.HELVETICA, 8.5f, COLOR_SLATE_DARK);
    private static final Font FONT_MUTED = FontFactory.getFont(FontFactory.HELVETICA, 8f, COLOR_TEXT_MUTED);
    private static final Font FONT_LEGAL = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 7.5f, COLOR_TEXT_MUTED);

    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    /**
     * RF-08 / CU-11: Genera en memoria el acta formal de descargos y debido proceso por incidente.
     */
    public byte[] generarActaIncidentePdf(Integer incidenteId) {
        Incidente incidente = incidenteRepository.findByIdWithDetails(incidenteId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Incidente no encontrado con ID: " + incidenteId));

        List<IncidenteEstudiante> involucrados = incidenteEstudianteRepository.findByIncidenteIdConDetalles(incidenteId);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.LETTER, 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);
            document.open();

            // 1. Membrete Institucional
            agregarMembreteInstitucional(document, "ACTA FORMAL DE DEBIDO PROCESO Y DESCARGOS DISCIPLINARIOS",
                    "Expediente Radicado #" + incidente.getId() + " - Ley 1620 de 2013");

            // 2. Metadatos del Incidente
            agregarTablaMetadatos(document, incidente);

            // 3. Descripción de los Hechos
            agregarSeccionHechos(document, incidente.getDescripcionHechos());

            // 4. Detalle de Estudiantes Involucrados, Snapshots y Descargos
            agregarSeccionInvolucrados(document, involucrados);

            // 5. Marco Normativo y Garantía Constitucional
            agregarMarcoLegal(document);

            // 6. Diligencia de Notificación y Firmas
            agregarBloqueFirmas(document, incidente, involucrados);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar el acta formal en PDF: " + e.getMessage(), e);
        }
    }

    /**
     * RF-08 / CU-11: Genera en memoria el informe ejecutivo consolidado para Rectoría.
     */
    public byte[] generarConsolidadoRectoriaPdf() {
        MetricasDashboardRectoriaDTO metricas = rectoriaService.obtenerMetricasDashboard();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.LETTER, 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);
            document.open();

            // Membrete Institucional de Rectoría
            agregarMembreteInstitucional(document, "INFORME EJECUTIVO CONSOLIDADO DE CONVIVENCIA ESCOLAR",
                    "Observatorio Institucional de Convivencia - Despacho de Rectoría");

            // Resumen Ejecutivo de Métricas
            Paragraph pResumen = new Paragraph("1. INDICADORES GLOBALES DE CONVIVENCIA Y DEBIDO PROCESO", FONT_SECTION);
            pResumen.setSpacingBefore(8f);
            pResumen.setSpacingAfter(4f);
            document.add(pResumen);

            PdfPTable tableKpi = new PdfPTable(5);
            tableKpi.setWidthPercentage(100f);
            tableKpi.setSpacingAfter(8f);

            agregarCeldaKpi(tableKpi, "TOTAL CASOS", String.valueOf(metricas.getTotalIncidentes()), COLOR_NAVY);
            agregarCeldaKpi(tableKpi, "TIPO I (LEVES)", String.valueOf(metricas.getTipoI()), COLOR_TIPO_I);
            agregarCeldaKpi(tableKpi, "TIPO II (GRAVES)", String.valueOf(metricas.getTipoII()), COLOR_TIPO_II);
            agregarCeldaKpi(tableKpi, "TIPO III (GRAVÍSIMAS)", String.valueOf(metricas.getTipoIII()), COLOR_TIPO_III);
            agregarCeldaKpi(tableKpi, "RESOLUCIÓN", metricas.getTasaResolucion() + "%", new Color(21, 128, 61));

            document.add(tableKpi);

            // Focos Críticos de Convivencia (Lugares)
            Paragraph pLugares = new Paragraph("2. MAPA DE CRITICIDAD POR ESPACIOS INSTITUCIONALES", FONT_SECTION);
            pLugares.setSpacingBefore(6f);
            pLugares.setSpacingAfter(4f);
            document.add(pLugares);

            PdfPTable tableLugares = new PdfPTable(new float[]{50f, 25f, 25f});
            tableLugares.setWidthPercentage(100f);
            tableLugares.setSpacingAfter(8f);

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
            pEstados.setSpacingBefore(6f);
            pEstados.setSpacingAfter(4f);
            document.add(pEstados);

            PdfPTable tableEstados = new PdfPTable(new float[]{50f, 25f, 25f});
            tableEstados.setWidthPercentage(100f);
            tableEstados.setSpacingAfter(8f);

            agregarCeldaCabecera(tableEstados, "Fase Procesal");
            agregarCeldaCabecera(tableEstados, "Expedientes");
            agregarCeldaCabecera(tableEstados, "% Proporción");

            for (EstadoMetricaDTO est : metricas.getDistribucionEstados()) {
                agregarCelda(tableEstados, est.getEtiqueta(), Element.ALIGN_LEFT, false);
                agregarCelda(tableEstados, String.valueOf(est.getCantidad()), Element.ALIGN_CENTER, false);
                agregarCelda(tableEstados, est.getPorcentaje() + "%", Element.ALIGN_CENTER, false);
            }
            document.add(tableEstados);

            // Incidencia por Grado y Franja Horaria
            Paragraph pGrados = new Paragraph("4. DISTRIBUCIÓN POR GRADOS ESCOLARES (SNAPSHOTS INMUTABLES)", FONT_SECTION);
            pGrados.setSpacingBefore(6f);
            pGrados.setSpacingAfter(4f);
            document.add(pGrados);

            PdfPTable tableGrados = new PdfPTable(new float[]{50f, 25f, 25f});
            tableGrados.setWidthPercentage(100f);
            tableGrados.setSpacingAfter(8f);

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

            // Firmas Rectoría y Comité
            Paragraph pFirmas = new Paragraph("5. CONSTANCIA Y RADICACIÓN DIRECTIVA", FONT_SECTION);
            pFirmas.setSpacingBefore(10f);
            pFirmas.setSpacingAfter(25f);
            document.add(pFirmas);

            PdfPTable tFirmas = new PdfPTable(2);
            tFirmas.setWidthPercentage(100f);

            PdfPCell cFirma1 = new PdfPCell();
            cFirma1.setBorder(Rectangle.NO_BORDER);
            cFirma1.addElement(new Paragraph("____________________________________________", FONT_BOLD));
            cFirma1.addElement(new Paragraph("Rector(a) / Presidente Comité de Convivencia", FONT_BOLD));
            cFirma1.addElement(new Paragraph("Institución Educativa José María Trujillo", FONT_MUTED));
            tFirmas.addCell(cFirma1);

            PdfPCell cFirma2 = new PdfPCell();
            cFirma2.setBorder(Rectangle.NO_BORDER);
            cFirma2.addElement(new Paragraph("____________________________________________", FONT_BOLD));
            cFirma2.addElement(new Paragraph("Secretaría Técnica / Orientación Escolar", FONT_BOLD));
            cFirma2.addElement(new Paragraph("Custodia Oficial del Observatorio de Convivencia", FONT_MUTED));
            tFirmas.addCell(cFirma2);

            document.add(tFirmas);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar el consolidado de Rectoría en PDF: " + e.getMessage(), e);
        }
    }

    private void agregarMembreteInstitucional(Document doc, String titulo, String subtitulo) throws DocumentException {
        PdfPTable header = new PdfPTable(1);
        header.setWidthPercentage(100f);
        header.setSpacingAfter(8f);

        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(COLOR_BG_HEADER);
        cell.setBorderColor(COLOR_BORDER);
        cell.setPadding(8f);

        Paragraph pInst = new Paragraph("REPÚBLICA DE COLOMBIA - SECRETARÍA DE EDUCACIÓN", FONT_SUBTITLE);
        pInst.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(pInst);

        Paragraph pCol = new Paragraph("INSTITUCIÓN EDUCATIVA JOSÉ MARÍA TRUJILLO", FONT_TITLE);
        pCol.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(pCol);

        Paragraph pTit = new Paragraph(titulo, FONT_SECTION);
        pTit.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(pTit);

        Paragraph pSub = new Paragraph(subtitulo, FONT_MUTED);
        pSub.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(pSub);

        header.addCell(cell);
        doc.add(header);
    }

    private void agregarTablaMetadatos(Document doc, Incidente i) throws DocumentException {
        Paragraph pSec = new Paragraph("1. INFORMACIÓN GENERAL DEL EXPEDIENTE", FONT_SECTION);
        pSec.setSpacingBefore(4f);
        pSec.setSpacingAfter(4f);
        doc.add(pSec);

        PdfPTable table = new PdfPTable(new float[]{25f, 25f, 25f, 25f});
        table.setWidthPercentage(100f);
        table.setSpacingAfter(6f);

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
        pSec.setSpacingBefore(4f);
        pSec.setSpacingAfter(4f);
        doc.add(pSec);

        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100f);
        table.setSpacingAfter(6f);

        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(COLOR_BG_SUBTLE);
        cell.setBorderColor(COLOR_BORDER);
        cell.setPadding(6f);
        cell.addElement(new Paragraph(hechos != null ? hechos : "Sin descripción registrada.", FONT_NORMAL));

        table.addCell(cell);
        doc.add(table);
    }

    private void agregarSeccionInvolucrados(Document doc, List<IncidenteEstudiante> involucrados) throws DocumentException {
        Paragraph pSec = new Paragraph("3. ESTUDIANTES INVOLUCRADOS, VERSIONES LIBRES Y DESCARGOS", FONT_SECTION);
        pSec.setSpacingBefore(4f);
        pSec.setSpacingAfter(4f);
        doc.add(pSec);

        if (involucrados == null || involucrados.isEmpty()) {
            Paragraph pEmpty = new Paragraph("No se registran participantes vinculados formalmente a este incidente.", FONT_MUTED);
            pEmpty.setSpacingAfter(6f);
            doc.add(pEmpty);
            return;
        }

        for (int idx = 0; idx < involucrados.size(); idx++) {
            IncidenteEstudiante ie = involucrados.get(idx);
            Estudiante est = ie.getEstudiante();

            PdfPTable table = new PdfPTable(new float[]{30f, 70f});
            table.setWidthPercentage(100f);
            table.setSpacingAfter(5f);

            // Cabecera estudiante
            PdfPCell cellHead = new PdfPCell();
            cellHead.setColspan(2);
            cellHead.setBackgroundColor(COLOR_BG_HEADER);
            cellHead.setBorderColor(COLOR_BORDER);
            cellHead.setPadding(4f);

            String nomEst = est != null ? (est.getNombres() + " " + est.getApellidos()) : "Estudiante";
            String docEst = est != null ? est.getDocumento() : "Sin documento";
            String snapshot = "Grado " + ie.getGradoMomento() + "°-" + ie.getGrupoMomento() + " (Vigencia " + ie.getAnioLectivo() + ")";
            String rol = formatearRol(ie.getRolEstudiante());

            Paragraph pEst = new Paragraph((idx + 1) + ". " + nomEst + "  |  Doc: " + docEst + "  |  " + snapshot + "  |  Rol: " + rol, FONT_BOLD);
            cellHead.addElement(pEst);
            table.addCell(cellHead);

            // Tipificación individual
            String faltaDesc = ie.getCatalogoFalta() != null
                    ? (ie.getCatalogoFalta().getCodigo() + " - " + ie.getCatalogoFalta().getDescripcion() + " (" + ie.getCatalogoFalta().getClasificacionLey() + ")")
                    : "Tipificación institucional ordinaria";
            agregarFilaDetalle(table, "Falta Tipificada:", faltaDesc);

            // Descargo
            String descargo = ie.getDescargoEstudiante() != null && !ie.getDescargoEstudiante().isBlank()
                    ? ie.getDescargoEstudiante()
                    : "Pendiente de registro de descargos formales.";
            agregarFilaDetalle(table, "Versión / Descargo:", descargo);

            // Compromisos
            String compromisos = ie.getCompromisoIndividual() != null && !ie.getCompromisoIndividual().isBlank()
                    ? ie.getCompromisoIndividual()
                    : "Sin compromisos individuales suscritos a la fecha.";
            agregarFilaDetalle(table, "Compromiso Formativo:", compromisos);

            doc.add(table);
        }
    }

    private void agregarMarcoLegal(Document doc) throws DocumentException {
        Paragraph pMarco = new Paragraph(
                "Marco Jurídico de Garantías: Este procedimiento se realiza en estricto cumplimiento del Artículo 29 de la Constitución Política de Colombia (Debido Proceso), la Ley 1098 de 2006 (Código de la Infancia y la Adolescencia), la Ley 1620 de 2013 y el Decreto 1965 de 2013. Se salvaguardan los principios de presunción de inocencia, derecho a la defensa y el carácter formativo y restaurativo de las medidas.",
                FONT_LEGAL
        );
        pMarco.setSpacingBefore(4f);
        pMarco.setSpacingAfter(8f);
        doc.add(pMarco);
    }

    private void agregarBloqueFirmas(Document doc, Incidente inc, List<IncidenteEstudiante> involucrados) throws DocumentException {
        Paragraph pSec = new Paragraph("4. DILIGENCIA DE NOTIFICACIÓN Y SUSCRIPCIÓN DE COMPROMISOS", FONT_SECTION);
        pSec.setSpacingBefore(4f);
        pSec.setSpacingAfter(18f);
        doc.add(pSec);

        PdfPTable tableFirmas = new PdfPTable(2);
        tableFirmas.setWidthPercentage(100f);

        // Firma Funcionario
        Usuario u = inc.getUsuarioRegistro();
        String nomFunc = u != null ? (u.getNombres() + " " + u.getApellidos()) : "Orientador Escolar";
        PdfPCell cFunc = new PdfPCell();
        cFunc.setBorder(Rectangle.NO_BORDER);
        cFunc.setPaddingBottom(18f);
        cFunc.addElement(new Paragraph("____________________________________________", FONT_BOLD));
        cFunc.addElement(new Paragraph(nomFunc, FONT_BOLD));
        cFunc.addElement(new Paragraph("Funcionario de Orientación Escolar / Rectoría", FONT_MUTED));
        cFunc.addElement(new Paragraph("Custodia del Debido Proceso", FONT_MUTED));
        tableFirmas.addCell(cFunc);

        // Firma Acudiente Principal
        String nomAcudiente = "Acudiente / Padre de Familia";
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
        cAcud.setPaddingBottom(18f);
        cAcud.addElement(new Paragraph("____________________________________________", FONT_BOLD));
        cAcud.addElement(new Paragraph(nomAcudiente, FONT_BOLD));
        cAcud.addElement(new Paragraph("Acudiente / Notificado(a)", FONT_MUTED));
        cAcud.addElement(new Paragraph(telAcudiente, FONT_MUTED));
        tableFirmas.addCell(cAcud);

        // Firmas Estudiantes
        if (involucrados != null) {
            for (IncidenteEstudiante ie : involucrados) {
                Estudiante est = ie.getEstudiante();
                String nom = est != null ? (est.getNombres() + " " + est.getApellidos()) : "Estudiante";
                String docNum = est != null ? est.getDocumento() : "T.I.";

                PdfPCell cEst = new PdfPCell();
                cEst.setBorder(Rectangle.NO_BORDER);
                cEst.setPaddingBottom(16f);
                cEst.addElement(new Paragraph("____________________________________________", FONT_BOLD));
                cEst.addElement(new Paragraph(nom, FONT_BOLD));
                cEst.addElement(new Paragraph("Estudiante | Doc: " + docNum, FONT_MUTED));
                cEst.addElement(new Paragraph("Rol: " + formatearRol(ie.getRolEstudiante()), FONT_MUTED));
                tableFirmas.addCell(cEst);
            }
        }

        doc.add(tableFirmas);
    }

    private void agregarCampo(PdfPTable table, String etiqueta, String valor) {
        PdfPCell cell = new PdfPCell();
        cell.setBorderColor(COLOR_BORDER);
        cell.setBackgroundColor(COLOR_BG_SUBTLE);
        cell.setPadding(4f);

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
        cEti.setPadding(3.5f);
        table.addCell(cEti);

        PdfPCell cVal = new PdfPCell(new Phrase(valor != null ? valor : "-", FONT_NORMAL));
        cVal.setBorderColor(COLOR_BORDER);
        cVal.setPadding(3.5f);
        table.addCell(cVal);
    }

    private void agregarCeldaCabecera(PdfPTable table, String texto) {
        PdfPCell cell = new PdfPCell(new Phrase(texto, FONT_BOLD));
        cell.setBackgroundColor(COLOR_BG_HEADER);
        cell.setBorderColor(COLOR_BORDER);
        cell.setPadding(4.5f);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }

    private void agregarCelda(PdfPTable table, String texto, int alineacion, boolean bold) {
        PdfPCell cell = new PdfPCell(new Phrase(texto != null ? texto : "-", bold ? FONT_BOLD : FONT_NORMAL));
        cell.setBorderColor(COLOR_BORDER);
        cell.setPadding(3.5f);
        cell.setHorizontalAlignment(alineacion);
        table.addCell(cell);
    }

    private void agregarCeldaKpi(PdfPTable table, String titulo, String valor, Color colorValor) {
        PdfPCell cell = new PdfPCell();
        cell.setBorderColor(COLOR_BORDER);
        cell.setBackgroundColor(COLOR_BG_SUBTLE);
        cell.setPadding(5f);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph pTit = new Paragraph(titulo, FONT_MUTED);
        pTit.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(pTit);

        Font fVal = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, colorValor);
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
}
