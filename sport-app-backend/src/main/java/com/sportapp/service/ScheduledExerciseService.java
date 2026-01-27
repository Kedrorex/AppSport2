package com.sportapp.service;

import com.sportapp.dto.ScheduledExerciseSummaryDTO;
import com.sportapp.model.Exercise;
import com.sportapp.model.ScheduledExercise;
import com.sportapp.repository.ExerciseRepository;
import com.sportapp.repository.ScheduledExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ScheduledExerciseService {

    @Autowired
    private ScheduledExerciseRepository scheduledExerciseRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    public List<ScheduledExercise> getScheduledExercisesByUserAndDate(Long userId, LocalDate workoutDate) {
        return scheduledExerciseRepository.findByUserIdAndWorkoutDateOrderByCreatedAtAsc(userId, workoutDate);
    }

    public List<ScheduledExercise> getScheduledExercisesByUserAndDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return scheduledExerciseRepository.findByUserIdAndWorkoutDateBetweenOrderByWorkoutDateAscCreatedAtAsc(
            userId, startDate, endDate);
    }

    public List<ScheduledExerciseSummaryDTO> getScheduledExerciseSummaryByUserAndDateRange(
        Long userId,
        LocalDate from,
        LocalDate to
    ) {
        return scheduledExerciseRepository.getDayCountsByUserIdAndDateRange(userId, from, to).stream()
            .map(p -> new ScheduledExerciseSummaryDTO(p.getDate(), p.getCount()))
            .collect(Collectors.toList());
    }

    public Optional<ScheduledExercise> getScheduledExerciseById(Long id) {
        return scheduledExerciseRepository.findById(id);
    }

    public ScheduledExercise createScheduledExercise(Long userId, LocalDate workoutDate, Long exerciseId,
                                                   Integer sets, Integer reps, Double weight) {
        // Получаем название упражнения для быстрого отображения
        Exercise exercise = exerciseRepository.findById(exerciseId)
            .orElseThrow(() -> new RuntimeException("Exercise not found"));

        ScheduledExercise scheduledExercise = new ScheduledExercise(
            userId, workoutDate, exerciseId, exercise.getName(), sets, reps, weight);

        return scheduledExerciseRepository.save(scheduledExercise);
    }

    public ScheduledExercise updateScheduledExercise(ScheduledExercise scheduledExercise) {
        return scheduledExerciseRepository.save(scheduledExercise);
    }

    public void deleteScheduledExercise(Long id) {
        scheduledExerciseRepository.deleteById(id);
    }
}