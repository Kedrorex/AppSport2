//ExerciseProgressController.java
package com.sportapp.controller;

import com.sportapp.dto.ExerciseProgressDTO;
import com.sportapp.mapper.ExerciseProgressMapper;
import com.sportapp.model.User;
import com.sportapp.security.UserDetailsImpl;
import com.sportapp.model.ExerciseProgress;
import com.sportapp.service.ExerciseProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ExerciseProgressController {
    
    @Autowired
    private ExerciseProgressService exerciseProgressService;
    
    @Autowired
    private ExerciseProgressMapper exerciseProgressMapper;
    
    @GetMapping
    public ResponseEntity<List<ExerciseProgressDTO>> getProgress(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();
        List<ExerciseProgress> progressList = exerciseProgressService.getProgressByUser(user);
        List<ExerciseProgressDTO> progressDTOs = progressList.stream()
            .map(exerciseProgressMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(progressDTOs);
    }
    
    @PostMapping
    public ResponseEntity<ExerciseProgressDTO> createProgress(
            @RequestParam Long exerciseId,
            @RequestParam(required = false) Double bestWeight,
            @RequestParam(required = false) Integer maxReps,
            Authentication authentication) {
        
        User user = (User) authentication.getPrincipal();
        ExerciseProgress progress = exerciseProgressService.createOrUpdateProgress(user, exerciseId, bestWeight, maxReps);
        return ResponseEntity.ok(exerciseProgressMapper.toDTO(progress));
    }
}