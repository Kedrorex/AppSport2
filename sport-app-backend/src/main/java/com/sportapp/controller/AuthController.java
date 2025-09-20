package com.sportapp.controller;

import com.sportapp.dto.AuthResponseDTO;
import com.sportapp.dto.LoginRequestDTO;
import com.sportapp.dto.RegisterRequestDTO;
import com.sportapp.dto.UserDTO;
import com.sportapp.mapper.UserMapper;
import com.sportapp.model.User;
import com.sportapp.service.UserService;
import com.sportapp.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        try {
            User user = userService.registerUser(
                registerRequest.getName(),
                registerRequest.getEmail(),
                registerRequest.getPassword()
            );

            // Генерируем JWT токен для нового пользователя
            UserDetails userDetails = userService.loadUserByUsername(user.getEmail());
            String token = jwtUtil.generateToken(userDetails);

            UserDTO userDTO = userMapper.toDTO(user);
            AuthResponseDTO response = new AuthResponseDTO(token, userDTO);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            // Аутентифицируем пользователя
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body("Неверный email или пароль");
        }

        // Получаем пользователя и генерируем токен
        UserDetails userDetails = userService.loadUserByUsername(loginRequest.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        User user = userService.findByEmail(loginRequest.getEmail());
        UserDTO userDTO = userMapper.toDTO(user);
        AuthResponseDTO response = new AuthResponseDTO(token, userDTO);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Пользователь не аутентифицирован");
        }

        String email = authentication.getName();
        User user = userService.findByEmail(email);
        UserDTO userDTO = userMapper.toDTO(user);

        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // В JWT нет серверного логаута, просто возвращаем успех
        return ResponseEntity.ok("Вы успешно вышли из системы");
    }
}