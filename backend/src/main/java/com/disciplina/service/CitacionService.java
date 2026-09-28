package com.disciplina.service;
import com.disciplina.common.exception.*;
import com.disciplina.domain.enums.EstadoProceso;
import com.disciplina.domain.model.*;
import com.disciplina.domain.repository.*;
import com.disciplina.dto.catalogo.LugarResponseDTO;
import com.disciplina.dto.citacion.*;
import com.disciplina.dto.incidente.ActualizarEstadoIncidenteDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;

@Service @RequiredArgsConstructor @Transactional
public class CitacionService {
 private final CitacionRepository repo; private final IncidenteRepository incidenteRepo; private final EstudianteRepository estudianteRepo; private final LugarRepository lugarRepo; private final UsuarioRepository usuarioRepo; private final IncidenteEstudianteRepository relacionRepo; private final WhatsAppService whatsapp; private final IncidenteService incidenteService;
 public CitacionResponseDTO crearCitacion(CrearCitacionDTO dto,String username){ Incidente i=incidenteRepo.findById(dto.getIncidenteId()).orElseThrow(()->new RecursoNoEncontradoException("Incidente no encontrado con ID: "+dto.getIncidenteId())); if(i.getEstadoProceso()==EstadoProceso.CERRADO) throw new OperacionInvalidaException("No es posible crear una citación para un incidente cerrado."); Estudiante e=estudianteRepo.findById(dto.getEstudianteId()).orElseThrow(()->new RecursoNoEncontradoException("Estudiante no encontrado con ID: "+dto.getEstudianteId())); if(relacionRepo.findByIncidenteIdAndEstudianteId(i.getId(),e.getId()).isEmpty()) throw new OperacionInvalidaException("El estudiante no participa en el incidente indicado."); if(e.getTelefonoAcudiente()==null||e.getTelefonoAcudiente().isBlank()) throw new OperacionInvalidaException("El acudiente del estudiante no tiene teléfono registrado. Registre el número antes de generar una citación por WhatsApp."); Lugar l=lugarRepo.findById(dto.getLugarCitaId()).orElseThrow(()->new RecursoNoEncontradoException("Lugar no encontrado con ID: "+dto.getLugarCitaId())); Usuario u=usuarioRepo.findByUsernameIgnoreCase(username).orElseThrow(()->new RecursoNoEncontradoException("Usuario autenticado no encontrado: "+username)); Citacion c=repo.save(Citacion.builder().incidente(i).estudiante(e).lugarCita(l).creadoPor(u).fechaCita(dto.getFechaCita()).horaCita(dto.getHoraCita()).asunto(dto.getAsunto().trim()).observaciones(dto.getObservaciones()).build()); WhatsAppEnvioResultado r=whatsapp.enviarCitacion(c); c.setWaEstadoEnvio(r.exitoso()?"ENVIADO":"FALLIDO"); c.setWaMessageId(r.messageId()); c.setWaErrorDetalle(r.errorDetalle()); c.setWaEnviadoAt(r.exitoso()?Instant.now():null); if(r.exitoso()){ c.setEstado("ENVIADA"); if(i.getEstadoProceso().ordinal()<EstadoProceso.CITACION_PADRES.ordinal()) incidenteService.actualizarEstado(i.getId(),new ActualizarEstadoIncidenteDTO(EstadoProceso.CITACION_PADRES,null),username); } return toDto(repo.save(c)); }
 @Transactional(readOnly=true) public List<CitacionResponseDTO> listarPorIncidente(Integer id){return repo.findByIncidenteIdOrderByCreatedAtDesc(id).stream().map(this::toDto).toList();}
 public void procesarWebhookEstado(String id,String estado){repo.findByWaMessageId(id).ifPresent(c->{c.setWaEstadoEnvio(Map.of("delivered","ENTREGADO","read","LEIDO","failed","FALLIDO").getOrDefault(estado,c.getWaEstadoEnvio()));repo.save(c);});}
 private CitacionResponseDTO toDto(Citacion c){return CitacionResponseDTO.builder().id(c.getId()).incidenteId(c.getIncidente().getId()).estudianteId(c.getEstudiante().getId()).estudianteNombreCompleto(c.getEstudiante().getNombreCompleto()).nombreAcudiente(c.getEstudiante().getNombreAcudiente()).telefonoAcudiente(c.getEstudiante().getTelefonoAcudiente()).lugarCita(LugarResponseDTO.builder().id(c.getLugarCita().getId()).nombre(c.getLugarCita().getNombre()).descripcion(c.getLugarCita().getDescripcion()).activo(c.getLugarCita().getActivo()).build()).fechaCita(c.getFechaCita()).horaCita(c.getHoraCita()).asunto(c.getAsunto()).observaciones(c.getObservaciones()).estado(c.getEstado()).waEstadoEnvio(c.getWaEstadoEnvio()).waErrorDetalle(c.getWaErrorDetalle()).waEnviadoAt(c.getWaEnviadoAt()==null?null:c.getWaEnviadoAt().toString()).creadoPor(c.getCreadoPor().getNombreCompleto()).createdAt(c.getCreatedAt()).build();}
}
