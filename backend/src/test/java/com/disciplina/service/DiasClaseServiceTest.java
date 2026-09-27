package com.disciplina.service;

import com.disciplina.service.notificacion.DiasClaseService;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import static org.assertj.core.api.Assertions.assertThat;

class DiasClaseServiceTest {
    private final DiasClaseService service = new DiasClaseService();

    @Test
    void retrocedeDosDiasSinContarFinDeSemana() {
        assertThat(service.retrocederDiasClase(LocalDate.of(2026, 9, 29), 2))
                .isEqualTo(LocalDate.of(2026, 9, 25));
    }

    @Test
    void retrocedeCincoDiasSinContarFinDeSemana() {
        assertThat(service.retrocederDiasClase(LocalDate.of(2026, 9, 28), 5))
                .isEqualTo(LocalDate.of(2026, 9, 21));
    }
}
