package com.disciplina.common.util;

/**
 * Utilidad transversal para la normalización y ordenamiento de grados y grupos escolares.
 * Estandariza la representación canónica (ej: '6' en lugar de '06', '1' en lugar de '0801' o '01')
 * para garantizar consistencia entre importaciones SIMAT, persistencia en base de datos,
 * consultas analíticas y reportes oficiales.
 */
public final class GradoEscolarUtil {

    private GradoEscolarUtil() {
    }

    /**
     * Normaliza un grado escolar a formato canónico sin ceros a la izquierda.
     * Ejemplo: "08" -> "8", "06" -> "6", "10" -> "10", "11" -> "11".
     * Si es nulo o vacío retorna "SIN_GRADO".
     */
    public static String normalizarGrado(String grado) {
        if (grado == null || grado.isBlank()) {
            return "SIN_GRADO";
        }
        String clean = grado.trim();
        if (clean.matches("^0+[0-9]+$")) {
            return clean.replaceFirst("^0+(?!$)", "");
        }
        return clean;
    }

    /**
     * Normaliza un grupo escolar.
     * Soporta códigos SIMAT de 4 dígitos (ej: "0801" -> "1", "0802" -> "2", "1002" -> "2"),
     * números con ceros iniciales (ej: "01" -> "1") y cadenas simples (ej: "1" -> "1", "A" -> "A").
     * Si es nulo o vacío retorna "1".
     */
    public static String normalizarGrupo(String grupo) {
        if (grupo == null || grupo.isBlank()) {
            return "1";
        }
        String clean = grupo.trim();
        if (clean.length() == 4 && clean.matches("^[0-9]{4}$")) {
            return clean.substring(2).replaceFirst("^0+(?!$)", "");
        }
        if (clean.matches("^0+[0-9]+$")) {
            return clean.replaceFirst("^0+(?!$)", "");
        }
        return clean;
    }

    /**
     * Extrae el valor ordinal para ordenamiento natural de grados escolares.
     * Permite que el Grado 6° aparezca antes del Grado 10°, evitando ordenamiento alfabético ASCII.
     */
    public static int parseGradoOrdinal(String grado) {
        if (grado == null || grado.isBlank() || "SIN_GRADO".equalsIgnoreCase(grado) || "Sin Grado".equalsIgnoreCase(grado)) {
            return 999;
        }
        try {
            return Integer.parseInt(grado.trim().replaceFirst("^0+(?!$)", ""));
        } catch (NumberFormatException e) {
            return 998;
        }
    }
}
