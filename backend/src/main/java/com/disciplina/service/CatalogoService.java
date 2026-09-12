package com.disciplina.service;

import com.disciplina.domain.enums.ClasificacionLey;
import com.disciplina.domain.repository.CatalogoFaltaRepository;
import com.disciplina.domain.repository.DocenteRepository;
import com.disciplina.domain.repository.LugarRepository;
import com.disciplina.dto.catalogo.CatalogoFaltaResponseDTO;
import com.disciplina.dto.catalogo.DocenteResponseDTO;
import com.disciplina.dto.catalogo.LugarResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CatalogoService {

    private final DocenteRepository docenteRepository;
    private final LugarRepository lugarRepository;
    private final CatalogoFaltaRepository catalogoFaltaRepository;

    public List<DocenteResponseDTO> listarDocentesActivos() {
        return docenteRepository.findByActivoTrueOrderByApellidosAscNombresAsc().stream()
                .map(d -> DocenteResponseDTO.builder()
                        .id(d.getId())
                        .documento(d.getDocumento())
                        .nombres(d.getNombres())
                        .apellidos(d.getApellidos())
                        .nombreCompleto(d.getNombreCompleto())
                        .areaDesempenoId(d.getAreaDesempeno() != null ? d.getAreaDesempeno().getId() : null)
                        .areaDesempeno(d.getAreaDesempenoNombre())
                        .activo(d.getActivo())
                        .build())
                .collect(Collectors.toList());
    }

    public List<LugarResponseDTO> listarLugaresActivos() {
        return lugarRepository.findByActivoTrueOrderByNombreAsc().stream()
                .map(l -> LugarResponseDTO.builder()
                        .id(l.getId())
                        .nombre(l.getNombre())
                        .descripcion(l.getDescripcion())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CatalogoFaltaResponseDTO> listarFaltasActivas(ClasificacionLey tipo) {
        var faltas = (tipo != null)
                ? catalogoFaltaRepository.findByActivoTrueAndClasificacionLey(tipo)
                : catalogoFaltaRepository.findByActivoTrueOrderByClasificacionLeyAscCodigoAsc();

        return faltas.stream()
                .map(f -> CatalogoFaltaResponseDTO.builder()
                        .id(f.getId())
                        .codigo(f.getCodigo())
                        .clasificacionLey(f.getClasificacionLey())
                        .gravedadInstitucional(f.getGravedadInstitucional())
                        .descripcion(f.getDescripcion())
                        .procedimientoSugerido(f.getProcedimientoSugerido())
                        .build())
                .collect(Collectors.toList());
    }
}
