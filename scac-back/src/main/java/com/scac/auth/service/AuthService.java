package com.scac.auth.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.scac.auth.dto.JwtTokenRes;
import com.scac.auth.dto.RefreshTokenReq;
import com.scac.auth.dto.request.LoginReq;
import com.scac.auth.dto.response.LoginRes;
import com.scac.auth.entity.RefreshToken;
import com.scac.auth.jwt.JwtProvider;
import com.scac.auth.repository.RefreshTokenRepository;
import com.scac.global.enums.UserStatus;
import com.scac.global.exception.ResourceNotFoundException;
import com.scac.user.entity.User;
import com.scac.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    /**
     * 로그인
     */
    public LoginRes login(LoginReq req) {

        User user = userRepository.findByPhoneNumber(req.phoneNumber())
                .orElseThrow(() ->
                        new IllegalArgumentException("전화번호 또는 비밀번호가 일치하지 않습니다."));

        if (user.getUserStatus() == UserStatus.BANNED) {
            throw new IllegalArgumentException("영구 이용정지 회원입니다.");
        }

        if (user.getUserStatus() == UserStatus.SUSPENDED) {
            throw new IllegalArgumentException(
                    "현재 이용 정지 상태입니다. 정지 종료일 : "
                            + user.getPenaltyEndDate());
        }

        if (!passwordEncoder.matches(
                req.password(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "전화번호 또는 비밀번호가 일치하지 않습니다.");
        }

        String accessToken = jwtProvider.generateAccessToken(user);
        String refreshToken = jwtProvider.generateRefreshToken(user);

        saveRefreshToken(user, refreshToken);

        JwtTokenRes token =
                new JwtTokenRes(accessToken, refreshToken);

        return LoginRes.from(token, user);
    }

    /**
     * Access Token 재발급
     */
    /**
     * Access Token / Refresh Token 재발급 (일반 사용자)
     */
    public LoginRes refresh(RefreshTokenReq req) {
        String refreshTokenStr = req.refreshToken();

        // 1. 토큰 서명 및 구조 검증 (위변조 체킹)
        if (!jwtProvider.validateStructureAndSignature(refreshTokenStr)) {
            throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다.");
        }

        // 2. Claims에서 userId 추출 (만료된 토큰이어도 추출 가능)
        Long userId = jwtProvider.getUserId(refreshTokenStr);

        // 3. DB 토큰 조회
        RefreshToken savedToken = refreshTokenRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("로그인 정보가 존재하지 않습니다."));

        // 4. DB 토큰과 전달받은 토큰 일치 여부 검증 (토큰 탈취/구토큰 사용 방지)
        if (!savedToken.getRefreshToken().equals(refreshTokenStr)) {
            throw new IllegalArgumentException("올바르지 않은 Refresh Token입니다.");
        }

        // 5. 토큰 만료 여부 검증 (DB expiredAt 기준)
        if (savedToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(savedToken); // 만료된 토큰 DB에서 삭제
            throw new IllegalArgumentException("Refresh Token이 만료되었습니다. 다시 로그인해주세요.");
        }

        // 6. 회원 존재 및 상태 검증
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 회원입니다."));

        if (user.getUserStatus() == UserStatus.BANNED) {
            throw new IllegalArgumentException("영구 이용정지 회원입니다.");
        }

        if (user.getUserStatus() == UserStatus.SUSPENDED) {
            throw new IllegalArgumentException("현재 이용 정지 상태입니다. 정지 종료일: " + user.getPenaltyEndDate());
        }

        // 7. 토큰 신규 발급 및 DB 갱신 (RTR - Refresh Token Rotation)
        String newAccessToken = jwtProvider.generateAccessToken(user);
        String newRefreshToken = jwtProvider.generateRefreshToken(user);

        saveRefreshToken(user, newRefreshToken);

        JwtTokenRes tokenRes = new JwtTokenRes(newAccessToken, newRefreshToken);
        return LoginRes.from(tokenRes, user);
    }

    /**
     * 로그아웃
     */
    // AuthService.java
        public void logout(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
                return; // 예외를 던지지 않고 무시하거나 정상 처리 응답
        }

        String accessToken = authorization.substring(7);

        try {
                Long userId = jwtProvider.getUserId(accessToken);
                if (userId != null) {
                refreshTokenRepository.deleteByUserId(userId);
                }
        } catch (Exception e) {
                // 이미 만료되었거나 손상된 토큰 로그아웃 요청 시 무시
        }
        }

    /**
     * Refresh Token 저장/갱신
     */
    private void saveRefreshToken(
            User user,
            String refreshToken
    ) {

        LocalDateTime expiredAt =
    LocalDateTime.now()
        .plusSeconds(jwtProvider.getRefreshExpirationSeconds());

        refreshTokenRepository
                .findByUserId(user.getId())
                .ifPresentOrElse(

                        token -> token.update(
                                refreshToken,
                                expiredAt
                        ),

                        () -> {

                            RefreshToken token =
                                    RefreshToken.builder()
                                            .user(user)
                                            .refreshToken(refreshToken)
                                            .expiredAt(expiredAt)
                                            .build();

                            refreshTokenRepository.save(token);
                        }
                );
    }
}