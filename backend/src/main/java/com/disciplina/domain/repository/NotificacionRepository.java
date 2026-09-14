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
}
