package com.disciplina.common.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class GradoEscolarUtilTest {

    @Test
    @DisplayName("Debe remover ceros iniciales de grados numéricos")
    void testNormalizarGradoNumerico() {
        assertEquals("6", GradoEscolarUtil.normalizarGrado("06"));
        assertEquals("7", GradoEscolarUtil.normalizarGrado("07"));
        assertEquals("8", GradoEscolarUtil.normalizarGrado("08"));
        assertEquals("9", GradoEscolarUtil.normalizarGrado("09"));
        assertEquals("10", GradoEscolarUtil.normalizarGrado("10"));
        assertEquals("11", GradoEscolarUtil.normalizarGrado("11"));
        assertEquals("8", GradoEscolarUtil.normalizarGrado("8"));
    }

    @Test
    @DisplayName("Debe retornar SIN_GRADO cuando el valor es nulo o vacío")
    void testNormalizarGradoNuloOVacio() {
        assertEquals("SIN_GRADO", GradoEscolarUtil.normalizarGrado(null));
        assertEquals("SIN_GRADO", GradoEscolarUtil.normalizarGrado(""));
        assertEquals("SIN_GRADO", GradoEscolarUtil.normalizarGrado("   "));
    }

    @Test
    @DisplayName("Debe extraer y normalizar grupo desde código SIMAT de 4 dígitos")
    void testNormalizarGrupoSimat4Digitos() {
        assertEquals("1", GradoEscolarUtil.normalizarGrupo("0801"));
        assertEquals("2", GradoEscolarUtil.normalizarGrupo("0802"));
        assertEquals("1", GradoEscolarUtil.normalizarGrupo("0601"));
        assertEquals("3", GradoEscolarUtil.normalizarGrupo("1003"));
    }

    @Test
    @DisplayName("Debe remover ceros iniciales de grupos numéricos simples")
    void testNormalizarGrupoSimple() {
        assertEquals("1", GradoEscolarUtil.normalizarGrupo("01"));
        assertEquals("2", GradoEscolarUtil.normalizarGrupo("02"));
        assertEquals("1", GradoEscolarUtil.normalizarGrupo("1"));
        assertEquals("2", GradoEscolarUtil.normalizarGrupo("2"));
    }

    @Test
    @DisplayName("Debe retornar '1' por defecto si el grupo es nulo o vacío")
    void testNormalizarGrupoVacio() {
        assertEquals("1", GradoEscolarUtil.normalizarGrupo(null));
        assertEquals("1", GradoEscolarUtil.normalizarGrupo(""));
        assertEquals("1", GradoEscolarUtil.normalizarGrupo("   "));
    }

    @Test
    @DisplayName("Debe permitir ordenamiento natural numérico (6 antes de 10)")
    void testOrdenamientoNaturalGrados() {
        List<String> grados = Arrays.asList("10", "6", "08", "11", "7", "09");
        grados.sort(Comparator.comparingInt(GradoEscolarUtil::parseGradoOrdinal));

        assertEquals(List.of("6", "7", "08", "09", "10", "11"), grados);

        // Si todos están previamente normalizados
        List<String> gradosNorm = Arrays.asList("10", "6", "8", "11", "7", "9");
        gradosNorm.sort(Comparator.comparingInt(GradoEscolarUtil::parseGradoOrdinal));
        assertEquals(List.of("6", "7", "8", "9", "10", "11"), gradosNorm);
    }
}
