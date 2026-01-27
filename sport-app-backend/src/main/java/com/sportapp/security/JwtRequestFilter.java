package com.sportapp.security;

import com.sportapp.util.JwtUtil;
import com.sportapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    // Не внедряем UserService напрямую, а получаем его из контекста когда нужно
    // Это поможет избежать циклической зависимости

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain chain) throws ServletException, IOException {

        final String requestTokenHeader = request.getHeader("Authorization");
        final String requestURI = request.getRequestURI();

        String username = null;
        String jwtToken = null;

        // JWT токен имеет формат "Bearer token"
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwtToken);
                System.out.println("JWT фильтр: извлечен username из токена: " + username + " для URI: " + requestURI);
            } catch (Exception e) {
                System.out.println("JWT фильтр: не удалось получить username из токена для URI: " + requestURI + ", ошибка: " + e.getMessage());
                // Продолжаем выполнение, чтобы позволить другим фильтрам обработать запрос
            }
        } else {
            System.out.println("JWT фильтр: заголовок Authorization отсутствует или имеет неправильный формат для URI: " + requestURI);
        }

        // Если токен валиден и пользователь еще не аутентифицирован
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // Получаем UserService из контекста Spring, когда он действительно нужен
                UserService userService = SpringContext.getBean(UserService.class);
                UserDetails userDetails = userService.loadUserByUsername(username);

                System.out.println("JWT фильтр: найден пользователь " + username + ", проверяем токен");

                // Если токен валиден, конфигурируем Spring Security чтобы выполнить аутентификацию
                if (jwtUtil.validateToken(jwtToken, userDetails)) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // После этого аутентификация проходит успешно
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                    System.out.println("JWT фильтр: аутентификация успешна для пользователя " + username);
                } else {
                    System.out.println("JWT фильтр: токен недействителен для пользователя " + username);
                }
            } catch (UsernameNotFoundException e) {
                System.out.println("JWT фильтр: пользователь " + username + " не найден в базе данных: " + e.getMessage());
                // Не выбрасываем исключение, просто логируем и продолжаем
                // Spring Security сам обработает отсутствие аутентификации
            } catch (Exception e) {
                System.out.println("JWT фильтр: ошибка при аутентификации пользователя " + username + ": " + e.getMessage());
                // Не выбрасываем исключение, чтобы не блокировать работу приложения
            }
        }

        chain.doFilter(request, response);
    }
}