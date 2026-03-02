package com.sportapp.config;

import com.sportapp.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SuperAdminInitializer implements CommandLineRunner {

    private final UserService userService;

    @Value("${app.superadmin.email:}")
    private String superAdminEmail;

    public SuperAdminInitializer(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        if (superAdminEmail != null && !superAdminEmail.isBlank()) {
            userService.assignSuperAdminIfConfigured(superAdminEmail);
        }
    }
}
