package com.scac;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ScacBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScacBackApplication.class, args);
	}

}
