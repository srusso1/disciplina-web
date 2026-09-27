package com.disciplina.domain.repository;

import com.disciplina.domain.model.Notificacion;
import com.disciplina.domain.enums.TipoNotificacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    long countByUsuarioIdAndLeidaFalse(Integer usuarioId);

    Page<Notificacion> findByUsuarioIdOrderByCreatedAtDesc(Integer usuarioId, Pageable pageable);

    @Query("""
        SELECT n FROM Notificacion n WHERE n.usuario.id = :usuarioId
          AND (:filtrarTipo = false OR n.tipo = :tipo)
          AND (:filtrarLeida = false OR n.leida = :leida)
          AND (:filtrarDesde = false OR n.createdAt >= :desde)
          AND (:filtrarHasta = false OR n.createdAt < :hasta)
        """)
    Page<Notificacion> buscarHistorial(@Param("usuarioId") Integer usuarioId,
            @Param("tipo") TipoNotificacion tipo, @Param("filtrarTipo") boolean filtrarTipo,
            @Param("leida") Boolean leida, @Param("filtrarLeida") boolean filtrarLeida,
            @Param("desde") java.time.Instant desde, @Param("filtrarDesde") boolean filtrarDesde,
            @Param("hasta") java.time.Instant hasta, @Param("filtrarHasta") boolean filtrarHasta,
            Pageable pageable);

    boolean existsByUsuarioIdAndEventoClave(Integer usuarioId, String eventoClave);
    java.util.Optional<Notificacion> findByUsuarioIdAndEventoClave(Integer usuarioId, String eventoClave);

    @Modifying
    @Query("UPDATE Notificacion n SET n.leida = true, n.fechaLectura = CURRENT_TIMESTAMP WHERE n.usuario.id = :usuarioId AND n.leida = false")
    void marcarTodasComoLeidas(@Param("usuarioId") Integer usuarioId);

}
