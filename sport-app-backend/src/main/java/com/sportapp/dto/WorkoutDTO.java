//WorkoutDTO.java
package com.sportapp.dto;

import java.time.LocalDateTime;
import java.util.List;

public class WorkoutDTO {
    private Long id;
    private Long userId;
    private LocalDateTime workoutDate;
    private Integer durationMinutes;
    private String notes;
    private List<WorkoutExerciseDTO> workoutExercises;
    private LocalDateTime createdAt;
    
    // Конструкторы
    public WorkoutDTO() {}
    
    public WorkoutDTO(Long id, Long userId, LocalDateTime workoutDate, Integer durationMinutes, 
                     String notes, List<WorkoutExerciseDTO> workoutExercises, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.workoutDate = workoutDate;
        this.durationMinutes = durationMinutes;
        this.notes = notes;
        this.workoutExercises = workoutExercises;
        this.createdAt = createdAt;
    }
    
    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public LocalDateTime getWorkoutDate() { return workoutDate; }
    public void setWorkoutDate(LocalDateTime workoutDate) { this.workoutDate = workoutDate; }
    
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public List<WorkoutExerciseDTO> getWorkoutExercises() { return workoutExercises; }
    public void setWorkoutExercises(List<WorkoutExerciseDTO> workoutExercises) { this.workoutExercises = workoutExercises; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}