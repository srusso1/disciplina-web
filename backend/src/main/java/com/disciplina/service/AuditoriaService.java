package com.disciplina.service;

import com.disciplina.domain.model.AuditoriaSistema;
import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.AuditoriaSistemaRepository;
import com.disciplina.domain.repository.UsuarioRepository;
import com.disciplina.dto.auditoria.AuditoriaResponseDTO;
import com.disciplina.dto.common.PaginaRespuestaDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditoriaService {

    private final AuditoriaSistemaRepository auditoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ObjectMapper objectMapper;

    /**
     * Criterio 3 BDD & Sección 18: Registra un evento forense inmutable en auditoria_sistema.
     */
    @Transactional
    public void registrarAuditoria(
            String accion,
            String entidad,
            Object entidadId,
            Object datosAnteriores,
            Object datosNuevos,
            String usernameOpt) {

        try {
            Usuario usuario = obtenerUsuario(usernameOpt);
            String ip = obtenerIpCliente();
            String jsonAnterior = toJson(datosAnteriores);
            String jsonNuevo = toJson(datosNuevos);

            String accionNormalizada = accion != null ? accion.toUpperCase().trim() : "DESCONOCIDO";
            if (accionNormalizada.length() > 50) {
                accionNormalizada = accionNormalizada.substring(0, 50);
            }

            String entidadNormalizada = entidad != null ? entidad.trim() : "General";
            if (entidadNormalizada.length() > 50) {
                entidadNormalizada = entidadNormalizada.substring(0, 50);
            }

            String idNormalizado = entidadId != null ? String.valueOf(entidadId).trim() : "0";
            if (idNormalizado.length() > 50) {
                idNormalizado = idNormalizado.substring(0, 50);
            }

            String ipNormalizada = ip != null ? ip.trim() : "127.0.0.1";
            if (ipNormalizada.length() > 45) {
                ipNormalizada = ipNormalizada.substring(0, 45);
            }

            AuditoriaSistema auditoria = AuditoriaSistema.builder()
                    .usuario(usuario)
                    .accion(accionNormalizada)
                    .entidad(entidadNormalizada)
                    .entidadId(idNormalizado)
                    .datosAnteriores(jsonAnterior)
                    .datosNuevos(jsonNuevo)
                    .ipOrigen(ipNormalizada)
                    .build();

            auditoriaRepository.save(auditoria);
            log.debug("Auditoria registrada: {} en {} (ID: {})", accionNormalizada, entidadNormalizada, idNormalizado);
        } catch (Exception e) {
            log.error("Fallo al registrar traza forense de auditoria: {}", e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public PaginaRespuestaDTO<AuditoriaResponseDTO> listarAuditoriasPaginadas(
            String entidad,
            String accion,
            Instant fechaDesde,
            Instant fechaHasta,
            String busqueda,
            int page,
            int size) {

        Specification<AuditoriaSistema> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("usuario", JoinType.LEFT);
            }

            if (entidad != null && !entidad.isBlank()) {
                predicates.add(cb.equal(root.get("entidad"), entidad.trim()));
            }
            if (accion != null && !accion.isBlank()) {
                predicates.add(cb.equal(root.get("accion"), accion.trim()));
            }
            if (fechaDesde != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), fechaDesde));
            }
            if (fechaHasta != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), fechaHasta));
            }
            if (busqueda != null && !busqueda.isBlank()) {
                String pattern = "%" + busqueda.trim().toLowerCase() + "%";
                Join<AuditoriaSistema, Usuario> userJoin = root.join("usuario", JoinType.LEFT);
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("entidadId")), pattern),
                        cb.like(cb.lower(root.get("ipOrigen")), pattern),
                        cb.like(cb.lower(userJoin.get("username")), pattern),
                        cb.like(cb.lower(userJoin.get("nombres")), pattern),
                        cb.like(cb.lower(userJoin.get("apellidos")), pattern)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(100, Math.max(1, size)), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AuditoriaSistema> resultado = auditoriaRepository.findAll(spec, pageable);

        List<AuditoriaResponseDTO> dtos = resultado.getContent().stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());

        return PaginaRespuestaDTO.<AuditoriaResponseDTO>builder()
                .contenido(dtos)
                .pagina(resultado.getNumber())
                .tamanoPagina(resultado.getSize())
                .totalElementos(resultado.getTotalElements())
                .totalPaginas(resultado.getTotalPages())
                .primera(resultado.isFirst())
                .ultima(resultado.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public List<AuditoriaResponseDTO> obtenerHistorialPorEntidad(String entidad, String entidadId) {
        List<AuditoriaSistema> registros = auditoriaRepository.findByEntidadAndEntidadIdOrderByCreatedAtDesc(entidad, entidadId);
        return registros.stream().map(this::mapearADTO).collect(Collectors.toList());
    }

    private AuditoriaResponseDTO mapearADTO(AuditoriaSistema a) {
        return AuditoriaResponseDTO.builder()
                .id(a.getId())
                .usuarioId(a.getUsuario() != null ? a.getUsuario().getId() : null)
                .usuarioUsername(a.getUsuario() != null ? a.getUsuario().getUsername() : "SISTEMA")
                .usuarioNombreCompleto(a.getUsuario() != null ? a.getUsuario().getNombreCompleto() : "Sistema Automatizado")
                .usuarioRol(a.getUsuario() != null && a.getUsuario().getRol() != null ? a.getUsuario().getRol().name() : "SISTEMA")
                .accion(a.getAccion())
                .entidad(a.getEntidad())
                .entidadId(a.getEntidadId())
                .datosAnteriores(a.getDatosAnteriores())
                .datosNuevos(a.getDatosNuevos())
                .ipOrigen(a.getIpOrigen())
                .createdAt(a.getCreatedAt())
                .build();
    }

    private Usuario obtenerUsuario(String usernameOpt) {
        if (usernameOpt != null && !usernameOpt.isBlank()) {
            return usuarioRepository.findByUsernameIgnoreCase(usernameOpt).orElse(null);
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return usuarioRepository.findByUsernameIgnoreCase(auth.getName()).orElse(null);
        }
        return null;
    }

    private String obtenerIpCliente() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isBlank()) {
                    return xForwardedFor.split(",")[0].trim();
                }
                return request.getRemoteAddr();
            }
        } catch (Exception ignored) {
        }
        return "127.0.0.1";
    }

    private String toJson(Object obj) {
        if (obj == null) return null;
        if (obj instanceof String s) return s;

        // Guard against direct JPA entity serialization: entities annotated with @Entity
        // or Hibernate proxies can cause LazyInitializationException or infinite recursion.
        if (isJpaEntity(obj)) {
            log.warn("Attempted to serialize a JPA entity directly in audit log ({}). Using safe fallback.",
                    obj.getClass().getSimpleName());
            return buildEntityFallback(obj);
        }

        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            log.warn("No fue posible serializar objeto para auditoria ({}): {}", obj.getClass().getSimpleName(), e.getMessage());
            return buildEntityFallback(obj);
        }
    }

    /**
     * Checks whether the given object is a JPA-managed entity or a Hibernate proxy.
     * This prevents accidental serialization of lazy collections or bidirectional relations.
     */
    private boolean isJpaEntity(Object obj) {
        if (obj == null) return false;
        Class<?> clazz = obj.getClass();
        // Check for @Entity annotation on the class or its superclass (Hibernate proxies use CGLIB subclasses)
        while (clazz != null && clazz != Object.class) {
            if (clazz.isAnnotationPresent(jakarta.persistence.Entity.class)) {
                return true;
            }
            clazz = clazz.getSuperclass();
        }
        // Detect Hibernate CGLIB/ByteBuddy proxies by class name convention
        String className = obj.getClass().getName();
        return className.contains("$HibernateProxy") || className.contains("$$_javassist") || className.contains("$$EnhancerBy");
    }

    /**
     * Produces a safe minimal JSON fallback when full serialization of an object is not possible.
     * Attempts to extract a numeric id field via reflection, otherwise records the class name only.
     */
    private String buildEntityFallback(Object obj) {
        try {
            try {
                java.lang.reflect.Method getId = obj.getClass().getMethod("getId");
                Object idValue = getId.invoke(obj);
                return String.format("{\"entidadId\": \"%s\", \"tipo\": \"%s\", \"nota\": \"Serializacion completa omitida por seguridad\"}",
                        idValue, obj.getClass().getSimpleName());
            } catch (NoSuchMethodException e) {
                return String.format("{\"tipo\": \"%s\", \"error\": \"No se pudo serializar el estado — sin getId()\"}",
                        obj.getClass().getSimpleName());
            }
        } catch (Exception ex) {
            return "{\"error\": \"No se pudo serializar el estado previo\"}";
        }
    }
}
