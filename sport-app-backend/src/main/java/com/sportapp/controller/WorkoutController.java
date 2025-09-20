//WorkoutController.java
package com.sportapp.controller;

import com.sportapp.dto.WorkoutDTO;
import com.sportapp.mapper.WorkoutMapper;
import com.sportapp.model.User;
import com.sportapp.model.Workout;
import com.sportapp.model.WorkoutExercise;
import com.sportapp.security.UserDetailsImpl;
import com.sportapp.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "*")
public class WorkoutController {
    
    @Autowired
    private WorkoutService workoutService;
    
    @Autowired
    private WorkoutMapper workoutMapper;
    
    @GetMapping
    public ResponseEntity<List<WorkoutDTO>> getWorkouts(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();
        List<Workout> workouts = workoutService.getWorkoutsByUser(user);
        List<WorkoutDTO> workoutDTOs = workouts.stream()
            .map(workoutMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(workoutDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<WorkoutDTO> getWorkout(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return workoutService.getWorkoutById(id)
            .filter(workout -> workout.getUser().getId().equals(user.getId()))
            .map(workoutMapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<WorkoutDTO> createWorkout(@RequestBody Workout workout, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        workout.setUser(user);
        Workout savedWorkout = workoutService.createWorkout(workout);
        return ResponseEntity.ok(workoutMapper.toDTO(savedWorkout));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<WorkoutDTO> updateWorkout(@PathVariable Long id, 
                                                   @RequestBody Workout workout, 
                                                   Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return workoutService.getWorkoutById(id)
            .filter(w -> w.getUser().getId().equals(user.getId()))
            .map(existingWorkout -> {
                existingWorkout.setWorkoutDate(workout.getWorkoutDate());
                existingWorkout.setDurationMinutes(workout.getDurationMinutes());
                existingWorkout.setNotes(workout.getNotes());
                Workout updatedWorkout = workoutService.updateWorkout(existingWorkout);
                return ResponseEntity.ok(workoutMapper.toDTO(updatedWorkout));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        boolean deleted = workoutService.getWorkoutById(id)
            .filter(workout -> workout.getUser().getId().equals(user.getId()))
            .map(workout -> {
                workoutService.deleteWorkout(id);
                return true;
            })
            .orElse(false);
            
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{workoutId}/exercises")
    public ResponseEntity<WorkoutExercise> addExerciseToWorkout(
            @PathVariable Long workoutId,
            @RequestParam Long exerciseId,
            @RequestParam Integer sets,
            @RequestParam Integer reps,
            @RequestParam(required = false) Double weight,
            Authentication authentication) {
        
        User user = (User) authentication.getPrincipal();
        
        return workoutService.getWorkoutById(workoutId)
            .filter(workout -> workout.getUser().getId().equals(user.getId()))
            .map(workout -> {
                WorkoutExercise workoutExercise = workoutService.addExerciseToWorkout(
                    workoutId, exerciseId, sets, reps, weight);
                return ResponseEntity.ok(workoutExercise);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}