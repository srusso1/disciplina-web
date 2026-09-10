package com.disciplina.service;

import com.disciplina.domain.model.CatalogoFalta;
import com.disciplina.domain.model.Docente;
import com.disciplina.domain.model.Lugar;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.CatalogoFaltaRepository;
import com.disciplina.domain.repository.DocenteRepository;
import com.disciplina.domain.repository.LugarRepository;
import com.disciplina.domain.repository.UsuarioRepository;
import com.disciplina.dto.catalogo.CatalogoFaltaResponseDTO;
import com.disciplina.dto.catalogo.DocenteResponseDTO;
import com.disciplina.dto.catalogo.LugarResponseDTO;
import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.disciplina.dto.configuracion.CatalogoFaltaRequestDTO;
import com.disciplina.dto.configuracion.DocenteRequestDTO;
import com.disciplina.dto.configuracion.LugarRequestDTO;
import com.disciplina.dto.configuracion.UsuarioAdminResponseDTO;
import com.disciplina.dto.configuracion.UsuarioRequestDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ConfiguracionService {

    private final CatalogoFaltaRepository catalogoFaltaRepository;
    private final DocenteRepository docenteRepository;
    private final LugarRepository lugarRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // -------------------------------------------------------------------------
    // CatalogoFaltas
    // -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public PaginaRespuestaDTO<CatalogoFaltaResponseDTO> listarCatalogoFaltas(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.ASC, "clasificacionLey", "codigo"));
        Page<CatalogoFaltaResponseDTO> result = catalogoFaltaRepository.findAll(pageable)
                .map(this::toCatalogoFaltaResponse);
        return PaginaRespuestaDTO.de(result);
    }

    @Transactional
    public CatalogoFaltaResponseDTO crearCatalogoFalta(CatalogoFaltaRequestDTO req) {
        CatalogoFalta falta = CatalogoFalta.builder()
                .codigo(req.getCodigo().trim().toUpperCase())
                .clasificacionLey(req.getClasificacionLey())
                .gravedadInstitucional(req.getGravedadInstitucional())
                .descripcion(req.getDescripcion())
                .procedimientoSugerido(req.getProcedimientoSugerido())
                .activo(req.getActivo() != null ? req.getActivo() : true)
                .build();
        return toCatalogoFaltaResponse(catalogoFaltaRepository.save(falta));
    }

    @Transactional
    public CatalogoFaltaResponseDTO actualizarCatalogoFalta(Integer id, CatalogoFaltaRequestDTO req) {
        CatalogoFalta falta = catalogoFaltaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("CatalogoFalta no encontrada con id: " + id));
        falta.setCodigo(req.getCodigo().trim().toUpperCase());
        falta.setClasificacionLey(req.getClasificacionLey());
        falta.setGravedadInstitucional(req.getGravedadInstitucional());
        falta.setDescripcion(req.getDescripcion());
        falta.setProcedimientoSugerido(req.getProcedimientoSugerido());
        if (req.getActivo() != null) {
            falta.setActivo(req.getActivo());
        }
        return toCatalogoFaltaResponse(catalogoFaltaRepository.save(falta));
    }

    @Transactional
    public CatalogoFaltaResponseDTO toggleActivoCatalogoFalta(Integer id) {
        CatalogoFalta falta = catalogoFaltaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("CatalogoFalta no encontrada con id: " + id));
        falta.setActivo(!Boolean.TRUE.equals(falta.getActivo()));
        return toCatalogoFaltaResponse(catalogoFaltaRepository.save(falta));
    }

    private CatalogoFaltaResponseDTO toCatalogoFaltaResponse(CatalogoFalta f) {
        return CatalogoFaltaResponseDTO.builder()
                .id(f.getId())
                .codigo(f.getCodigo())
                .clasificacionLey(f.getClasificacionLey())
                .gravedadInstitucional(f.getGravedadInstitucional())
                .descripcion(f.getDescripcion())
                .procedimientoSugerido(f.getProcedimientoSugerido())
                .activo(f.getActivo())
                .build();
    }

    // -------------------------------------------------------------------------
    // Docentes
    // -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public PaginaRespuestaDTO<DocenteResponseDTO> listarDocentes(String q, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.ASC, "apellidos", "nombres"));
        Page<DocenteResponseDTO> result;
        if (StringUtils.hasText(q)) {
            result = docenteRepository
                    .findByNombresContainingIgnoreCaseOrApellidosContainingIgnoreCaseOrDocumentoContainingIgnoreCase(
                            q, q, q, pageable)
                    .map(this::toDocenteResponse);
        } else {
            result = docenteRepository.findAll(pageable).map(this::toDocenteResponse);
        }
        return PaginaRespuestaDTO.de(result);
    }

    @Transactional
    public DocenteResponseDTO crearDocente(DocenteRequestDTO req) {
        Docente docente = Docente.builder()
                .documento(req.getDocumento().trim())
                .nombres(req.getNombres().trim())
                .apellidos(req.getApellidos().trim())
                .areaDesempeno(req.getAreaDesempeno())
                .activo(req.getActivo() != null ? req.getActivo() : true)
                .build();
        return toDocenteResponse(docenteRepository.save(docente));
    }

    @Transactional
    public DocenteResponseDTO actualizarDocente(Integer id, DocenteRequestDTO req) {
        Docente docente = docenteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Docente no encontrado con id: " + id));
        docente.setDocumento(req.getDocumento().trim());
        docente.setNombres(req.getNombres().trim());
        docente.setApellidos(req.getApellidos().trim());
        docente.setAreaDesempeno(req.getAreaDesempeno());
        if (req.getActivo() != null) {
            docente.setActivo(req.getActivo());
        }
        return toDocenteResponse(docenteRepository.save(docente));
    }

    @Transactional
    public DocenteResponseDTO toggleActivoDocente(Integer id) {
        Docente docente = docenteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Docente no encontrado con id: " + id));
        docente.setActivo(!Boolean.TRUE.equals(docente.getActivo()));
        return toDocenteResponse(docenteRepository.save(docente));
    }

    private DocenteResponseDTO toDocenteResponse(Docente d) {
        return DocenteResponseDTO.builder()
                .id(d.getId())
                .documento(d.getDocumento())
                .nombres(d.getNombres())
                .apellidos(d.getApellidos())
                .nombreCompleto(d.getNombreCompleto())
                .areaDesempeno(d.getAreaDesempeno())
                .activo(d.getActivo())
                .build();
    }

    // -------------------------------------------------------------------------
    // Lugares
    // -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public PaginaRespuestaDTO<LugarResponseDTO> listarLugares(String q, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.ASC, "nombre"));
        Page<LugarResponseDTO> result;
        if (StringUtils.hasText(q)) {
            result = lugarRepository.findByNombreContainingIgnoreCase(q, pageable)
                    .map(this::toLugarResponse);
        } else {
            result = lugarRepository.findAll(pageable).map(this::toLugarResponse);
        }
        return PaginaRespuestaDTO.de(result);
    }

    @Transactional
    public LugarResponseDTO crearLugar(LugarRequestDTO req) {
        Lugar lugar = Lugar.builder()
                .nombre(req.getNombre().trim())
                .descripcion(req.getDescripcion())
                .activo(req.getActivo() != null ? req.getActivo() : true)
                .build();
        return toLugarResponse(lugarRepository.save(lugar));
    }

    @Transactional
    public LugarResponseDTO actualizarLugar(Integer id, LugarRequestDTO req) {
        Lugar lugar = lugarRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lugar no encontrado con id: " + id));
        lugar.setNombre(req.getNombre().trim());
        lugar.setDescripcion(req.getDescripcion());
        if (req.getActivo() != null) {
            lugar.setActivo(req.getActivo());
        }
        return toLugarResponse(lugarRepository.save(lugar));
    }

    @Transactional
    public LugarResponseDTO toggleActivoLugar(Integer id) {
        Lugar lugar = lugarRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lugar no encontrado con id: " + id));
        lugar.setActivo(!Boolean.TRUE.equals(lugar.getActivo()));
        return toLugarResponse(lugarRepository.save(lugar));
    }

    private LugarResponseDTO toLugarResponse(Lugar l) {
        return LugarResponseDTO.builder()
                .id(l.getId())
                .nombre(l.getNombre())
                .descripcion(l.getDescripcion())
                .activo(l.getActivo())
                .build();
    }

    // -------------------------------------------------------------------------
    // Usuarios
    // -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public PaginaRespuestaDTO<UsuarioAdminResponseDTO> listarUsuarios(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.ASC, "apellidos", "nombres"));
        Page<UsuarioAdminResponseDTO> result = usuarioRepository.findAll(pageable)
                .map(this::toUsuarioAdminResponse);
        return PaginaRespuestaDTO.de(result);
    }

    @Transactional
    public UsuarioAdminResponseDTO crearUsuario(UsuarioRequestDTO req) {
        // La contraseña es obligatoria al crear
        if (!StringUtils.hasText(req.getPassword())) {
            throw new IllegalArgumentException("La contrase\u00f1a es obligatoria al crear un usuario.");
        }
        Usuario usuario = Usuario.builder()
                .username(req.getUsername().trim())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .nombres(req.getNombres().trim())
                .apellidos(req.getApellidos().trim())
                .email(req.getEmail().trim().toLowerCase())
                .rol(req.getRol())
                .activo(req.getActivo() != null ? req.getActivo() : true)
                .build();
        return toUsuarioAdminResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioAdminResponseDTO actualizarUsuario(Integer id, UsuarioRequestDTO req) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));
        usuario.setUsername(req.getUsername().trim());
        // Si viene contrase\u00f1a no vac\u00eda se re-hashea; de lo contrario se conserva la existente
        if (StringUtils.hasText(req.getPassword())) {
            usuario.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        }
        usuario.setNombres(req.getNombres().trim());
        usuario.setApellidos(req.getApellidos().trim());
        usuario.setEmail(req.getEmail().trim().toLowerCase());
        usuario.setRol(req.getRol());
        if (req.getActivo() != null) {
            usuario.setActivo(req.getActivo());
        }
        return toUsuarioAdminResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioAdminResponseDTO toggleActivoUsuario(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));

        // Impedir que el rector activo se desactive a s\u00ed mismo
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (usuario.getUsername().equals(currentUsername) && Boolean.TRUE.equals(usuario.getActivo())) {
            throw new IllegalStateException("No puede desactivar su propia cuenta activa.");
        }

        usuario.setActivo(!Boolean.TRUE.equals(usuario.getActivo()));
        return toUsuarioAdminResponse(usuarioRepository.save(usuario));
    }

    private UsuarioAdminResponseDTO toUsuarioAdminResponse(Usuario u) {
        return UsuarioAdminResponseDTO.builder()
                .id(u.getId())
                .username(u.getUsername())
                .nombres(u.getNombres())
                .apellidos(u.getApellidos())
                .email(u.getEmail())
                .rol(u.getRol() != null ? u.getRol().name() : null)
                .activo(u.getActivo())
                .createdAt(u.getCreatedAt())
                .updatedAt(u.getUpdatedAt())
                .build();
    }
}
