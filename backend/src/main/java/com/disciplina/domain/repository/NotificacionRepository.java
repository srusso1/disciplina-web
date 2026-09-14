package com.disciplina.domain.repository;

import com.disciplina.domain.model.Notificacion;
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

    @Modifying
    @Query("UPDATE Notificacion n SET n.leida = true, n.fechaLectura = CURRENT_TIMESTAMP WHERE n.usuario.id = :usuarioId AND n.leida = false")
    void marcarTodasComoLeidas(@Param("usuarioId") Integer usuarioId);

    @Query("""
        SELECT count(n) > 0 FROM Notificacion n
        WHERE n.usuario.id = :usuarioId
          AND n.tipo = :tipo
          AND n.leida = false
          AND LOWER(n.mensaje) LIKE LOWER(CONCAT('%', :identificadorRecurso, '%'))
        """)
    boolean existeNotificacionNoLeidaActiva(
            @Param("usuarioId") Integer usuarioId,
            @Param("tipo") com.disciplina.domain.enums.TipoNotificacion tipo,
            @Param("identificadorRecurso") String identificadorRecurso);

    @Query("""
        SELECT count(n) > 0 FROM Notificacion n
        WHERE n.tipo = :tipo
          AND n.leida = false
          AND n.mensaje LIKE CONCAT('%', :identificadorRecurso, '%')
        """)
    boolean existeNotificacionPendienteGlobal(
            @Param("tipo") com.disciplina.domain.enums.TipoNotificacion tipo,
            @Param("identificadorRecurso") String identificadorRecurso);
}
