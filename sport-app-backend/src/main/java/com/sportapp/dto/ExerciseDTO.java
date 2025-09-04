package com.sportapp.dto;

import java.time.LocalDateTime;

public class ExerciseDTO {
    private Long id;
    private String name;
    private String description;
    private String muscleGroup;
    private String exerciseType;
    private LocalDateTime createdAt;
    
    // Конструкторы
    public ExerciseDTO() {}
    
    public ExerciseDTO(Long id, String name, String description, String muscleGroup, 
                      String exerciseType, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.muscleGroup = muscleGroup;
        this.exerciseType = exerciseType;
        this.createdAt = createdAt;
    }
    
    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getMuscleGroup() { return muscleGroup; }
    public void setMuscleGroup(String muscleGroup) { this.muscleGroup = muscleGroup; }
    
    public String getExerciseType() { return exerciseType; }
    public void setExerciseType(String exerciseType) { this.exerciseType = exerciseType; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}