package com.disciplina.dto.matricula;

public record ResumenMatriculasDTO(
        Integer anioLectivo,
        long totalMatriculados,
        long sinAcudiente,
        long sinTelefonoContacto) {
}
