package com.sportapp.controller;

import com.sportapp.model.ScheduledExercise;
import com.sportapp.model.User;
import com.sportapp.repository.ScheduledExerciseRepository;
import com.sportapp.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ScheduledExerciseSummaryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ScheduledExerciseRepository scheduledExerciseRepository;

    private Authentication authForUserId(long userId) {
        User user = new User("test@example.com", "pw", "Test");
        user.setId(userId);
        UserDetailsImpl principal = new UserDetailsImpl(user);
        return new UsernamePasswordAuthenticationToken(principal, null, Collections.emptyList());
    }

    @BeforeEach
    void cleanup() {
        scheduledExerciseRepository.deleteAll();
    }

    @Test
    void summary_returnsCountsGroupedByDate_forAuthenticatedUserOnly() throws Exception {
        // user 1
        scheduledExerciseRepository.save(new ScheduledExercise(1L, LocalDate.parse("2026-01-10"), 100L, "Squat", 3, 10, 100.0));
        scheduledExerciseRepository.save(new ScheduledExercise(1L, LocalDate.parse("2026-01-10"), 101L, "Bench", 3, 10, 60.0));
        scheduledExerciseRepository.save(new ScheduledExercise(1L, LocalDate.parse("2026-01-12"), 102L, "Deadlift", 1, 5, 140.0));

        // user 2 should be ignored
        scheduledExerciseRepository.save(new ScheduledExercise(2L, LocalDate.parse("2026-01-10"), 200L, "Other", 1, 1, null));

        mockMvc.perform(
                get("/api/exercises/scheduled/summary")
                    .param("from", "2026-01-01")
                    .param("to", "2026-01-31")
                    .with(authentication(authForUserId(1L)))
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].date").value("2026-01-10"))
            .andExpect(jsonPath("$[0].count").value(2))
            .andExpect(jsonPath("$[1].date").value("2026-01-12"))
            .andExpect(jsonPath("$[1].count").value(1));
    }

    @Test
    void summary_returns400_whenFromAfterTo() throws Exception {
        mockMvc.perform(
                get("/api/exercises/scheduled/summary")
                    .param("from", "2026-02-01")
                    .param("to", "2026-01-01")
                    .with(authentication(authForUserId(1L)))
            )
            .andExpect(status().isBadRequest());
    }
}

