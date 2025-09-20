package com.sportapp.security;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.lang.NonNull; // Импортируем @NonNull
import org.springframework.stereotype.Component;

@Component
public class SpringContext implements ApplicationContextAware {

    // Поле не помечаем как @Nullable, так как оно будет инициализировано Spring'ом
    private static ApplicationContext context;

    // Обязательно добавляем @NonNull к параметру, как требует интерфейс ApplicationContextAware
    @Override
    public void setApplicationContext(@NonNull ApplicationContext applicationContext) throws BeansException {
        context = applicationContext;
    }

    // Добавляем проверку на null для безопасности
    public static <T> T getBean(Class<T> beanClass) {
        if (context == null) {
            throw new IllegalStateException("Spring Application Context не инициализирован.");
        }
        return context.getBean(beanClass);
    }
}