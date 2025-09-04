package com.sportapp.dto;

import java.time.LocalDateTime;

public class ExerciseProgressDTO {
    private Long id;
    private Long userId;
    private Long exerciseId;
    private String exerciseName;
    private LocalDateTime progressDate;
    private Double bestWeight;
    private Integer maxReps;
    private LocalDateTime createdAt;
    
    // Конструкторы
    public ExerciseProgressDTO() {}
    
    public ExerciseProgressDTO(Long id, Long userId, Long exerciseId, String exerciseName,
                              LocalDateTime progressDate, Double bestWeight, Integer maxReps, 
                              LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.exerciseId = exerciseId;
        this.exerciseName = exerciseName;
        this.progressDate = progressDate;
        this.bestWeight = bestWeight;
        this.maxReps = maxReps;
        this.createdAt = createdAt;
    }
    
    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getExerciseId() { return exerciseId; }
    public void setExerciseId(Long exerciseId) { this.exerciseId = exerciseId; }
    
    public String getExerciseName() { return exerciseName; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }
    
    public LocalDateTime getProgressDate() { return progressDate; }
    public void setProgressDate(LocalDateTime progressDate) { this.progressDate = progressDate; }
    
    public Double getBestWeight() { return bestWeight; }
    public void setBestWeight(Double bestWeight) { this.bestWeight = bestWeight; }
    
    public Integer getMaxReps() { return maxReps; }
    public void setMaxReps(Integer maxReps) { this.maxReps = maxReps; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}