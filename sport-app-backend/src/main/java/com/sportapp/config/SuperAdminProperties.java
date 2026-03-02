package com.sportapp.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.superadmin")
public record SuperAdminProperties(String email, String password) {
}
