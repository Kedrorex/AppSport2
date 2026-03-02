package com.sportapp.config;

import com.sportapp.model.Role;
import com.sportapp.model.User;
import com.sportapp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("dev")
public class SuperAdminInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SuperAdminInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SuperAdminProperties superAdminProperties;

    public SuperAdminInitializer(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        SuperAdminProperties superAdminProperties
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.superAdminProperties = superAdminProperties;
    }

    @Override
    @Transactional
    public void run(String... args) {
        String email = superAdminProperties.email();
        String rawPassword = superAdminProperties.password();

        if (email == null || email.isBlank() || rawPassword == null || rawPassword.isBlank()) {
            log.warn("Superadmin auto-creation skipped: email/password is not configured.");
            return;
        }

        if (userRepository.existsByEmail(email)) {
            log.info("Superadmin auto-creation skipped: user with email '{}' already exists.", email);
            return;
        }

        User superAdmin = new User();
        superAdmin.setEmail(email);
        superAdmin.setPassword(passwordEncoder.encode(rawPassword));
        superAdmin.setName(email);
        superAdmin.setRole(Role.SUPERD);

        userRepository.save(superAdmin);
        log.info("Superadmin user '{}' was created successfully.", email);
    }
}
