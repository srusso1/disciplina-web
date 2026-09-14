package com.disciplina.service;

import com.disciplina.domain.repository.IncidenteEstudianteRepository;
import com.disciplina.domain.repository.IncidenteRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class RectoriaServiceTest {

    @Mock
    private IncidenteRepository incidenteRepository;

    @Mock
    private IncidenteEstudianteRepository incidenteEstudianteRepository;

    @InjectMocks
    private RectoriaService rectoriaService;

    @Test
    @DisplayName("Debe clasificar hora nula como 'Sin hora registrada'")
    void clasificarFranjaHoraria_horaNull_retornaSinHoraRegistrada() {
        String resultado = rectoriaService.clasificarFranjaHoraria(null);
        assertThat(resultado).isEqualTo("Sin hora registrada");
    }

    @ParameterizedTest(name = "Hora {0} debe clasificarse como: {1}")
    @CsvSource({
            "06:00, 06:00 - 07:00 (Ingreso y Formación)",
            "06:30, 06:00 - 07:00 (Ingreso y Formación)",
            "06:59, 06:00 - 07:00 (Ingreso y Formación)",
            "07:00, 07:00 - 09:30 (Clases Mañana - Bloque I)",
            "08:15, 07:00 - 09:30 (Clases Mañana - Bloque I)",
            "09:29, 07:00 - 09:30 (Clases Mañana - Bloque I)",
            "09:30, 09:30 - 10:30 (Descanso / Recreo)",
            "10:00, 09:30 - 10:30 (Descanso / Recreo)",
            "10:29, 09:30 - 10:30 (Descanso / Recreo)",
            "10:30, 10:30 - 12:30 (Clases Mediodía - Bloque II)",
            "11:45, 10:30 - 12:30 (Clases Mediodía - Bloque II)",
            "12:29, 10:30 - 12:30 (Clases Mediodía - Bloque II)",
            "12:30, 12:30 - 13:30 (Almuerzo Escolar - PAE)",
            "13:00, 12:30 - 13:30 (Almuerzo Escolar - PAE)",
            "13:29, 12:30 - 13:30 (Almuerzo Escolar - PAE)",
            "13:30, 13:30 - 14:30 (Cierre y Salida)",
            "14:00, 13:30 - 14:30 (Cierre y Salida)",
            "14:30, 13:30 - 14:30 (Cierre y Salida)",
            "05:59, Extracurricular / Fuera de Jornada",
            "14:31, Extracurricular / Fuera de Jornada",
            "16:00, Extracurricular / Fuera de Jornada",
            "18:00, Extracurricular / Fuera de Jornada",
            "23:59, Extracurricular / Fuera de Jornada"
    })
    @DisplayName("Debe clasificar horas según las franjas oficiales de la jornada escolar Trujillo (06:00 a 14:30)")
    void clasificarFranjaHoraria_horasValidas_retornaFranjaCorrecta(String horaStr, String franjaEsperada) {
        LocalTime hora = LocalTime.parse(horaStr);
        String resultado = rectoriaService.clasificarFranjaHoraria(hora);
        assertThat(resultado).isEqualTo(franjaEsperada);
    }
}
