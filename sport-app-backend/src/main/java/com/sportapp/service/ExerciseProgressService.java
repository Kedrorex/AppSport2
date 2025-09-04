package com.sportapp.service;

import com.sportapp.model.User;
import com.sportapp.model.Exercise;
import com.sportapp.model.ExerciseProgress;
import com.sportapp.repository.ExerciseProgressRepository;
import com.sportapp.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ExerciseProgressService {
    
    @Autowired
    private ExerciseProgressRepository exerciseProgressRepository;
    
    @Autowired
    private ExerciseRepository exerciseRepository;
    
    public List<ExerciseProgress> getProgressByUser(User user) {
        return exerciseProgressRepository.findByUserOrderByProgressDateDesc(user);
    }
    
    public Optional<ExerciseProgress> getProgressByUserAndExercise(User user, Exercise exercise) {
        return exerciseProgressRepository.findByUserAndExercise(user, exercise);
    }
    
    public ExerciseProgress createOrUpdateProgress(User user, Long exerciseId, Double bestWeight, Integer maxReps) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
            .orElseThrow(() -> new RuntimeException("Exercise not found"));
            
        Optional<ExerciseProgress> existingProgress = exerciseProgressRepository.findByUserAndExercise(user, exercise);
        
        ExerciseProgress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            if (bestWeight != null && (progress.getBestWeight() == null || bestWeight > progress.getBestWeight())) {
                progress.setBestWeight(bestWeight);
            }
            if (maxReps != null && (progress.getMaxReps() == null || maxReps > progress.getMaxReps())) {
                progress.setMaxReps(maxReps);
            }
        } else {
            progress = new ExerciseProgress(user, exercise, java.time.LocalDateTime.now(), bestWeight, maxReps);
        }
        
        return exerciseProgressRepository.save(progress);
    }
}