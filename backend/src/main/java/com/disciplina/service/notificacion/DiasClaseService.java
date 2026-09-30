package com.disciplina.service.notificacion;

import org.springframework.stereotype.Service;
import java.time.DayOfWeek;
import java.time.LocalDate;

/** Aproximacion de lunes a viernes hasta disponer de un calendario escolar institucional. */
@Service
public class DiasClaseService {
    public LocalDate retrocederDiasClase(LocalDate fecha, int dias) {
        LocalDate resultado = fecha;
        for (int pendientes = dias; pendientes > 0;) {
            resultado = resultado.minusDays(1);
            if (resultado.getDayOfWeek() != DayOfWeek.SATURDAY
                    && resultado.getDayOfWeek() != DayOfWeek.SUNDAY) {
                pendientes--;
            }
        }
        return resultado;
    }
}
