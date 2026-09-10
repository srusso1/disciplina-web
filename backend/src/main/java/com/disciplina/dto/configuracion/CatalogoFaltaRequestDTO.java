package com.disciplina.dto.configuracion;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.enums.GravedadInstitucional;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CatalogoFaltaRequestDTO {

    @NotBlank
    @Size(max = 20)
    private String codigo;

    @NotNull
    private ClasificacionLey clasificacionLey;

    @NotNull
    private GravedadInstitucional gravedadInstitucional;

    @NotBlank
    @Size(max = 2000)
    private String descripcion;

    @Size(max = 2000)
    private String procedimientoSugerido;

    @Builder.Default
    private Boolean activo = true;
}
