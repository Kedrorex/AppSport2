package com.sportapp.mapper;

import com.sportapp.dto.ExerciseProgressDTO;
import com.sportapp.model.ExerciseProgress;
import org.springframework.stereotype.Component;

@Component
public class ExerciseProgressMapper {
    
    public ExerciseProgressDTO toDTO(ExerciseProgress exerciseProgress) {
        if (exerciseProgress == null) return null;
        
        return new ExerciseProgressDTO(
            exerciseProgress.getId(),
            exerciseProgress.getUser().getId(),
            exerciseProgress.getExercise().getId(),
            exerciseProgress.getExercise().getName(),
            exerciseProgress.getProgressDate(),
            exerciseProgress.getBestWeight(),
            exerciseProgress.getMaxReps(),
            exerciseProgress.getCreatedAt()
        );
    }
}