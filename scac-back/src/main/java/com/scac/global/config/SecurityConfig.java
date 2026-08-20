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

                http.cors(cors -> cors.configurationSource(corsConfigurationSource()))

                        .csrf(csrf -> csrf.disable())

                        .sessionManagement(
                                session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                        .exceptionHandling(
                                exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))

                        .authorizeHttpRequests(auth -> auth

                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                // 1. PUBLIC GET 요청 (키오스크 및 일반 사용자 노출용)
                                .requestMatchers(HttpMethod.GET, "/api/users/check-phone", "/api/tickets/**",
                                        "/api/seats/**", "/api/rooms/**", "/api/meeting-rooms", "/api/meeting-rooms/*/availability",
                                        "/api/checkin/**", "/api/commands/**", "/api/devices/**", "/api/faults/**")
                                .permitAll()

                                // 2. PUBLIC POST 요청 (회원가입, 게스트 등록, 비밀번호 검증 등)
                                .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/refresh",
                                        "/api/auth/logout", "/api/auth/send-code", "/api/auth/verify-code",
                                        "/api/admin/auth/login", "/api/admin/auth/refresh",
                                        "/api/admin/auth/logout", "/api/users/signup", "/api/users/guest",
                                        "/api/users/entry-password/verify", "/api/checkin", "/api/commands/**", "/api/devices/**", "/api/faults/**",
                                        "/api/checkin/prepare")
                                .permitAll()

                                // 3. PUBLIC PATCH 요청
                                .requestMatchers(HttpMethod.PATCH, "/api/users/*/entry-password",
                                        "/api/checkin/away", "/api/checkin/comeback", "/api/commands/**", "/api/faults/**", "/api/checkin/checkout",
                                        "/api/devices/*/status") 
                                .permitAll()

                                // 회원 전용 API (JWT 필수)
                                .requestMatchers("/api/checkin/prepare/member", "/api/users/me", "/api/meeting-rooms/reservations",
                                        "/api/meeting-rooms/current", "/api/meeting-rooms/reservations/*", "/api/meeting-rooms/reservations/cancel-pending"
                                )
                                .hasAnyRole("USER", "GUEST")

                                // 사용자 결제 관련 - 결제 요청 시 USER 또는 GUEST 권한 필요 (ADMIN 권한은 불필요)
                                .requestMatchers(HttpMethod.POST, "/api/payments", "/api/payments/confirm",
                                        "/api/payments/*/mock-confirm")
                                .hasAnyRole("USER", "GUEST")

                                // 관리자 전용 경로 통제
                                // 관리자 계정 관리는 SUPER_ADMIN만 가능 나머지는 SUPER_ADMIN, STAFF
                                .requestMatchers("/api/admin/accounts/**").hasRole("SUPER_ADMIN")
                                .requestMatchers("/api/admin/**", "/api/meeting-rooms/admin/**",
                                        "/api/meeting-rooms/reservations/*/cancel")
                                .hasAnyRole("SUPER_ADMIN", "STAFF")

                                // PUBLIC 요청 외 모든 요청은 인증 필요
                                .anyRequest().authenticated())

                        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                // 시연을 위하여 임시로 모든 출처 허용, 실제 배포 시에는 프론트엔드 URL만 허용하도록 변경 필요
                // configuration.setAllowedOrigins(frontendUrls);
                configuration.setAllowedOriginPatterns(List.of("*"));
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