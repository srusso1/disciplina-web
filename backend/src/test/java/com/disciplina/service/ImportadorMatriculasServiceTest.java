package com.disciplina.service;

import com.disciplina.domain.enums.EstadoMatricula;
import com.disciplina.domain.model.Estudiante;
import com.disciplina.domain.model.MatriculaEstudiante;
import com.disciplina.domain.repository.EstudianteRepository;
import com.disciplina.domain.repository.MatriculaEstudianteRepository;
import com.disciplina.dto.matricula.ImportacionMatriculasResumenDTO;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ImportadorMatriculasServiceTest {

    @Mock
    private EstudianteRepository estudianteRepository;

    @Mock
    private MatriculaEstudianteRepository matriculaEstudianteRepository;

    @InjectMocks
    private ImportadorMatriculasService importadorMatriculasService;

    @Test
    @DisplayName("Debe procesar planilla, asignar identificador provisorio a documento 0 y actualizar duplicados")
    void debeProcesarPlanillaConInconsistenciasCorrectamente() throws IOException {
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

            // Fila 3: Estudiante 1 normal (0601 -> grado 6, grupo 1)
            Row r3 = sheet.createRow(3);
            r3.createCell(0).setCellValue("0601");
            r3.createCell(1).setCellValue("JORNADA SECUNDARIA DIURNA");
            r3.createCell(2).setCellValue("tr1001");
            r3.createCell(3).setCellValue("PEREZ");
            r3.createCell(4).setCellValue("GOMEZ");
            r3.createCell(5).setCellValue("JUAN");
            r3.createCell(6).setCellValue("CARLOS");
            r3.createCell(7).setCellValue("TI");
            r3.createCell(8).setCellValue("100200300");
            r3.createCell(16).setCellValue("GOMEZ");
            r3.createCell(18).setCellValue("MARIA");
            r3.createCell(23).setCellValue("3001234567");

            // Fila 4: Estudiante 2 con documento en '0'
            Row r4 = sheet.createRow(4);
            r4.createCell(0).setCellValue("0705");
            r4.createCell(1).setCellValue("JORNADA SECUNDARIA DIURNA");
            r4.createCell(2).setCellValue("tr1002");
            r4.createCell(3).setCellValue("RODRIGUEZ");
            r4.createCell(5).setCellValue("ANA");
            r4.createCell(7).setCellValue("NES");
            r4.createCell(8).setCellValue("0");

            // Fila 5: Estudiante 1 duplicado trasladado a 0603
            Row r5 = sheet.createRow(5);
            r5.createCell(0).setCellValue("0603");
            r5.createCell(1).setCellValue("JORNADA SECUNDARIA DIURNA");
            r5.createCell(2).setCellValue("tr1001");
            r5.createCell(3).setCellValue("PEREZ");
            r5.createCell(4).setCellValue("GOMEZ");
            r5.createCell(5).setCellValue("JUAN");
            r5.createCell(6).setCellValue("CARLOS");
            r5.createCell(7).setCellValue("TI");
            r5.createCell(8).setCellValue("100200300");
            r5.createCell(23).setCellValue("3110009999");

            workbook.write(out);
        }

        // Mocks
        when(estudianteRepository.findAll()).thenReturn(new ArrayList<>());

        when(estudianteRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<Estudiante> list = invocation.getArgument(0);
            int id = 1;
            for (Estudiante e : list) {
                if (e.getId() == null) e.setId(id++);
            }
            return list;
        });

        when(matriculaEstudianteRepository.findByAnioLectivoConEstudiante(eq(2026)))
                .thenReturn(new ArrayList<>());

        when(matriculaEstudianteRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        ImportacionMatriculasResumenDTO resultado = importadorMatriculasService.importarPlanilla(
                new ByteArrayInputStream(out.toByteArray()), null
        );

        // THEN
        assertThat(resultado).isNotNull();
        assertThat(resultado.getAnioLectivo()).isEqualTo(2026);
        assertThat(resultado.getTotalFilasLeidas()).isEqualTo(3);
        assertThat(resultado.getEstudiantesCreados()).isEqualTo(2); // Juan y Ana
        assertThat(resultado.getEstudiantesActualizados()).isEqualTo(1); // Juan segunda vez
        assertThat(resultado.getMatriculasCreadas()).isEqualTo(2);
        assertThat(resultado.getMatriculasActualizadas()).isEqualTo(1); // Grado actualizado a 6-3

        // Validar advertencias
        assertThat(resultado.getAdvertencias()).hasSize(2);
        assertThat(resultado.getAdvertencias().get(0).getMotivo()).contains("Documento de identidad no establecido");
        assertThat(resultado.getAdvertencias().get(0).getAccionTomada()).contains("PENDIENTE_tr1002");

        assertThat(resultado.getAdvertencias().get(1).getMotivo()).contains("Estudiante con doble matricula");
        assertThat(resultado.getAdvertencias().get(1).getAccionTomada()).contains("grado 6, grupo 3");
    }
}