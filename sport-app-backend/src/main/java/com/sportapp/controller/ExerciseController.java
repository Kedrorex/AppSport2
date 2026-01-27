//ExerciseController.java
package com.sportapp.controller;

import com.sportapp.dto.ExerciseCreateRequest;
import com.sportapp.dto.ExerciseDTO;
import com.sportapp.dto.ExerciseUpdateRequest;
import com.sportapp.mapper.ExerciseMapper;
import com.sportapp.model.Exercise;
import com.sportapp.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "*")
public class ExerciseController {
    
    @Autowired
    private ExerciseService exerciseService;
    
    @Autowired
    private ExerciseMapper exerciseMapper;
    
    @GetMapping
    public ResponseEntity<List<ExerciseDTO>> getAllExercises() {
        List<Exercise> exercises = exerciseService.getAllExercises();
        List<ExerciseDTO> exerciseDTOs = exercises.stream()
            .map(exerciseMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(exerciseDTOs);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ExerciseDTO>> searchExercises(@RequestParam(required = false) String name,
                                                           @RequestParam(required = false) String muscleGroup) {
        List<Exercise> exercises;
        if (name != null && !name.isEmpty()) {
            exercises = exerciseService.searchExercisesByName(name);
        } else if (muscleGroup != null && !muscleGroup.isEmpty()) {
            exercises = exerciseService.getExercisesByMuscleGroup(muscleGroup);
        } else {
            exercises = exerciseService.getAllExercises();
        }
        
        List<ExerciseDTO> exerciseDTOs = exercises.stream()
            .map(exerciseMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(exerciseDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDTO> getExercise(@PathVariable Long id) {
        return exerciseService.getExerciseById(id)
            .map(exerciseMapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<ExerciseDTO> createExercise(@Valid @RequestBody ExerciseCreateRequest request) {
        Exercise exercise = new Exercise(
            request.getName(),
            request.getDescription(),
            request.getMuscleGroup(),
            request.getExerciseType()
        );

        Exercise savedExercise = exerciseService.createExercise(exercise);
        return ResponseEntity.ok(exerciseMapper.toDTO(savedExercise));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ExerciseDTO> updateExercise(@PathVariable Long id, @Valid @RequestBody ExerciseUpdateRequest request) {
        return exerciseService.getExerciseById(id)
            .map(existingExercise -> {
                existingExercise.setName(request.getName());
                existingExercise.setDescription(request.getDescription());
                existingExercise.setMuscleGroup(request.getMuscleGroup());
                existingExercise.setExerciseType(request.getExerciseType());
                Exercise updatedExercise = exerciseService.updateExercise(existingExercise);
                return ResponseEntity.ok(exerciseMapper.toDTO(updatedExercise));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        boolean deleted = exerciseService.getExerciseById(id)
            .map(exercise -> {
                exerciseService.deleteExercise(id);
                return true;
            })
            .orElse(false);
            
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}