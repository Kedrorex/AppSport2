package com.sportapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exercise_progress")
public class ExerciseProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;
    
    @Column(name = "progress_date", nullable = false)
    private LocalDateTime progressDate;
    
    @Column(name = "best_weight")
    private Double bestWeight;
    
    @Column(name = "max_reps")
    private Integer maxReps;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    public ExerciseProgress() {
        this.createdAt = LocalDateTime.now();
        this.progressDate = LocalDateTime.now();
    }
    
    public ExerciseProgress(User user, Exercise exercise, LocalDateTime progressDate, Double bestWeight, Integer maxReps) {
        this();
        this.user = user;
        this.exercise = exercise;
        this.progressDate = progressDate;
        this.bestWeight = bestWeight;
        this.maxReps = maxReps;
    }
    
    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Exercise getExercise() { return exercise; }
    public void setExercise(Exercise exercise) { this.exercise = exercise; }
    
    public LocalDateTime getProgressDate() { return progressDate; }
    public void setProgressDate(LocalDateTime progressDate) { this.progressDate = progressDate; }
    
    public Double getBestWeight() { return bestWeight; }
    public void setBestWeight(Double bestWeight) { this.bestWeight = bestWeight; }
    
    public Integer getMaxReps() { return maxReps; }
    public void setMaxReps(Integer maxReps) { this.maxReps = maxReps; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}