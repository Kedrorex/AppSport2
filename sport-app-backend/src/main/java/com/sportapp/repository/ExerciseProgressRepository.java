package com.sportapp.repository;

import com.sportapp.model.ExerciseProgress;
import com.sportapp.model.User;
import com.sportapp.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseProgressRepository extends JpaRepository<ExerciseProgress, Long> {
    List<ExerciseProgress> findByUserOrderByProgressDateDesc(User user);
    Optional<ExerciseProgress> findByUserAndExercise(User user, Exercise exercise);
}