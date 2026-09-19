
        package com.securequestionpaper.questionpapermanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/users/register",
                                "/api/users/login",
                                "/api/users/verify-otp"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/question-papers/upload"
                        ).hasRole("QUESTION_SETTER")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/question-papers/review"
                        ).hasRole("REVIEWER")

                        .requestMatchers(
        HttpMethod.GET,
        "/api/question-papers/review",
        "/api/question-papers/review/**"
)
.hasRole("REVIEWER")

                        .requestMatchers(
        HttpMethod.GET,
        "/api/question-papers/approve"
)
.hasRole("APPROVER")

.requestMatchers(
        HttpMethod.POST,
        "/api/question-papers/approve"
)
.hasRole("APPROVER")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/question-papers/schedule"
                        )
                        .hasRole("APPROVER")

                        .requestMatchers(
        HttpMethod.GET,
        "/api/question-papers/download",
        "/api/question-papers/download/**"
)
.hasRole("EXAM_CENTER")
                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
