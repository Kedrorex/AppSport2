package com.sportapp.service;

import com.sportapp.dto.UserDTO;
import com.sportapp.model.Role;
import com.sportapp.model.User;
import com.sportapp.repository.UserRepository;
import com.sportapp.security.UserDetailsImpl;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Пользователь с email " + email + " не найден"));

        return new UserDetailsImpl(user);
    }

    @Transactional
    public User registerUser(String name, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Пользователь с таким email уже существует");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
    }

    @Transactional
    public User updateRole(Long targetUserId, Role newRole) {
        User currentUser = getCurrentAuthenticatedUser();
        User targetUser = userRepository.findById(targetUserId)
            .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (currentUser.getId().equals(targetUser.getId())) {
            throw new AccessDeniedException("Нельзя изменить собственную роль");
        }

        if (currentUser.getRole() == Role.USER || currentUser.getRole() == Role.TRAINER) {
            throw new AccessDeniedException("Недостаточно прав для изменения ролей");
        }

        if (currentUser.getRole() == Role.ADMIN && (newRole == Role.ADMIN || newRole == Role.SUPERD)) {
            throw new AccessDeniedException("ADMIN не может назначать ADMIN или SUPERD");
        }

        if (targetUser.getRole() == Role.SUPERD && currentUser.getRole() != Role.SUPERD) {
            throw new AccessDeniedException("Только SUPERD может изменять роль SUPERD");
        }

        if (targetUser.getRole() == Role.SUPERD && newRole != Role.SUPERD) {
            long superdCount = userRepository.countByRole(Role.SUPERD);
            if (superdCount == 1) {
                throw new AccessDeniedException("Нельзя понизить последнего SUPERD в системе");
            }
        }

        targetUser.setRole(newRole);
        return userRepository.save(targetUser);
    }

    @Transactional
    public void assignSuperAdminIfConfigured(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            if (user.getRole() != Role.SUPERD) {
                user.setRole(Role.SUPERD);
                userRepository.save(user);
            }
        });
    }

    private User getCurrentAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return findByEmail(email);
    }

    public UserDTO toUserDTO(User user) {
        return new UserDTO(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole(),
            user.getCreatedAt()
        );
    }
}
