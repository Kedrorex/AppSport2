package com.sportapp.config;

import com.sportapp.model.Exercise;
import com.sportapp.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Override
    public void run(String... args) throws Exception {
        // Проверяем, есть ли уже упражнения в базе
        if (exerciseRepository.count() == 0) {
            createTestExercises();
        }
    }

    private void createTestExercises() {
        List<Exercise> exercises = Arrays.asList(
            new Exercise("Жим штанги лёжа", "Классическое упражнение на грудные мышцы", "Грудь", "Силовое"),
            new Exercise("Приседания со штангой", "Базовое упражнение на ноги и ягодицы", "Ноги", "Силовое"),
            new Exercise("Тяга штанги в наклоне", "Упражнение на широчайшие мышцы спины", "Спина", "Силовое"),
            new Exercise("Жим штанги над головой", "Упражнение на плечи и трицепсы", "Плечи", "Силовое"),
            new Exercise("Подтягивания", "Упражнение на背阔肌 и бицепсы", "Спина", "Силовое"),
            new Exercise("Отжимания", "Упражнение на грудь, плечи и трицепсы", "Грудь", "Силовое"),
            new Exercise("Планка", "Упражнение на пресс и кор", "Пресс", "Изометрия"),
            new Exercise("Бег", "Кардио упражнение", "Кардио", "Кардио"),
            new Exercise("Велотренажёр", "Кардио тренировка на велотренажёре", "Кардио", "Кардио"),
            new Exercise("Гантели на бицепс", "Изолирующее упражнение на бицепсы", "Руки", "Силовое")
        );

        exerciseRepository.saveAll(exercises);
        System.out.println("Тестовые упражнения успешно добавлены в базу данных!");
    }
}