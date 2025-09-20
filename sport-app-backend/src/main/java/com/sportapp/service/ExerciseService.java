//ExerciseService.java
package com.sportapp.service;

import com.sportapp.model.Exercise;
import com.sportapp.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ExerciseService {
    
    @Autowired
    private ExerciseRepository exerciseRepository;
    
    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }
    
    public List<Exercise> getExercisesByMuscleGroup(String muscleGroup) {
        return exerciseRepository.findByMuscleGroupContainingIgnoreCase(muscleGroup);
    }
    
    public List<Exercise> searchExercisesByName(String name) {
        return exerciseRepository.findByNameContainingIgnoreCase(name);
    }
    
    public Optional<Exercise> getExerciseById(Long id) {
        return exerciseRepository.findById(id);
    }
    
    public Exercise createExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }
    
    public Exercise updateExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }
    
    public void deleteExercise(Long id) {
        exerciseRepository.deleteById(id);
    }
}