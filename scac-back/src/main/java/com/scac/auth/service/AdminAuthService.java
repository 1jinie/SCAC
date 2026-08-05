package com.scac.auth.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.scac.admin.entity.AdminAccount;
import com.scac.admin.repository.AdminAccountRepository;
import com.scac.auth.dto.JwtTokenRes;
import com.scac.auth.dto.RefreshTokenReq;
import com.scac.auth.dto.request.AdminLoginReq;
import com.scac.auth.dto.response.AdminLoginRes;
import com.scac.auth.entity.AdminRefreshToken;
import com.scac.auth.jwt.JwtProvider;
import com.scac.auth.repository.AdminRefreshTokenRepository;
import com.scac.global.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminAuthService {

    private final AdminAccountRepository adminAccountRepository;
    private final AdminRefreshTokenRepository adminRefreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    /**
     * 관리자 로그인
     */
    public AdminLoginRes login(AdminLoginReq req) {

        AdminAccount admin = adminAccountRepository.findByLoginId(req.loginId())
                .orElseThrow(() ->
                        new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다."));

        if (!passwordEncoder.matches(req.password(), admin.getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        String accessToken = jwtProvider.generateAccessToken(admin);
        String refreshToken = jwtProvider.generateRefreshToken(admin);

        saveRefreshToken(admin, refreshToken);

        // 마지막 로그인 시간 갱신
        admin.updateLastLogin();

        JwtTokenRes token = new JwtTokenRes(accessToken, refreshToken);

        return AdminLoginRes.from(token, admin);
    }

    /**
     * Access Token / Refresh Token 재발급 (관리자)
     */
    public AdminLoginRes refresh(RefreshTokenReq req) {
        String refreshTokenStr = req.refreshToken();

        // 1. 토큰 서명 및 구조 검증
        if (!jwtProvider.validateStructureAndSignature(refreshTokenStr)) {
            throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다.");
        }

        // 2. Admin ID 추출
        Long adminId = jwtProvider.getAdminId(refreshTokenStr);

        // 3. DB 관리자 토큰 조회
        AdminRefreshToken savedToken = adminRefreshTokenRepository.findByAdminId(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("로그인 정보가 존재하지 않습니다."));

        // 4. 토큰 일치 여부 검증
        if (!savedToken.getRefreshToken().equals(refreshTokenStr)) {
            throw new IllegalArgumentException("올바르지 않은 Refresh Token입니다.");
        }

        // 5. 토큰 만료 여부 검증
        if (savedToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            adminRefreshTokenRepository.delete(savedToken); // 만료 시 잔여 DB 삭제
            throw new IllegalArgumentException("Refresh Token이 만료되었습니다. 다시 로그인해주세요.");
        }

        // 6. 관리자 계정 존재 확인
        AdminAccount admin = adminAccountRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 관리자입니다."));

        // 7. 신규 토큰 발급 및 DB 갱신
        String newAccessToken = jwtProvider.generateAccessToken(admin);
        String newRefreshToken = jwtProvider.generateRefreshToken(admin);

        saveRefreshToken(admin, newRefreshToken);
        admin.updateLastLogin();

        JwtTokenRes tokenRes = new JwtTokenRes(newAccessToken, newRefreshToken);
        return AdminLoginRes.from(tokenRes, admin);
    }

    /**
     * 관리자 로그아웃 (예외 발생 시에도 정상 처리되도록 방어적 구현)
     */
    public void logout(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return;
        }

        String accessToken = authorization.substring(7);

        try {
            Long adminId = jwtProvider.getAdminId(accessToken);
            if (adminId != null) {
                adminRefreshTokenRepository.deleteByAdminId(adminId);
            }
        } catch (Exception e) {
            // 만료되거나 손상된 토큰의 로그아웃 요청도 정상 응답 처리
        }
    }

    private void saveRefreshToken(AdminAccount admin, String refreshToken) {

        LocalDateTime expiredAt =
                LocalDateTime.now().plusSeconds(jwtProvider.getRefreshExpirationSeconds());

        adminRefreshTokenRepository.findByAdminId(admin.getId()).ifPresentOrElse(
                token -> token.update(refreshToken, expiredAt),
                () -> {
                    AdminRefreshToken token = AdminRefreshToken.builder()
                            .admin(admin)
                            .refreshToken(refreshToken)
                            .expiredAt(expiredAt)
                            .build();
                    adminRefreshTokenRepository.save(token);
                }
        );
    }
}