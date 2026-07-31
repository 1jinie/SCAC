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

<<<<<<< HEAD
                        // 1. PUBLIC GET 요청 (전화번호 중복 확인 포함)
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/users/check-phone", // <--- 추가: 전화번호 중복/존재 확인 API
                                "/api/tickets",
                                "/api/tickets/**",
                                "/api/seats/**",
                                "/api/rooms/**",
                                "/api/meeting-rooms/**",
                                "/api/checkin/**",
                                "api/users/{userId}"
                        ).permitAll()
=======
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/auth/login",
                                        "/api/users/guest",
                                        "/api/users/check-phone", // <--- 추가: 전화번호 중복/존재 확인 API
                                        "/api/tickets/**",
                                        "/api/seats/**",
                                        "/api/rooms/**",
                                        "/api/meeting-rooms/**"
                                ).permitAll()
                                .requestMatchers(
                                        "/api/auth/refresh",
                                        "/api/admin/**",
                                        "/api/auth/login",
                                        "/api/users/signup",
                                        "/api/checkin/**",
                                        "/api/users/entry-password/**"
                                ).permitAll()
>>>>>>> 4f4b5b8c3486316e4194782b34c6ccf2695c1f51

                        // 2. PUBLIC POST 요청 (회원가입, 게스트 등록, 비밀번호 검증 등)
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/login",
                                "/api/auth/refresh",
                                "/api/auth/logout",
                                "/api/admin/auth/login",
                                "/api/admin/auth/refresh",
                                "/api/admin/auth/logout",
                                "/api/users/signup",                  // <--- POST로 이동
                                "/api/users/guest",                   // <--- POST로 이동
                                "/api/users/entry-password/verify"    // <--- POST로 이동
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/users/{userId}/entry-password"
                                
                        ).permitAll()

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