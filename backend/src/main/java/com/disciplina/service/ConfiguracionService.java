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
import com.disciplina.domain.model.AreaDesempeno;
import com.disciplina.domain.repository.AreaDesempenoRepository;
import com.disciplina.dto.configuracion.AreaDesempenoResponseDTO;
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

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ConfiguracionService {

    private final CatalogoFaltaRepository catalogoFaltaRepository;
    private final DocenteRepository docenteRepository;
    private final LugarRepository lugarRepository;
    private final UsuarioRepository usuarioRepository;
    private final AreaDesempenoRepository areaDesempenoRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditoriaService auditoriaService;

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
        CatalogoFalta guardada = catalogoFaltaRepository.save(falta);

        auditoriaService.registrarAuditoria(
                "CREAR_FALTA",
                "CatalogoFalta",
                guardada.getId(),
                null,
                Map.of(
                        "codigo", guardada.getCodigo(),
                        "clasificacionLey", guardada.getClasificacionLey() != null ? guardada.getClasificacionLey().name() : "N/A",
                        "gravedad", guardada.getGravedadInstitucional() != null ? guardada.getGravedadInstitucional().name() : "N/A",
                        "activo", guardada.getActivo()
                ),
                null);

        return toCatalogoFaltaResponse(guardada);
    }

    @Transactional
    public CatalogoFaltaResponseDTO actualizarCatalogoFalta(Integer id, CatalogoFaltaRequestDTO req) {
        CatalogoFalta falta = catalogoFaltaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("CatalogoFalta no encontrada con id: " + id));

        Map<String, Object> antes = Map.of(
                "codigo", falta.getCodigo(),
                "clasificacionLey", falta.getClasificacionLey() != null ? falta.getClasificacionLey().name() : "N/A",
                "gravedad", falta.getGravedadInstitucional() != null ? falta.getGravedadInstitucional().name() : "N/A",
                "activo", falta.getActivo() != null ? falta.getActivo() : true
        );

        falta.setCodigo(req.getCodigo().trim().toUpperCase());
        falta.setClasificacionLey(req.getClasificacionLey());
        falta.setGravedadInstitucional(req.getGravedadInstitucional());
        falta.setDescripcion(req.getDescripcion());
        falta.setProcedimientoSugerido(req.getProcedimientoSugerido());
        if (req.getActivo() != null) {
            falta.setActivo(req.getActivo());
        }
        CatalogoFalta guardada = catalogoFaltaRepository.save(falta);

        auditoriaService.registrarAuditoria(
                "ACTUALIZAR_FALTA",
                "CatalogoFalta",
                guardada.getId(),
                antes,
                Map.of(
                        "codigo", guardada.getCodigo(),
                        "clasificacionLey", guardada.getClasificacionLey() != null ? guardada.getClasificacionLey().name() : "N/A",
                        "gravedad", guardada.getGravedadInstitucional() != null ? guardada.getGravedadInstitucional().name() : "N/A",
                        "activo", guardada.getActivo() != null ? guardada.getActivo() : true
                ),
                null);

        return toCatalogoFaltaResponse(guardada);
    }

    @Transactional
    public CatalogoFaltaResponseDTO toggleActivoCatalogoFalta(Integer id) {
        CatalogoFalta falta = catalogoFaltaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("CatalogoFalta no encontrada con id: " + id));
        boolean previo = Boolean.TRUE.equals(falta.getActivo());
        falta.setActivo(!previo);
        CatalogoFalta guardada = catalogoFaltaRepository.save(falta);

        auditoriaService.registrarAuditoria(
                "TOGGLE_ACTIVO_FALTA",
                "CatalogoFalta",
                guardada.getId(),
                Map.of("activo", previo),
                Map.of("activo", guardada.getActivo()),
                null);

        return toCatalogoFaltaResponse(guardada);
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
        AreaDesempeno area = null;
        if (req.getAreaDesempenoId() != null) {
            area = areaDesempenoRepository.findById(req.getAreaDesempenoId()).orElse(null);
        } else if (StringUtils.hasText(req.getAreaDesempeno())) {
            area = areaDesempenoRepository.findByNombreIgnoreCase(req.getAreaDesempeno().trim()).orElse(null);
        }

        Docente docente = Docente.builder()
                .documento(req.getDocumento().trim())
                .nombres(req.getNombres().trim())
                .apellidos(req.getApellidos().trim())
                .areaDesempeno(area)
                .activo(req.getActivo() != null ? req.getActivo() : true)
                .build();
        Docente guardado = docenteRepository.save(docente);

        auditoriaService.registrarAuditoria(
                "CREAR_DOCENTE",
                "Docente",
                guardado.getId(),
                null,
                Map.of(
                        "documento", guardado.getDocumento(),
                        "nombreCompleto", guardado.getNombreCompleto(),
                        "area", area != null ? area.getNombre() : "SIN_AREA",
                        "activo", guardado.getActivo()
                ),
                null);

        return toDocenteResponse(guardado);
    }

    @Transactional
    public DocenteResponseDTO actualizarDocente(Integer id, DocenteRequestDTO req) {
        Docente docente = docenteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Docente no encontrado con id: " + id));

        Map<String, Object> antes = Map.of(
                "documento", docente.getDocumento(),
                "nombres", docente.getNombres(),
                "apellidos", docente.getApellidos(),
                "activo", docente.getActivo() != null ? docente.getActivo() : true
        );

        docente.setDocumento(req.getDocumento().trim());
        docente.setNombres(req.getNombres().trim());
        docente.setApellidos(req.getApellidos().trim());

        if (req.getAreaDesempenoId() != null) {
            AreaDesempeno area = areaDesempenoRepository.findById(req.getAreaDesempenoId()).orElse(null);
            docente.setAreaDesempeno(area);
        } else if (req.getAreaDesempeno() != null) {
            if (StringUtils.hasText(req.getAreaDesempeno())) {
                AreaDesempeno area = areaDesempenoRepository.findByNombreIgnoreCase(req.getAreaDesempeno().trim()).orElse(null);
                docente.setAreaDesempeno(area);
            } else {
                docente.setAreaDesempeno(null);
            }
        }

        if (req.getActivo() != null) {
            docente.setActivo(req.getActivo());
        }
        Docente guardado = docenteRepository.save(docente);

        auditoriaService.registrarAuditoria(
                "ACTUALIZAR_DOCENTE",
                "Docente",
                guardado.getId(),
                antes,
                Map.of(
                        "documento", guardado.getDocumento(),
                        "nombreCompleto", guardado.getNombreCompleto(),
                        "activo", guardado.getActivo() != null ? guardado.getActivo() : true
                ),
                null);

        return toDocenteResponse(guardado);
    }

    @Transactional
    public DocenteResponseDTO toggleActivoDocente(Integer id) {
        Docente docente = docenteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Docente no encontrado con id: " + id));
        boolean previo = Boolean.TRUE.equals(docente.getActivo());
        docente.setActivo(!previo);
        Docente guardado = docenteRepository.save(docente);

        auditoriaService.registrarAuditoria(
                "TOGGLE_ACTIVO_DOCENTE",
                "Docente",
                guardado.getId(),
                Map.of("documento", guardado.getDocumento(), "activo", previo),
                Map.of("documento", guardado.getDocumento(), "activo", guardado.getActivo()),
                null);

        return toDocenteResponse(guardado);
    }

    private DocenteResponseDTO toDocenteResponse(Docente d) {
        AreaDesempeno a = d.getAreaDesempeno();
        AreaDesempenoResponseDTO areaDto = (a != null) ? AreaDesempenoResponseDTO.builder()
                .id(a.getId())
                .nombre(a.getNombre())
                .descripcion(a.getDescripcion())
                .activo(a.getActivo())
                .build() : null;

        return DocenteResponseDTO.builder()
                .id(d.getId())
                .documento(d.getDocumento())
                .nombres(d.getNombres())
                .apellidos(d.getApellidos())
                .nombreCompleto(d.getNombreCompleto())
                .areaDesempenoId(a != null ? a.getId() : null)
                .areaDesempeno(a != null ? a.getNombre() : null)
                .areaDesempenoDetalle(areaDto)
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
        Lugar guardado = lugarRepository.save(lugar);

        auditoriaService.registrarAuditoria(
                "CREAR_LUGAR",
                "Lugar",
                guardado.getId(),
                null,
                Map.of(
                        "nombre", guardado.getNombre(),
                        "descripcion", guardado.getDescripcion() != null ? guardado.getDescripcion() : "",
                        "activo", guardado.getActivo()
                ),
                null);

        return toLugarResponse(guardado);
    }

    @Transactional
    public LugarResponseDTO actualizarLugar(Integer id, LugarRequestDTO req) {
        Lugar lugar = lugarRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lugar no encontrado con id: " + id));

        Map<String, Object> antes = Map.of(
                "nombre", lugar.getNombre(),
                "descripcion", lugar.getDescripcion() != null ? lugar.getDescripcion() : "",
                "activo", lugar.getActivo() != null ? lugar.getActivo() : true
        );

        lugar.setNombre(req.getNombre().trim());
        lugar.setDescripcion(req.getDescripcion());
        if (req.getActivo() != null) {
            lugar.setActivo(req.getActivo());
        }
        Lugar guardado = lugarRepository.save(lugar);

        auditoriaService.registrarAuditoria(
                "ACTUALIZAR_LUGAR",
                "Lugar",
                guardado.getId(),
                antes,
                Map.of(
                        "nombre", guardado.getNombre(),
                        "descripcion", guardado.getDescripcion() != null ? guardado.getDescripcion() : "",
                        "activo", guardado.getActivo() != null ? guardado.getActivo() : true
                ),
                null);

        return toLugarResponse(guardado);
    }

    @Transactional
    public LugarResponseDTO toggleActivoLugar(Integer id) {
        Lugar lugar = lugarRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lugar no encontrado con id: " + id));
        boolean previo = Boolean.TRUE.equals(lugar.getActivo());
        lugar.setActivo(!previo);
        Lugar guardado = lugarRepository.save(lugar);

        auditoriaService.registrarAuditoria(
                "TOGGLE_ACTIVO_LUGAR",
                "Lugar",
                guardado.getId(),
                Map.of("nombre", guardado.getNombre(), "activo", previo),
                Map.of("nombre", guardado.getNombre(), "activo", guardado.getActivo()),
                null);

        return toLugarResponse(guardado);
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
            throw new IllegalArgumentException("La contraseña es obligatoria al crear un usuario.");
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
        Usuario guardado = usuarioRepository.save(usuario);

        auditoriaService.registrarAuditoria(
                "CREAR_USUARIO",
                "Usuario",
                guardado.getId(),
                null,
                Map.of(
                        "username", guardado.getUsername(),
                        "nombres", guardado.getNombres(),
                        "apellidos", guardado.getApellidos(),
                        "email", guardado.getEmail(),
                        "rol", guardado.getRol() != null ? guardado.getRol().name() : "N/A",
                        "activo", guardado.getActivo()
                ),
                null);

        return toUsuarioAdminResponse(guardado);
    }

    @Transactional
    public UsuarioAdminResponseDTO actualizarUsuario(Integer id, UsuarioRequestDTO req) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));

        // Salvaguarda: Impedir que el usuario autenticado se auto-desactive o se auto-degrade de rol
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (usuario.getUsername().equalsIgnoreCase(currentUsername)) {
            if (req.getActivo() != null && !req.getActivo()) {
                throw new IllegalStateException("No puede desactivar su propia cuenta activa.");
            }
            if (req.getRol() != null && req.getRol() != usuario.getRol()) {
                throw new IllegalStateException("No puede modificar su propio rol institucional.");
            }
        }

        Map<String, Object> antes = Map.of(
                "username", usuario.getUsername(),
                "nombres", usuario.getNombres(),
                "apellidos", usuario.getApellidos(),
                "email", usuario.getEmail(),
                "rol", usuario.getRol() != null ? usuario.getRol().name() : "N/A",
                "activo", usuario.getActivo() != null ? usuario.getActivo() : true
        );

        usuario.setUsername(req.getUsername().trim());
        boolean passwordCambiada = false;
        if (StringUtils.hasText(req.getPassword())) {
            usuario.setPasswordHash(passwordEncoder.encode(req.getPassword()));
            passwordCambiada = true;
        }
        usuario.setNombres(req.getNombres().trim());
        usuario.setApellidos(req.getApellidos().trim());
        usuario.setEmail(req.getEmail().trim().toLowerCase());
        usuario.setRol(req.getRol());
        if (req.getActivo() != null) {
            usuario.setActivo(req.getActivo());
        }
        Usuario guardado = usuarioRepository.save(usuario);

        auditoriaService.registrarAuditoria(
                "ACTUALIZAR_USUARIO",
                "Usuario",
                guardado.getId(),
                antes,
                Map.of(
                        "username", guardado.getUsername(),
                        "nombres", guardado.getNombres(),
                        "apellidos", guardado.getApellidos(),
                        "email", guardado.getEmail(),
                        "rol", guardado.getRol() != null ? guardado.getRol().name() : "N/A",
                        "activo", guardado.getActivo() != null ? guardado.getActivo() : true,
                        "passwordActualizada", passwordCambiada
                ),
                null);

        return toUsuarioAdminResponse(guardado);
    }

    @Transactional
    public UsuarioAdminResponseDTO toggleActivoUsuario(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));

        // Impedir que el rector activo se desactive a sí mismo
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (usuario.getUsername().equalsIgnoreCase(currentUsername) && Boolean.TRUE.equals(usuario.getActivo())) {
            throw new IllegalStateException("No puede desactivar su propia cuenta activa.");
        }

        boolean previo = Boolean.TRUE.equals(usuario.getActivo());
        usuario.setActivo(!previo);
        Usuario guardado = usuarioRepository.save(usuario);

        auditoriaService.registrarAuditoria(
                "TOGGLE_ACTIVO_USUARIO",
                "Usuario",
                guardado.getId(),
                Map.of("username", guardado.getUsername(), "activo", previo),
                Map.of("username", guardado.getUsername(), "activo", guardado.getActivo()),
                null);

        return toUsuarioAdminResponse(guardado);
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
