package com.sportapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SportAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(SportAppApplication.class, args);
    }

}
