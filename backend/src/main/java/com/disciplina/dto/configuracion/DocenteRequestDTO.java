package com.disciplina.dto.configuracion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocenteRequestDTO {

    @NotBlank
    @Size(min = 5, max = 25)
    private String documento;

    @NotBlank
    @Size(max = 100)
    private String nombres;

    @NotBlank
    @Size(max = 100)
    private String apellidos;

    private Integer areaDesempenoId;

    @Size(max = 100)
    private String areaDesempeno;

    @Builder.Default
    private Boolean activo = true;
}
