package com.config;

import org.slf4j.LoggerFactory;
import org.springframework.boot.convert.ApplicationConversionService;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.slf4j.Logger;

// Configuration class for Cross-Origin Resource Sharing (CORS)
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(CorsConfig.class);

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        logger.info("Configuring CORS mappings...");
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:3000/",
                        "http://localhost:8080/",
                        "http://localhost:8090/",
                        "http://localhost:8081/",
                        "http://localhost:3306")
                .allowedMethods("POST", "GET", "DELETE", "PUT")
                .allowCredentials(true);
    }

    @Override
    public void addFormatters(final FormatterRegistry registry) {
        ApplicationConversionService.configure(registry);
    }

}