package com.disciplina.service;

import com.disciplina.domain.model.AreaDesempeno;
import com.disciplina.domain.repository.AreaDesempenoRepository;
import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.disciplina.dto.configuracion.AreaDesempenoRequestDTO;
import com.disciplina.dto.configuracion.AreaDesempenoResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AreaDesempenoService {

    private final AreaDesempenoRepository areaDesempenoRepository;

    @Transactional(readOnly = true)
    public List<AreaDesempenoResponseDTO> listarActivas() {
        return areaDesempenoRepository.findByActivoTrueOrderByNombreAsc().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaginaRespuestaDTO<AreaDesempenoResponseDTO> listarPaginado(String q, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "nombre"));
        Page<AreaDesempenoResponseDTO> resultado;
        if (StringUtils.hasText(q)) {
            resultado = areaDesempenoRepository.findByNombreContainingIgnoreCase(q.trim(), pageable)
                    .map(this::toResponseDTO);
        } else {
            resultado = areaDesempenoRepository.findAll(pageable)
                    .map(this::toResponseDTO);
        }
        return PaginaRespuestaDTO.de(resultado);
    }

    @Transactional
    public AreaDesempenoResponseDTO crear(AreaDesempenoRequestDTO req) {
        String nombreLimpio = req.getNombre().trim();
        if (areaDesempenoRepository.existsByNombreIgnoreCase(nombreLimpio)) {
            throw new IllegalArgumentException("Ya existe un área de desempeño con el nombre: " + nombreLimpio);
        }

        AreaDesempeno nueva = AreaDesempeno.builder()
                .nombre(nombreLimpio)
                .descripcion(StringUtils.hasText(req.getDescripcion()) ? req.getDescripcion().trim() : null)
                .activo(req.getActivo() != null ? req.getActivo() : true)
                .build();

        return toResponseDTO(areaDesempenoRepository.save(nueva));
    }

    @Transactional
    public AreaDesempenoResponseDTO actualizar(Integer id, AreaDesempenoRequestDTO req) {
        AreaDesempeno area = areaDesempenoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Área de desempeño no encontrada con ID: " + id));

        String nombreLimpio = req.getNombre().trim();
        if (areaDesempenoRepository.existsByNombreIgnoreCaseAndIdNot(nombreLimpio, id)) {
            throw new IllegalArgumentException("Ya existe otra área de desempeño con el nombre: " + nombreLimpio);
        }

        area.setNombre(nombreLimpio);
        area.setDescripcion(StringUtils.hasText(req.getDescripcion()) ? req.getDescripcion().trim() : null);
        if (req.getActivo() != null) {
            area.setActivo(req.getActivo());
        }

        return toResponseDTO(areaDesempenoRepository.save(area));
    }

    @Transactional
    public void eliminarLogico(Integer id) {
        AreaDesempeno area = areaDesempenoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Área de desempeño no encontrada con ID: " + id));
        area.setActivo(false);
        areaDesempenoRepository.save(area);
    }

    @Transactional
    public AreaDesempenoResponseDTO toggleActivo(Integer id) {
        AreaDesempeno area = areaDesempenoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Área de desempeño no encontrada con ID: " + id));
        area.setActivo(!Boolean.TRUE.equals(area.getActivo()));
        return toResponseDTO(areaDesempenoRepository.save(area));
    }

    public AreaDesempenoResponseDTO toResponseDTO(AreaDesempeno a) {
        if (a == null) return null;
        return AreaDesempenoResponseDTO.builder()
                .id(a.getId())
                .nombre(a.getNombre())
                .descripcion(a.getDescripcion())
                .activo(a.getActivo())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
