package com.scac.global.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.scac.auth.jwt.JwtAuthenticationFilter;
import com.scac.auth.jwt.JwtAuthenticationEntryPoint;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

        @Value("${app.frontend-url}")
        private List<String> frontendUrls;

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

                http

                        .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                        .csrf(csrf -> csrf.disable())

                        .sessionManagement(
                                session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                        .exceptionHandling(
                                exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))

                        .authorizeHttpRequests(auth -> auth

                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                .requestMatchers("/api/auth/login", "/api/auth/refresh", "/api/admin/login",
                                        "/api/users/signup", "/api/users/guest", "/api/seats/**")
                                .permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/tickets", "/api/tickets/**")
                                .permitAll()

                                .anyRequest().authenticated())

                        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(frontendUrls);
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setExposedHeaders(List.of("Authorization"));
                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", configuration);

                return source;
        }
}