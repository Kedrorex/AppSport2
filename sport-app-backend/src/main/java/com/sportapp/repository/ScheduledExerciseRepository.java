package com.sportapp.repository;

import com.sportapp.model.ScheduledExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduledExerciseRepository extends JpaRepository<ScheduledExercise, Long> {

    interface DayCountProjection {
        LocalDate getDate();
        long getCount();
    }

    // Получить все упражнения пользователя за определенную дату, отсортированные по времени создания
    List<ScheduledExercise> findByUserIdAndWorkoutDateOrderByCreatedAtAsc(Long userId, LocalDate workoutDate);

    // Получить все упражнения пользователя за определенный период
    List<ScheduledExercise> findByUserIdAndWorkoutDateBetweenOrderByWorkoutDateAscCreatedAtAsc(
        Long userId, LocalDate startDate, LocalDate endDate);

    @Query("""
        select se.workoutDate as date, count(se) as count
        from ScheduledExercise se
        where se.userId = :userId
          and se.workoutDate between :from and :to
        group by se.workoutDate
        order by se.workoutDate
        """)
    List<DayCountProjection> getDayCountsByUserIdAndDateRange(
        @Param("userId") Long userId,
        @Param("from") LocalDate from,
        @Param("to") LocalDate to
    );
}