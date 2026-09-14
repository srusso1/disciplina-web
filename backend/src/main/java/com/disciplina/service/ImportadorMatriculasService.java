package com.disciplina.service;

import com.disciplina.domain.enums.EstadoMatricula;
import com.disciplina.domain.model.Estudiante;
import com.disciplina.domain.model.MatriculaEstudiante;
import com.disciplina.domain.repository.EstudianteRepository;
import com.disciplina.common.util.GradoEscolarUtil;
import com.disciplina.domain.repository.MatriculaEstudianteRepository;
import com.disciplina.dto.matricula.AdvertenciaFilaDTO;
import com.disciplina.dto.matricula.ErrorFilaDTO;
import com.disciplina.dto.matricula.ImportacionMatriculasResumenDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImportadorMatriculasService {

    private final EstudianteRepository estudianteRepository;
    private final MatriculaEstudianteRepository matriculaEstudianteRepository;

    private static final Pattern ANIO_PATTERN = Pattern.compile("\\b(20\\d{2})\\b");

    private static class FilaParsed {
        int numeroFila;
        String codigo;
        String documento;
        String nombres;
        String apellidos;
        String nombreCompleto;
        String nombreAcudiente;
        String telefonoAcudiente;
        String grado;
        String grupo;
        String jornada;
    }

    @Transactional
    public ImportacionMatriculasResumenDTO importarPlanilla(InputStream inputStream, Integer anioLectivoParam) {
        long startTime = System.currentTimeMillis();

        ImportacionMatriculasResumenDTO resumen = ImportacionMatriculasResumenDTO.builder()
                .advertencias(new ArrayList<>())
                .errores(new ArrayList<>())
                .build();

        try (Workbook workbook = WorkbookFactory.create(inputStream)) {
            Sheet sheet = buscarHojaDatos(workbook);
            if (sheet == null) {
                resumen.getErrores().add(new ErrorFilaDTO(1, "N/A", "No se encontro ninguna hoja de datos valida en el archivo Excel"));
                return resumen;
            }

            int anioLectivo = resolverAnioLectivo(sheet, anioLectivoParam);
            resumen.setAnioLectivo(anioLectivo);

            int headerRowIndex = buscarFilaCabecera(sheet);
            if (headerRowIndex == -1) {
                resumen.getErrores().add(new ErrorFilaDTO(1, "N/A", "No se detecto la fila de encabezados con columnas requeridas (GRADO, CODIGO, IDENTIFICACION)"));
                return resumen;
            }

            Map<String, Integer> colMap = mapearColumnas(sheet.getRow(headerRowIndex));

            int totalRows = sheet.getLastRowNum();
            List<FilaParsed> filasValidas = new ArrayList<>();

            for (int r = headerRowIndex + 1; r <= totalRows; r++) {
                Row row = sheet.getRow(r);
                if (row == null || esFilaVacia(row)) {
                    continue;
                }

                FilaParsed parsed = parsearFila(row, r + 1, colMap, resumen);
                if (parsed != null) {
                    filasValidas.add(parsed);
                }
            }

            resumen.setTotalFilasLeidas(filasValidas.size());

            // Procesamiento en lote de alta eficiencia (evita problema N+1 de red)
            procesarEnLote(filasValidas, anioLectivo, resumen);

        } catch (Exception e) {
            log.error("Error critico procesando archivo Excel de matriculas", e);
            resumen.getErrores().add(new ErrorFilaDTO(0, "CRITICO", "Fallo al leer la estructura del archivo Excel: " + e.getMessage()));
        }

        resumen.setTiempoProcesamientoMs(System.currentTimeMillis() - startTime);
        log.info("Importacion finalizada: {} filas, {} estudiantes creados, {} matriculas creadas, {} ms",
                resumen.getTotalFilasLeidas(), resumen.getEstudiantesCreados(), resumen.getMatriculasCreadas(), resumen.getTiempoProcesamientoMs());

        return resumen;
    }

    private FilaParsed parsearFila(Row row, int numeroFila, Map<String, Integer> colMap, ImportacionMatriculasResumenDTO resumen) {
        String codigo = obtenerValorCelda(row, colMap.get("CODIGO"));
        String rawGrado = obtenerValorCelda(row, colMap.get("GRADO"));
        String nom1 = obtenerValorCelda(row, colMap.get("NOMBRE 1"));
        String nom2 = obtenerValorCelda(row, colMap.get("NOMBRE 2"));
        String ape1 = obtenerValorCelda(row, colMap.get("APELLIDO 1"));
        String ape2 = obtenerValorCelda(row, colMap.get("APELLIDO 2"));
        String rawDoc = obtenerValorCelda(row, colMap.get("DOCUMENTO"));
        String sede = obtenerValorCelda(row, colMap.get("SEDE"));

        String nom1Acu = obtenerValorCelda(row, colMap.get("NOM1_ACU"));
        String nom2Acu = obtenerValorCelda(row, colMap.get("NOM2_ACU"));
        String ape1Acu = obtenerValorCelda(row, colMap.get("APE1_ACU"));
        String ape2Acu = obtenerValorCelda(row, colMap.get("APE2_ACU"));
        String telAcu = obtenerValorCelda(row, colMap.get("TEL_ACU"));
        String telEst = obtenerValorCelda(row, colMap.get("TEL_EST"));

        if (codigo.isEmpty() && rawDoc.isEmpty() && nom1.isEmpty() && ape1.isEmpty()) {
            return null;
        }

        String nombres = (nom1 + " " + nom2).trim();
        if (nombres.isEmpty()) nombres = "SIN NOMBRE";

        String apellidos = (ape1 + " " + ape2).trim();
        if (apellidos.isEmpty()) apellidos = "SIN APELLIDO";

        String nombreCompleto = nombres + " " + apellidos;

        String documento = sanitizarDocumento(rawDoc);
        if (documento.isEmpty() || documento.equals("0") || documento.equalsIgnoreCase("NES")) {
            String docProvisorio = "PENDIENTE_" + (codigo.isEmpty() ? "FILA_" + numeroFila : codigo);
            resumen.getAdvertencias().add(AdvertenciaFilaDTO.builder()
                    .fila(numeroFila)
                    .codigo(codigo.isEmpty() ? "SIN_CODIGO" : codigo)
                    .estudiante(nombreCompleto)
                    .motivo("Documento de identidad no establecido ('0' o vacio en planilla)")
                    .accionTomada("Asignado identificador provisorio: " + docProvisorio)
                    .build());
            documento = docProvisorio;
        }

        String nombreAcudiente = (nom1Acu + " " + nom2Acu + " " + ape1Acu + " " + ape2Acu).replaceAll("\\s+", " ").trim();
        if (nombreAcudiente.isEmpty()) {
            nombreAcudiente = "PENDIENTE POR REGISTRAR";
        }

        String telefonoAcudiente = sanitizarTelefono(telAcu);
        if (telefonoAcudiente.isEmpty()) {
            telefonoAcudiente = sanitizarTelefono(telEst);
        }
        if (telefonoAcudiente.isEmpty()) {
            telefonoAcudiente = "SIN REGISTRO";
        }

        String[] gradoGrupo = descomponerGradoYGrupo(rawGrado);

        FilaParsed f = new FilaParsed();
        f.numeroFila = numeroFila;
        f.codigo = codigo;
        f.documento = documento;
        f.nombres = nombres;
        f.apellidos = apellidos;
        f.nombreCompleto = nombreCompleto;
        f.nombreAcudiente = nombreAcudiente;
        f.telefonoAcudiente = telefonoAcudiente;
        f.grado = gradoGrupo[0];
        f.grupo = gradoGrupo[1];
        f.jornada = resolverJornada(sede);
        return f;
    }

    private void procesarEnLote(List<FilaParsed> filas, int anioLectivo, ImportacionMatriculasResumenDTO resumen) {
        // 1. Precargar cache únicamente de los estudiantes presentes en la planilla Excel
        Set<String> documentosPlanilla = filas.stream()
                .map(f -> f.documento)
                .filter(doc -> doc != null && !doc.isBlank())
                .collect(Collectors.toSet());

        Map<String, Estudiante> estudiantesCache = documentosPlanilla.isEmpty()
                ? new HashMap<>()
                : estudianteRepository.findByDocumentoIn(documentosPlanilla).stream()
                        .collect(Collectors.toMap(Estudiante::getDocumento, e -> e, (a, b) -> a, HashMap::new));

        List<Estudiante> estudiantesAGuardar = new ArrayList<>();
        int creadosEst = 0;
        int actualizadosEst = 0;

        for (FilaParsed f : filas) {
            Estudiante est = estudiantesCache.get(f.documento);
            if (est == null) {
                est = Estudiante.builder()
                        .documento(f.documento)
                        .nombres(f.nombres)
                        .apellidos(f.apellidos)
                        .nombreAcudiente(f.nombreAcudiente)
                        .telefonoAcudiente(f.telefonoAcudiente)
                        .activo(true)
                        .build();
                estudiantesCache.put(f.documento, est);
                estudiantesAGuardar.add(est);
                creadosEst++;
            } else {
                boolean dirty = false;
                if (!Objects.equals(est.getNombres(), f.nombres)) {
                    est.setNombres(f.nombres);
                    dirty = true;
                }
                if (!Objects.equals(est.getApellidos(), f.apellidos)) {
                    est.setApellidos(f.apellidos);
                    dirty = true;
                }
                if (!"PENDIENTE POR REGISTRAR".equals(f.nombreAcudiente) && !Objects.equals(est.getNombreAcudiente(), f.nombreAcudiente)) {
                    est.setNombreAcudiente(f.nombreAcudiente);
                    dirty = true;
                }
                if (!"SIN REGISTRO".equals(f.telefonoAcudiente) && !Objects.equals(est.getTelefonoAcudiente(), f.telefonoAcudiente)) {
                    est.setTelefonoAcudiente(f.telefonoAcudiente);
                    dirty = true;
                }
                if (dirty) {
                    estudiantesAGuardar.add(est);
                    actualizadosEst++;
                }
            }
        }

        // Guardado en lote de estudiantes
        List<Estudiante> persistidos = estudianteRepository.saveAll(estudiantesAGuardar);
        for (Estudiante e : persistidos) {
            estudiantesCache.put(e.getDocumento(), e);
        }
        resumen.setEstudiantesCreados(creadosEst);
        resumen.setEstudiantesActualizados(actualizadosEst);

        // 2. Precargar matriculas del anio en O(1)
        Map<Integer, MatriculaEstudiante> matriculasCache = matriculaEstudianteRepository
                .findByAnioLectivoConEstudiante(anioLectivo).stream()
                .collect(Collectors.toMap(m -> m.getEstudiante().getId(), m -> m, (a, b) -> a, HashMap::new));

        List<MatriculaEstudiante> matriculasAGuardar = new ArrayList<>();
        int creadasMat = 0;
        int actualizadasMat = 0;

        for (FilaParsed f : filas) {
            Estudiante est = estudiantesCache.get(f.documento);
            if (est == null || est.getId() == null) continue;

            MatriculaEstudiante mat = matriculasCache.get(est.getId());
            if (mat == null) {
                mat = MatriculaEstudiante.builder()
                        .estudiante(est)
                        .anioLectivo(anioLectivo)
                        .grado(f.grado)
                        .grupo(f.grupo)
                        .jornada(f.jornada)
                        .estadoMatricula(EstadoMatricula.ACTIVO)
                        .build();
                matriculasCache.put(est.getId(), mat);
                matriculasAGuardar.add(mat);
                creadasMat++;
            } else {
                boolean cambio = !mat.getGrado().equals(f.grado) || !mat.getGrupo().equals(f.grupo);
                if (cambio) {
                    String anterior = mat.getGrado() + "-" + mat.getGrupo();
                    mat.setGrado(f.grado);
                    mat.setGrupo(f.grupo);
                    mat.setJornada(f.jornada);
                    matriculasAGuardar.add(mat);
                    actualizadasMat++;

                    resumen.getAdvertencias().add(AdvertenciaFilaDTO.builder()
                            .fila(f.numeroFila)
                            .codigo(f.codigo)
                            .estudiante(f.nombreCompleto)
                            .motivo("Estudiante con doble matricula en el anio " + anioLectivo + " (anterior: " + anterior + ")")
                            .accionTomada("Actualizado a grado " + f.grado + ", grupo " + f.grupo)
                            .build());
                }
            }
        }

        // Guardado en lote de matriculas
        matriculaEstudianteRepository.saveAll(matriculasAGuardar);
        resumen.setMatriculasCreadas(creadasMat);
        resumen.setMatriculasActualizadas(actualizadasMat);
    }

    private Sheet buscarHojaDatos(Workbook workbook) {
        for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
            Sheet s = workbook.getSheetAt(i);
            if (s.getSheetName().equalsIgnoreCase("DATOS")) {
                return s;
            }
        }
        return workbook.getNumberOfSheets() > 0 ? workbook.getSheetAt(0) : null;
    }

    private int resolverAnioLectivo(Sheet sheet, Integer anioLectivoParam) {
        if (anioLectivoParam != null && anioLectivoParam > 2000) {
            return anioLectivoParam;
        }

        for (int r = 0; r < Math.min(3, sheet.getLastRowNum() + 1); r++) {
            Row row = sheet.getRow(r);
            if (row != null) {
                for (Cell cell : row) {
                    String texto = getCellString(cell);
                    Matcher matcher = ANIO_PATTERN.matcher(texto);
                    if (matcher.find()) {
                        try {
                            return Integer.parseInt(matcher.group(1));
                        } catch (NumberFormatException ignored) {}
                    }
                }
            }
        }
        return LocalDate.now().getYear();
    }

    private int buscarFilaCabecera(Sheet sheet) {
        for (int r = 0; r <= Math.min(10, sheet.getLastRowNum()); r++) {
            Row row = sheet.getRow(r);
            if (row != null) {
                boolean hasGrado = false;
                boolean hasDocOrCodigo = false;
                for (Cell cell : row) {
                    String val = getCellString(cell).toUpperCase();
                    if (val.contains("GRADO")) hasGrado = true;
                    if (val.contains("CODIGO") || val.contains("IDENTIFICACION") || val.contains("DOCUMENTO")) {
                        hasDocOrCodigo = true;
                    }
                }
                if (hasGrado && hasDocOrCodigo) {
                    return r;
                }
            }
        }
        return -1;
    }

    private Map<String, Integer> mapearColumnas(Row headerRow) {
        Map<String, Integer> map = new HashMap<>();
        for (Cell cell : headerRow) {
            String colName = getCellString(cell).toUpperCase().trim();
            int idx = cell.getColumnIndex();

            if (colName.equals("GRADO")) map.put("GRADO", idx);
            else if (colName.equals("SEDE") || colName.equals("JORNADA")) map.put("SEDE", idx);
            else if (colName.equals("CODIGO")) map.put("CODIGO", idx);
            else if (colName.startsWith("APELLIDO 1") || colName.equals("PRIMER APELLIDO")) map.put("APELLIDO 1", idx);
            else if (colName.startsWith("APELLIDO 2") || colName.equals("SEGUNDO APELLIDO")) map.put("APELLIDO 2", idx);
            else if (colName.startsWith("NOMBRE 1") || colName.equals("PRIMER NOMBRE")) map.put("NOMBRE 1", idx);
            else if (colName.startsWith("NOMBRE 2") || colName.equals("SEGUNDO NOMBRE")) map.put("NOMBRE 2", idx);
            else if (colName.contains("IDENTIFICACION EST") || colName.equals("DOCUMENTO")) map.put("DOCUMENTO", idx);
            else if (colName.equals("NOM1_ACU")) map.put("NOM1_ACU", idx);
            else if (colName.equals("NOM2_ACU")) map.put("NOM2_ACU", idx);
            else if (colName.equals("APE1_ACU")) map.put("APE1_ACU", idx);
            else if (colName.equals("APE2_ACU")) map.put("APE2_ACU", idx);
            else if (colName.equals("TELEFONO")) {
                if (!map.containsKey("TEL_EST")) {
                    map.put("TEL_EST", idx);
                } else {
                    map.put("TEL_ACU", idx);
                }
            }
        }
        return map;
    }

    private String[] descomponerGradoYGrupo(String rawGrado) {
        if (rawGrado == null || rawGrado.trim().isEmpty()) {
            return new String[]{"0", "0"};
        }
        String clean = rawGrado.trim();

        String g;
        String grp;

        if (clean.length() == 4 && clean.matches("\\d{4}")) {
            g = clean.substring(0, 2);
            grp = clean.substring(2, 4);
        } else if (clean.contains("-")) {
            String[] parts = clean.split("-");
            g = parts[0].trim();
            grp = parts.length > 1 ? parts[1].trim() : "1";
        } else if (clean.length() == 3 && clean.matches("\\d{3}")) {
            g = clean.substring(0, 1);
            grp = clean.substring(1);
        } else {
            g = clean;
            grp = "1";
        }

        return new String[]{GradoEscolarUtil.normalizarGrado(g), GradoEscolarUtil.normalizarGrupo(grp)};
    }

    private String resolverJornada(String sede) {
        if (sede == null) return "MANANA";
        String s = sede.toUpperCase();
        if (s.contains("SECUNDARIA DIURNA") || s.contains("DIURNA")) return "DIURNA";
        if (s.contains("TARDE")) return "TARDE";
        if (s.contains("NOCTURNA")) return "NOCTURNA";
        return "MANANA";
    }

    private String sanitizarDocumento(String raw) {
        if (raw == null) return "";
        String s = raw.trim();
        if (s.endsWith(".0")) {
            s = s.substring(0, s.length() - 2);
        }
        return s.replaceAll("[^a-zA-Z0-9_-]", "").trim();
    }

    private String sanitizarTelefono(String raw) {
        if (raw == null) return "";
        String s = raw.trim();
        if (s.endsWith(".0")) {
            s = s.substring(0, s.length() - 2);
        }
        return s.replaceAll("[^0-9+ -]", "").trim();
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

    public byte[] generarPlantillaEjemplo() {
        try (org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook();
             java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Matriculas");

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            String[] headers = {
                "GRADO", "SEDE", "CODIGO", "DOCUMENTO",
                "PRIMER APELLIDO", "SEGUNDO APELLIDO",
                "PRIMER NOMBRE", "SEGUNDO NOMBRE",
                "NOM1_ACU", "APE1_ACU", "TELEFONO"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            String[][] sampleData = {
                {"6", "PRINCIPAL", "2026001", "1098765432", "GOMEZ", "PEREZ", "CARLOS", "ANDRES", "MARIA", "GOMEZ", "3001234567"},
                {"7", "PRINCIPAL", "2026002", "1098765433", "RODRIGUEZ", "LOPEZ", "VALENTINA", "", "JUAN", "RODRIGUEZ", "3119876543"},
                {"8", "PRINCIPAL", "2026003", "1098765434", "MARTINEZ", "SILVA", "SEBASTIAN", "FELIPE", "ANA", "MARTINEZ", "3205554321"}
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
            log.error("Error al generar plantilla Excel de matriculas", e);
            throw new RuntimeException("Error al generar plantilla de ejemplo", e);
        }
    }
}