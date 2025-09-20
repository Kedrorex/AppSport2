//WorkoutMapper.java
package com.sportapp.mapper;

import com.sportapp.dto.WorkoutDTO;
import com.sportapp.dto.WorkoutExerciseDTO;
import com.sportapp.model.Workout;
import com.sportapp.model.WorkoutExercise;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class WorkoutMapper {
    
    public WorkoutDTO toDTO(Workout workout) {
        if (workout == null) return null;
        
        return new WorkoutDTO(
            workout.getId(),
            workout.getUser().getId(),
            workout.getWorkoutDate(),
            workout.getDurationMinutes(),
            workout.getNotes(),
            workout.getWorkoutExercises().stream()
                .map(this::toWorkoutExerciseDTO)
                .collect(Collectors.toList()),
            workout.getCreatedAt()
        );
    }
    
    public WorkoutExerciseDTO toWorkoutExerciseDTO(WorkoutExercise workoutExercise) {
        if (workoutExercise == null) return null;
        
        return new WorkoutExerciseDTO(
            workoutExercise.getId(),
            workoutExercise.getWorkout().getId(),
            workoutExercise.getExercise().getId(),
            workoutExercise.getExercise().getName(),
            workoutExercise.getSets(),
            workoutExercise.getReps(),
            workoutExercise.getWeight(),
            workoutExercise.getCreatedAt()
        );
    }
}