package com.scac.admin.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.admin.entity.AdminAccount;
import com.scac.admin.repository.AdminAccountRepository;

import com.scac.auth.jwt.JwtProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminAccountRepository adminAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Transactional
    public TokenResponse loginAdmin(AdminLoginRequest request) {
        // 1. 아이디 검증
        AdminAccount admin = adminAccountRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자 계정입니다."));

        // 2. 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. [필수 요구사항] 마지막 로그인 시간 기록 (Dirty Checking으로 DB 반영)
        admin.updateLastLogin();

        // 4. AccessToken / RefreshToken 발급 (AdminAccount 오버로딩 메서드 사용)
        String accessToken = jwtProvider.generateAccessToken(admin);
        String refreshToken = jwtProvider.generateRefreshToken(admin);

        return new TokenResponse(accessToken, refreshToken);
    }
}