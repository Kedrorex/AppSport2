package com.sportapp.repository;

import com.sportapp.model.User;
import com.sportapp.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUserOrderByWorkoutDateDesc(User user);
}