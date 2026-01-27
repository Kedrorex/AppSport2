package com.sportapp.controller;

import com.sportapp.dto.ScheduledExerciseDTO;
import com.sportapp.dto.ScheduledExerciseSummaryDTO;
import com.sportapp.model.ScheduledExercise;
import com.sportapp.security.UserDetailsImpl;
import com.sportapp.service.ScheduledExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exercises/scheduled")
@CrossOrigin(origins = "*")
public class ScheduledExerciseController {

    @Autowired
    private ScheduledExerciseService scheduledExerciseService;

    @GetMapping
    public ResponseEntity<List<ScheduledExerciseDTO>> getScheduledExercises(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getUser().getId();

        List<ScheduledExercise> exercises = scheduledExerciseService.getScheduledExercisesByUserAndDate(userId, date);

        List<ScheduledExerciseDTO> exerciseDTOs = exercises.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(exerciseDTOs);
    }

    @GetMapping("/summary")
    public ResponseEntity<List<ScheduledExerciseSummaryDTO>> getScheduledExercisesSummary(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        Authentication authentication
    ) {
        if (from.isAfter(to)) {
            return ResponseEntity.badRequest().build();
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getUser().getId();

        return ResponseEntity.ok(
            scheduledExerciseService.getScheduledExerciseSummaryByUserAndDateRange(userId, from, to)
        );
    }

    @PostMapping
    public ResponseEntity<ScheduledExerciseDTO> addScheduledExercise(
            @RequestBody AddScheduledExerciseRequest request,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getUser().getId();

        ScheduledExercise scheduledExercise = scheduledExerciseService.createScheduledExercise(
            userId,
            request.getWorkoutDate(),
            request.getExerciseId(),
            request.getSets(),
            request.getReps(),
            request.getWeight()
        );

        return ResponseEntity.ok(toDTO(scheduledExercise));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheduledExercise(
            @PathVariable Long id,
            Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getUser().getId();

        // Проверяем, что упражнение принадлежит пользователю
        ScheduledExercise exercise = scheduledExerciseService.getScheduledExerciseById(id)
            .filter(ex -> ex.getUserId().equals(userId))
            .orElse(null);

        if (exercise == null) {
            return ResponseEntity.notFound().build();
        }

        scheduledExerciseService.deleteScheduledExercise(id);
        return ResponseEntity.ok().build();
    }

    private ScheduledExerciseDTO toDTO(ScheduledExercise exercise) {
        return new ScheduledExerciseDTO(
            exercise.getId(),
            exercise.getUserId(),
            exercise.getWorkoutDate(),
            exercise.getExerciseId(),
            exercise.getExerciseName(),
            exercise.getSets(),
            exercise.getReps(),
            exercise.getWeight(),
            exercise.getCreatedAt()
        );
    }

    // Внутренний класс для запроса на добавление упражнения
    public static class AddScheduledExerciseRequest {
        private LocalDate workoutDate;
        private Long exerciseId;
        private Integer sets;
        private Integer reps;
        private Double weight;

        public LocalDate getWorkoutDate() { return workoutDate; }
        public void setWorkoutDate(LocalDate workoutDate) { this.workoutDate = workoutDate; }

        public Long getExerciseId() { return exerciseId; }
        public void setExerciseId(Long exerciseId) { this.exerciseId = exerciseId; }

        public Integer getSets() { return sets; }
        public void setSets(Integer sets) { this.sets = sets; }

        public Integer getReps() { return reps; }
        public void setReps(Integer reps) { this.reps = reps; }

        public Double getWeight() { return weight; }
        public void setWeight(Double weight) { this.weight = weight; }
    }
}