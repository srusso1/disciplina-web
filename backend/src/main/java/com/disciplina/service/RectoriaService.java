package com.disciplina.service;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.enums.EstadoProceso;
import com.disciplina.domain.repository.IncidenteEstudianteRepository;
import com.disciplina.common.util.GradoEscolarUtil;
import com.disciplina.domain.repository.IncidenteRepository;
import com.disciplina.dto.rectoria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RectoriaService {

    private final IncidenteRepository incidenteRepository;
    private final IncidenteEstudianteRepository incidenteEstudianteRepository;

    private static final String[] MESES_ES = {
        "", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    };

    public MetricasDashboardRectoriaDTO obtenerMetricasDashboard() {
        long totalIncidentes = incidenteRepository.count();

        // Tipología Ley 1620
        long tipoI = incidenteEstudianteRepository.countDistinctIncidentesByClasificacionLey(ClasificacionLey.TIPO_I);
        long tipoII = incidenteEstudianteRepository.countDistinctIncidentesByClasificacionLey(ClasificacionLey.TIPO_II);
        long tipoIII = incidenteEstudianteRepository.countDistinctIncidentesByClasificacionLey(ClasificacionLey.TIPO_III);

        // Estudiantes involucrados y reincidentes
        long totalInvolucrados = incidenteEstudianteRepository.contarTotalEstudiantesInvolucrados();
        List<Integer> reincidentesIds = incidenteEstudianteRepository.obtenerIdsEstudiantesReincidentes();
        long totalReincidentes = reincidentesIds != null ? reincidentesIds.size() : 0;

        // Estados del debido proceso
        Map<EstadoProceso, Long> estadosMap = new EnumMap<>(EstadoProceso.class);
        for (EstadoProceso ep : EstadoProceso.values()) {
            estadosMap.put(ep, 0L);
        }

        List<Object[]> conteoEstadosRaw = incidenteRepository.contarIncidentesPorEstado();
        for (Object[] row : conteoEstadosRaw) {
            EstadoProceso ep = (EstadoProceso) row[0];
            Long cnt = (Long) row[1];
            if (ep != null) {
                estadosMap.put(ep, cnt);
            }
        }

        long cerrados = estadosMap.getOrDefault(EstadoProceso.CERRADO, 0L);
        long enTramite = Math.max(0, totalIncidentes - cerrados);
        double tasaResolucion = totalIncidentes > 0
                ? Math.round((cerrados * 100.0 / totalIncidentes) * 10.0) / 10.0
                : 0.0;

        List<EstadoMetricaDTO> distribucionEstados = new ArrayList<>();
        for (EstadoProceso ep : EstadoProceso.values()) {
            long cant = estadosMap.getOrDefault(ep, 0L);
            double pct = totalIncidentes > 0
                    ? Math.round((cant * 100.0 / totalIncidentes) * 10.0) / 10.0
                    : 0.0;
            distribucionEstados.add(EstadoMetricaDTO.builder()
                    .estado(ep.name())
                    .etiqueta(obtenerEtiquetaEstado(ep))
                    .cantidad(cant)
                    .porcentaje(pct)
                    .build());
        }

        // Focos críticos / Lugares frecuentes (Top 6)
        List<Object[]> lugaresRaw = incidenteRepository.contarIncidentesPorLugar();
        List<LugarMetricaDTO> focosCriticos = new ArrayList<>();
        int limiteLugares = Math.min(6, lugaresRaw.size());
        for (int i = 0; i < limiteLugares; i++) {
            Object[] row = lugaresRaw.get(i);
            Integer lugarId = (Integer) row[0];
            String nombreLugar = (String) row[1];
            Long cant = (Long) row[2];
            double pct = totalIncidentes > 0
                    ? Math.round((cant * 100.0 / totalIncidentes) * 10.0) / 10.0
                    : 0.0;
            focosCriticos.add(LugarMetricaDTO.builder()
                    .lugarId(lugarId)
                    .nombreLugar(nombreLugar)
                    .cantidad(cant)
                    .porcentaje(pct)
                    .build());
        }

        // Distribución por Grado Escolar (unificada canónicamente y con orden natural numérico)
        List<Object[]> gradosRaw = incidenteEstudianteRepository.contarIncidentesPorGrado();
        Map<String, Long> acumuladorGrados = new LinkedHashMap<>();
        for (Object[] row : gradosRaw) {
            String grado = (String) row[0];
            Long cant = (Long) row[1];
            String gradoNorm = GradoEscolarUtil.normalizarGrado(grado);
            acumuladorGrados.put(gradoNorm, acumuladorGrados.getOrDefault(gradoNorm, 0L) + (cant != null ? cant : 0L));
        }

        List<String> gradosOrdenados = new ArrayList<>(acumuladorGrados.keySet());
        gradosOrdenados.sort(Comparator.comparingInt(GradoEscolarUtil::parseGradoOrdinal).thenComparing(String::compareTo));

        List<GradoMetricaDTO> distribucionGrado = new ArrayList<>();
        for (String g : gradosOrdenados) {
            Long cant = acumuladorGrados.get(g);
            double pct = totalIncidentes > 0
                    ? Math.round((cant * 100.0 / totalIncidentes) * 10.0) / 10.0
                    : 0.0;
            distribucionGrado.add(GradoMetricaDTO.builder()
                    .grado(g)
                    .cantidad(cant)
                    .porcentaje(pct)
                    .build());
        }

        // Análisis temporal y Franjas Horarias
        List<Object[]> fechasHoras = incidenteRepository.obtenerFechasYHorasIncidentes();
        Map<String, Long> franjasMap = new LinkedHashMap<>();
        franjasMap.put("06:00 - 08:00 (Ingreso)", 0L);
        franjasMap.put("08:00 - 10:00 (Clases Mañana)", 0L);
        franjasMap.put("10:00 - 11:30 (Descanso / Recreo)", 0L);
        franjasMap.put("11:30 - 13:30 (Salida / Almuerzo)", 0L);
        franjasMap.put("13:30 - 15:30 (Jornada Tarde)", 0L);
        franjasMap.put("15:30 - 18:00 (Cierre / Salida)", 0L);

        Map<YearMonth, Long> mesesMap = new TreeMap<>();

        for (Object[] fh : fechasHoras) {
            LocalDate fecha = (LocalDate) fh[0];
            LocalTime hora = (LocalTime) fh[1];

            if (fecha != null) {
                YearMonth ym = YearMonth.from(fecha);
                mesesMap.put(ym, mesesMap.getOrDefault(ym, 0L) + 1);
            }

            if (hora != null) {
                int totalMin = hora.getHour() * 60 + hora.getMinute();
                if (totalMin >= 360 && totalMin < 480) { // 06:00 - 07:59
                    franjasMap.compute("06:00 - 08:00 (Ingreso)", (k, v) -> v == null ? 1L : v + 1);
                } else if (totalMin >= 480 && totalMin < 600) { // 08:00 - 09:59
                    franjasMap.compute("08:00 - 10:00 (Clases Mañana)", (k, v) -> v == null ? 1L : v + 1);
                } else if (totalMin >= 600 && totalMin < 690) { // 10:00 - 11:29
                    franjasMap.compute("10:00 - 11:30 (Descanso / Recreo)", (k, v) -> v == null ? 1L : v + 1);
                } else if (totalMin >= 690 && totalMin < 810) { // 11:30 - 13:29
                    franjasMap.compute("11:30 - 13:30 (Salida / Almuerzo)", (k, v) -> v == null ? 1L : v + 1);
                } else if (totalMin >= 810 && totalMin < 930) { // 13:30 - 15:29
                    franjasMap.compute("13:30 - 15:30 (Jornada Tarde)", (k, v) -> v == null ? 1L : v + 1);
                } else {
                    franjasMap.compute("15:30 - 18:00 (Cierre / Salida)", (k, v) -> v == null ? 1L : v + 1);
                }
            }
        }

        List<FranjaHorariaDTO> franjasHorarias = new ArrayList<>();
        for (Map.Entry<String, Long> entry : franjasMap.entrySet()) {
            double pct = totalIncidentes > 0
                    ? Math.round((entry.getValue() * 100.0 / totalIncidentes) * 10.0) / 10.0
                    : 0.0;
            franjasHorarias.add(FranjaHorariaDTO.builder()
                    .franja(entry.getKey())
                    .cantidad(entry.getValue())
                    .porcentaje(pct)
                    .build());
        }

        List<TendenciaMensualDTO> tendenciaMensual = new ArrayList<>();
        if (mesesMap.isEmpty()) {
            // Generar mes actual si no hay registros aun
            YearMonth actual = YearMonth.now();
            tendenciaMensual.add(TendenciaMensualDTO.builder()
                    .mes(MESES_ES[actual.getMonthValue()] + " " + actual.getYear())
                    .mesNumero(actual.getMonthValue())
                    .anio(actual.getYear())
                    .cantidad(0L)
                    .build());
        } else {
            for (Map.Entry<YearMonth, Long> entry : mesesMap.entrySet()) {
                YearMonth ym = entry.getKey();
                int m = ym.getMonthValue();
                tendenciaMensual.add(TendenciaMensualDTO.builder()
                        .mes(MESES_ES[m] + " " + ym.getYear())
                        .mesNumero(m)
                        .anio(ym.getYear())
                        .cantidad(entry.getValue())
                        .build());
            }
        }

        return MetricasDashboardRectoriaDTO.builder()
                .totalIncidentes(totalIncidentes)
                .tipoI(tipoI)
                .tipoII(tipoII)
                .tipoIII(tipoIII)
                .totalEstudiantesInvolucrados(totalInvolucrados)
                .totalEstudiantesReincidentes(totalReincidentes)
                .tasaResolucion(tasaResolucion)
                .casosCerrados(cerrados)
                .casosEnTramite(enTramite)
                .distribucionEstados(distribucionEstados)
                .focosCriticosLugares(focosCriticos)
                .distribucionPorGrado(distribucionGrado)
                .franjasHorariasCriticas(franjasHorarias)
                .tendenciaMensual(tendenciaMensual)
                .build();
    }

    private String obtenerEtiquetaEstado(EstadoProceso estado) {
        return switch (estado) {
            case REPORTADO -> "1. Reportado";
            case EN_INDAGACION -> "2. En Indagación";
            case CITACION_PADRES -> "3. Citación Acudientes";
            case EN_INTERVENCION -> "4. En Intervención";
            case CERRADO -> "5. Proceso Cerrado";
        };
    }
}
