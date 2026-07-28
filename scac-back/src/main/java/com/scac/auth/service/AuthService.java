package com.scac.auth.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.scac.auth.dto.JwtTokenRes;
import com.scac.auth.dto.LoginReq;
import com.scac.auth.dto.LoginRes;
import com.scac.auth.dto.RefreshTokenReq;
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
    public LoginRes refresh(RefreshTokenReq req) {

        if (!jwtProvider.validateToken(req.refreshToken())) {
            throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다.");
        }

        Long userId = jwtProvider.getUserId(req.refreshToken());

        RefreshToken savedToken =
                refreshTokenRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Refresh Token이 존재하지 않습니다."));

        if (!savedToken.getRefreshToken().equals(req.refreshToken())) {
            throw new IllegalArgumentException("Refresh Token이 일치하지 않습니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("존재하지 않는 회원입니다."));

        if (user.getUserStatus() == UserStatus.BANNED) {
            throw new IllegalArgumentException("영구 이용정지 회원입니다.");
        }

        if (user.getUserStatus() == UserStatus.SUSPENDED) {
            throw new IllegalArgumentException(
                    "현재 이용 정지 상태입니다. 정지 종료일 : "
                            + user.getPenaltyEndDate());
        }

        if(savedToken.getExpiredAt().isBefore(LocalDateTime.now())){
            throw new IllegalArgumentException("Refresh Token이 만료되었습니다.");
        }

        String accessToken =
                jwtProvider.generateAccessToken(user);

        String refreshToken =
                jwtProvider.generateRefreshToken(user);

        saveRefreshToken(user, refreshToken);

        JwtTokenRes token =
                new JwtTokenRes(accessToken, refreshToken);

        return LoginRes.from(token, user);
    }

    /**
     * 로그아웃
     */
    public void logout(String authorization) {

        if (authorization == null ||
                !authorization.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Authorization 헤더가 올바르지 않습니다.");
        }

        String accessToken =
                authorization.substring(7);

        Long userId =
                jwtProvider.getUserId(accessToken);

        refreshTokenRepository.deleteByUserId(userId);
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