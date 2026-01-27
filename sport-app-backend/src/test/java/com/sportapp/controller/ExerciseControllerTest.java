package com.sportapp.controller;

import com.sportapp.model.User;
import com.sportapp.repository.ExerciseRepository;
import com.sportapp.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ExerciseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ExerciseRepository exerciseRepository;

    private Authentication authForUserId(long userId) {
        User user = new User("test@example.com", "pw", "Test");
        user.setId(userId);
        UserDetailsImpl principal = new UserDetailsImpl(user);
        return new UsernamePasswordAuthenticationToken(principal, null, Collections.emptyList());
    }

    @Test
    void create_returns400_whenNameBlank() throws Exception {
        mockMvc.perform(
                post("/api/exercises")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {
                          "name": "   ",
                          "description": "d"
                        }
                        """)
                    .with(authentication(authForUserId(1L)))
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    void create_returnsExerciseDto_whenValid() throws Exception {
        mockMvc.perform(
                post("/api/exercises")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {
                          "name": "Squat",
                          "description": "Legs",
                          "muscleGroup": "Legs",
                          "exerciseType": "Strength"
                        }
                        """)
                    .with(authentication(authForUserId(1L)))
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.name").value("Squat"));
    }
}

