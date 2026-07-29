package com.scac.auth.jwt;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.scac.global.enums.UserStatus;
import com.scac.user.entity.User;
import com.scac.user.repository.UserRepository;
import com.scac.admin.entity.AdminAccount;
import com.scac.admin.repository.AdminAccountRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final AdminAccountRepository adminAccountRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");

        /*
         * Authorization Header가 없으면
         * 다음 Filter로 넘김
         */
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorization.substring(7);

        /*
         * Access Token 검증 실패
         */
        if (!jwtProvider.validateToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String principalType = jwtProvider.getPrincipalType(token);

        if ("user".equals(principalType)) {
            Long userId = jwtProvider.getUserId(token);

            /*
             * DB 조회
             */
            User user = userRepository.findById(userId)
                    .orElse(null);

            if (user == null) {
                filterChain.doFilter(request, response);
                return;
            }

            /*
             * 정지/영구정지 회원
             */
            if (user.getUserStatus() != UserStatus.ACTIVE) {
                filterChain.doFilter(request, response);
                return;
            }

            /*
             * Authentication 생성
             */
            UserPrincipal principal = new UserPrincipal(
                    user.getId(),
                    user.getPhoneNumber(),
                    user.getRole().name(),
                    "user"
            );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            principal,
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            "ROLE_" + user.getRole().name()
                                    )
                            )
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

            filterChain.doFilter(request, response);
            return;
        }

        if ("admin".equals(principalType)) {
            Long adminId = jwtProvider.getAdminId(token);

            AdminAccount admin = adminAccountRepository.findById(adminId).orElse(null);

            if (admin == null) {
                filterChain.doFilter(request, response);
                return;
            }

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            new UserPrincipal(
                                    admin.getId(),
                                    admin.getLoginId(),
                                    admin.getRole().name(),
                                    "admin"
                            ),
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            "ROLE_" + admin.getRole().name()
                                    )
                            )
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

            filterChain.doFilter(request, response);
            return;
        }

        // unknown principal type
        filterChain.doFilter(request, response);
    }
}