package com.disciplina.dto.citacion;
import com.disciplina.dto.catalogo.LugarResponseDTO;
import lombok.*;
import java.time.*;
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class CitacionResponseDTO { private Long id; private Integer incidenteId; private String estudianteNombreCompleto; private Integer estudianteId; private String nombreAcudiente; private String telefonoAcudiente; private LugarResponseDTO lugarCita; private LocalDate fechaCita; private LocalTime horaCita; private String asunto; private String observaciones; private String estado; private String waEstadoEnvio; private String waErrorDetalle; private String waEnviadoAt; private String creadoPor; private Instant createdAt; }
