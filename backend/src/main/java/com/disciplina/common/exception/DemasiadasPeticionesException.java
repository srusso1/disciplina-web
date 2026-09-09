package com.disciplina.common.exception;

import lombok.Getter;

@Getter
public class DemasiadasPeticionesException extends RuntimeException {
    private final long segundosRestantes;

    public DemasiadasPeticionesException(String mensaje, long segundosRestantes) {
        super(mensaje);
        this.segundosRestantes = segundosRestantes;
    }
}
