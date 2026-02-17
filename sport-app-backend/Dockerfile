# 1. Используем официальный образ OpenJDK 17
FROM eclipse-temurin:17-jdk-alpine

# 2. Рабочая директория внутри контейнера
WORKDIR /app

# 3. Копируем Maven файлы для сборки
COPY pom.xml .
COPY src ./src

# 4. Устанавливаем Maven и собираем проект
RUN apt-get update && \
    apt-get install -y maven && \
    mvn clean package -DskipTests

# 5. Копируем собранный JAR
COPY target/*.jar app.jar

# 6. Открываем порт 8080
EXPOSE 8080

# 7. Команда для запуска Spring Boot
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
