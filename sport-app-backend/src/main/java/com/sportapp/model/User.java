package com.sportapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Пустой конструктор (обязателен для JPA)
    public User() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Конструктор со всеми полями
    public User(String email, String password, String name) {
        this();
        this.email = email;
        this.password = password;
        this.name = name;
    }
    
    // Геттеры (методы для получения значений)
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getName() { return name; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    // Сеттеры (методы для установки значений)
    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setName(String name) { this.name = name; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}