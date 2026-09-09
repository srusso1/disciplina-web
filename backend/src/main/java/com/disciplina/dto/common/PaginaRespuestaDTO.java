package com.disciplina.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginaRespuestaDTO<T> {
    private List<T> contenido;
    private int pagina;
    private int tamanoPagina;
    private long totalElementos;
    private int totalPaginas;
    private boolean primera;
    private boolean ultima;

    public static <T> PaginaRespuestaDTO<T> de(Page<T> page) {
        return PaginaRespuestaDTO.<T>builder()
                .contenido(page.getContent())
                .pagina(page.getNumber())
                .tamanoPagina(page.getSize())
                .totalElementos(page.getTotalElements())
                .totalPaginas(page.getTotalPages())
                .primera(page.isFirst())
                .ultima(page.isLast())
                .build();
    }
}