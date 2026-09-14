package com.disciplina.service;

import com.disciplina.domain.model.Docente;
import com.disciplina.domain.repository.DocenteRepository;
import com.disciplina.dto.configuracion.ImportacionDocentesResumenDTO;
import com.disciplina.dto.matricula.AdvertenciaFilaDTO;
import com.disciplina.dto.matricula.ErrorFilaDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Pattern;

import com.disciplina.domain.model.AreaDesempeno;
import com.disciplina.domain.repository.AreaDesempenoRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImportadorDocentesService {

    private final DocenteRepository docenteRepository;
    private final AreaDesempenoRepository areaDesempenoRepository;

    private static final String DEFAULT_AREA = "PENDIENTE POR REGISTRO";

    @Transactional
    public ImportacionDocentesResumenDTO importarPlanilla(InputStream inputStream) {
        long startTime = System.currentTimeMillis();

        ImportacionDocentesResumenDTO resumen = ImportacionDocentesResumenDTO.builder()
                .advertencias(new ArrayList<>())
                .errores(new ArrayList<>())
                .build();

        try (Workbook workbook = WorkbookFactory.create(inputStream)) {
            Sheet sheet = workbook.getNumberOfSheets() > 0 ? workbook.getSheetAt(0) : null;
            if (sheet == null) {
                resumen.getErrores().add(new ErrorFilaDTO(1, "N/A", "No se encontró ninguna hoja de datos en el archivo Excel."));
                return resumen;
            }

            int headerRowIndex = buscarFilaCabecera(sheet);
            if (headerRowIndex == -1) {
                resumen.getErrores().add(new ErrorFilaDTO(1, "N/A", "No se detectó la fila de encabezados con columnas requeridas (CEDULA o DOCUMENTO, y NOMBRES / APELLIDOS)."));
                return resumen;
            }

            Map<String, Integer> colMap = mapearColumnas(sheet.getRow(headerRowIndex));

            if (!colMap.containsKey("documento")) {
                resumen.getErrores().add(new ErrorFilaDTO(headerRowIndex + 1, "CEDULA", "Columna de identificación/cédula no encontrada en el encabezado."));
                return resumen;
            }

            boolean hasIndividualNames = colMap.containsKey("primerNombre") && colMap.containsKey("primerApellido");
            boolean hasGroupedNames = colMap.containsKey("nombres") && colMap.containsKey("apellidos");
            boolean hasFullName = colMap.containsKey("nombreCompleto");

            if (!hasIndividualNames && !hasGroupedNames && !hasFullName) {
                resumen.getErrores().add(new ErrorFilaDTO(headerRowIndex + 1, "NOMBRES/APELLIDOS", "No se encontraron columnas de nombres y apellidos en el archivo."));
                return resumen;
            }

            int totalRows = sheet.getLastRowNum();
            int procesadas = 0;
            int creados = 0;
            int actualizados = 0;

            for (int r = headerRowIndex + 1; r <= totalRows; r++) {
                Row row = sheet.getRow(r);
                if (row == null || esFilaVacia(row)) {
                    continue;
                }

                procesadas++;
                int filaHumana = r + 1;

                String rawDoc = obtenerValorCelda(row, colMap.get("documento"));
                String documento = sanitizarDocumento(rawDoc);

                if (documento.isEmpty()) {
                    resumen.getErrores().add(new ErrorFilaDTO(filaHumana, "DOCUMENTO", "Documento de identidad vacío o inválido."));
                    continue;
                }

                String nombres;
                String apellidos;

                if (hasIndividualNames) {
                    String pNom = obtenerValorCelda(row, colMap.get("primerNombre"));
                    String sNom = colMap.containsKey("segundoNombre") ? obtenerValorCelda(row, colMap.get("segundoNombre")) : "";
                    nombres = (pNom + " " + sNom).trim();

                    String pApe = obtenerValorCelda(row, colMap.get("primerApellido"));
                    String sApe = colMap.containsKey("segundoApellido") ? obtenerValorCelda(row, colMap.get("segundoApellido")) : "";
                    apellidos = (pApe + " " + sApe).trim();
                } else if (hasGroupedNames) {
                    nombres = obtenerValorCelda(row, colMap.get("nombres"));
                    apellidos = obtenerValorCelda(row, colMap.get("apellidos"));
                } else {
                    String completo = obtenerValorCelda(row, colMap.get("nombreCompleto"));
                    String[] partes = completo.split("\\s+");
                    if (partes.length >= 2) {
                        nombres = partes[0];
                        apellidos = completo.substring(partes[0].length()).trim();
                    } else {
                        nombres = completo;
                        apellidos = "PENDIENTE";
                    }
                }

                if (nombres.isEmpty()) nombres = "DOCENTE SIN NOMBRE";
                if (apellidos.isEmpty()) apellidos = "DOCENTE SIN APELLIDO";

                // Extracción de Área: si existe columna y tiene contenido, se usa; de lo contrario, DEFAULT_AREA
                String area = DEFAULT_AREA;
                if (colMap.containsKey("area")) {
                    String areaVal = obtenerValorCelda(row, colMap.get("area"));
                    if (!areaVal.isEmpty()) {
                        area = areaVal;
                    }
                }

                AreaDesempeno areaEntity = null;
                if (!area.isEmpty()) {
                    final String nombreArea = area.trim();
                    areaEntity = areaDesempenoRepository.findByNombreIgnoreCase(nombreArea).orElseGet(() ->
                            areaDesempenoRepository.save(AreaDesempeno.builder()
                                    .nombre(nombreArea)
                                    .descripcion("Área académica registrada en importación")
                                    .activo(true)
                                    .build())
                    );
                }

                // Upsert en base de datos
                Optional<Docente> existenteOpt = docenteRepository.findByDocumento(documento);
                if (existenteOpt.isPresent()) {
                    Docente docente = existenteOpt.get();
                    docente.setNombres(nombres);
                    docente.setApellidos(apellidos);
                    if (areaEntity != null || docente.getAreaDesempeno() == null) {
                        if (areaEntity != null) {
                            docente.setAreaDesempeno(areaEntity);
                        }
                    }
                    docente.setActivo(true);
                    docenteRepository.save(docente);
                    actualizados++;
                } else {
                    Docente nuevo = Docente.builder()
                            .documento(documento)
                            .nombres(nombres)
                            .apellidos(apellidos)
                            .areaDesempeno(areaEntity)
                            .activo(true)
                            .build();
                    docenteRepository.save(nuevo);
                    creados++;
                }
            }

            resumen.setTotalFilas(procesadas);
            resumen.setDocentesCreados(creados);
            resumen.setDocentesActualizados(actualizados);
            resumen.setTiempoMs(System.currentTimeMillis() - startTime);

            log.info("Importación masiva de docentes completada: {} filas, {} creados, {} actualizados en {} ms",
                    procesadas, creados, actualizados, resumen.getTiempoMs());

            return resumen;

        } catch (Exception e) {
            log.error("Error al procesar el archivo Excel de docentes: {}", e.getMessage(), e);
            resumen.getErrores().add(new ErrorFilaDTO(0, "ARCHIVO", "Error al procesar la planilla: " + e.getMessage()));
            resumen.setTiempoMs(System.currentTimeMillis() - startTime);
            return resumen;
        }
    }

    public byte[] generarPlantillaEjemplo() {
        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Docentes");

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            String[] headers = {
                "CEDULA", "1NOMBRE", "2NOMBRE", "1APELLIDO", "2APELLIDO", "AREA", "CORREO"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            String[][] sampleData = {
                {"84033844", "Orlis", "De Jesus", "Amaya", "Ochoa", "Ciencias Naturales y Educación Ambiental", "orlis.amaya@disciplina.edu.co"},
                {"1067845827", "Omar", "Andres", "Andrade", "Arteaga", "Matemáticas y Estadística", "omar.andrade@disciplina.edu.co"},
                {"49744158", "Sara", "Esther", "Arango", "Villarreal", "Lengua Castellana e Idioma Extranjero", "sara.arango@disciplina.edu.co"}
            };

            for (int r = 0; r < sampleData.length; r++) {
                Row row = sheet.createRow(r + 1);
                for (int c = 0; c < sampleData[r].length; c++) {
                    Cell cell = row.createCell(c);
                    cell.setCellValue(sampleData[r][c]);
                }
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error al generar plantilla Excel de docentes: {}", e.getMessage(), e);
            throw new RuntimeException("Error al generar la plantilla oficial de docentes", e);
        }
    }

    private int buscarFilaCabecera(Sheet sheet) {
        int maxRowsToScan = Math.min(15, sheet.getLastRowNum() + 1);
        for (int r = 0; r < maxRowsToScan; r++) {
            Row row = sheet.getRow(r);
            if (row == null) continue;

            boolean hasDoc = false;
            boolean hasName = false;

            for (Cell cell : row) {
                String val = normalizarTexto(getCellString(cell));
                if (val.matches(".*(cedula|documento|identificacion).*")) {
                    hasDoc = true;
                }
                if (val.matches(".*(nombre|apellido).*")) {
                    hasName = true;
                }
            }

            if (hasDoc && hasName) {
                return r;
            }
        }
        return -1;
    }

    private Map<String, Integer> mapearColumnas(Row headerRow) {
        Map<String, Integer> map = new HashMap<>();

        for (int c = 0; c < headerRow.getLastCellNum(); c++) {
            Cell cell = headerRow.getCell(c);
            if (cell == null) continue;

            String val = normalizarTexto(getCellString(cell));

            if (val.matches(".*(cedula|cédula|documento|identificacion|identificación|doc).*") && !map.containsKey("documento")) {
                map.put("documento", c);
            } else if (val.matches(".*(1\\s*nombre|1er\\s*nombre|primer\\s*nombre|nombre\\s*1).*") && !map.containsKey("primerNombre")) {
                map.put("primerNombre", c);
            } else if (val.matches(".*(2\\s*nombre|2do\\s*nombre|segundo\\s*nombre|nombre\\s*2).*") && !map.containsKey("segundoNombre")) {
                map.put("segundoNombre", c);
            } else if (val.matches(".*(1\\s*apellido|1er\\s*apellido|primer\\s*apellido|apellido\\s*1).*") && !map.containsKey("primerApellido")) {
                map.put("primerApellido", c);
            } else if (val.matches(".*(2\\s*apellido|2do\\s*apellido|segundo\\s*apellido|apellido\\s*2).*") && !map.containsKey("segundoApellido")) {
                map.put("segundoApellido", c);
            } else if ((val.equals("nombres") || val.equals("nombre")) && !map.containsKey("nombres")) {
                map.put("nombres", c);
            } else if ((val.equals("apellidos") || val.equals("apellido")) && !map.containsKey("apellidos")) {
                map.put("apellidos", c);
            } else if (val.matches(".*(nombre\\s*completo|docente).*") && !map.containsKey("nombreCompleto")) {
                map.put("nombreCompleto", c);
            } else if (val.matches(".*(area|área|asignatura|materia|desempeno|desempeño).*") && !map.containsKey("area")) {
                map.put("area", c);
            } else if (val.matches(".*(correo|email|e-mail).*") && !map.containsKey("correo")) {
                map.put("correo", c);
            }
        }

        return map;
    }

    private String normalizarTexto(String raw) {
        if (raw == null) return "";
        return raw.trim().toLowerCase()
                .replace("á", "a")
                .replace("é", "e")
                .replace("í", "i")
                .replace("ó", "o")
                .replace("ú", "u");
    }

    private String sanitizarDocumento(String raw) {
        if (raw == null) return "";
        String s = raw.trim();
        if (s.endsWith(".0")) {
            s = s.substring(0, s.length() - 2);
        }
        return s.replaceAll("[^a-zA-Z0-9_-]", "").trim();
    }

    private String obtenerValorCelda(Row row, Integer colIdx) {
        if (colIdx == null || colIdx < 0) return "";
        Cell cell = row.getCell(colIdx);
        return getCellString(cell);
    }

    private String getCellString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                }
                double num = cell.getNumericCellValue();
                if (num == Math.floor(num)) {
                    return new BigDecimal(num).toBigInteger().toString();
                }
                return String.valueOf(num);
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return cell.getStringCellValue().trim();
                } catch (Exception e) {
                    try {
                        return String.valueOf(cell.getNumericCellValue());
                    } catch (Exception ex) {
                        return "";
                    }
                }
            default:
                return "";
        }
    }

    private boolean esFilaVacia(Row row) {
        for (Cell cell : row) {
            if (cell != null && cell.getCellType() != CellType.BLANK && !getCellString(cell).isEmpty()) {
                return false;
            }
        }
        return true;
    }
}
