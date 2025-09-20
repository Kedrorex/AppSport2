//ExerciseRepository.java
package com.sportapp.repository;

import com.sportapp.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByMuscleGroupContainingIgnoreCase(String muscleGroup);
    List<Exercise> findByNameContainingIgnoreCase(String name);
}