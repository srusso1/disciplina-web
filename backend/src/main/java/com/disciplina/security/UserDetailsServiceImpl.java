package com.disciplina.security;

import com.disciplina.domain.model.Usuario;
import com.disciplina.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con username: " + username));

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new DisabledException("El usuario se encuentra inactivo en el sistema");
        }

        return new User(
                usuario.getUsername(),
                usuario.getPasswordHash(),
                usuario.getActivo(),
                true,
                true,
                true,
                Collections.singletonList(new SimpleGrantedAuthority(usuario.getRol().name()))
        );
    }
}
