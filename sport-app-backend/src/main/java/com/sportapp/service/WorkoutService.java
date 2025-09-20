//WorkoutService.java
package com.sportapp.service;

import com.sportapp.model.User;
import com.sportapp.model.Workout;
import com.sportapp.model.Exercise;
import com.sportapp.model.WorkoutExercise;
import com.sportapp.repository.WorkoutRepository;
import com.sportapp.repository.ExerciseRepository;
import com.sportapp.repository.WorkoutExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WorkoutService {
    
    @Autowired
    private WorkoutRepository workoutRepository;
    
    @Autowired
    private ExerciseRepository exerciseRepository;
    
    @Autowired
    private WorkoutExerciseRepository workoutExerciseRepository;
    
    public List<Workout> getWorkoutsByUser(User user) {
        return workoutRepository.findByUserOrderByWorkoutDateDesc(user);
    }
    
    public Optional<Workout> getWorkoutById(Long id) {
        return workoutRepository.findById(id);
    }
    
    public Workout createWorkout(Workout workout) {
        return workoutRepository.save(workout);
    }
    
    public Workout updateWorkout(Workout workout) {
        return workoutRepository.save(workout);
    }
    
    public void deleteWorkout(Long id) {
        workoutRepository.deleteById(id);
    }
    
    public WorkoutExercise addExerciseToWorkout(Long workoutId, Long exerciseId, Integer sets, Integer reps, Double weight) {
        Workout workout = workoutRepository.findById(workoutId)
            .orElseThrow(() -> new RuntimeException("Workout not found"));
        Exercise exercise = exerciseRepository.findById(exerciseId)
            .orElseThrow(() -> new RuntimeException("Exercise not found"));
            
        WorkoutExercise workoutExercise = new WorkoutExercise(workout, exercise, sets, reps, weight);
        return workoutExerciseRepository.save(workoutExercise);
    }
}