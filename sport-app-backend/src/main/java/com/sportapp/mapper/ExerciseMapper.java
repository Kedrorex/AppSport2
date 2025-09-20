//ExerciseMapper.java
package com.sportapp.mapper;

import com.sportapp.dto.ExerciseDTO;
import com.sportapp.model.Exercise;
import org.springframework.stereotype.Component;

@Component
public class ExerciseMapper {
    
    public ExerciseDTO toDTO(Exercise exercise) {
        if (exercise == null) return null;
        
        return new ExerciseDTO(
            exercise.getId(),
            exercise.getName(),
            exercise.getDescription(),
            exercise.getMuscleGroup(),
            exercise.getExerciseType(),
            exercise.getCreatedAt()
        );
    }
}