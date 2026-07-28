package com.scac.auth.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.scac.auth.dto.JwtTokenRes;
import com.scac.auth.dto.LoginReq;
import com.scac.auth.dto.LoginRes;
import com.scac.auth.entity.RefreshToken;
import com.scac.auth.jwt.JwtProvider;
import com.scac.auth.repository.RefreshTokenRepository;
import com.scac.global.enums.UserStatus;
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

    public LoginRes login(LoginReq req) {

        User user = userRepository.findByPhoneNumber(req.phoneNumber())
                .orElseThrow(() ->
                        new IllegalArgumentException("전화번호 또는 비밀번호가 일치하지 않습니다.")
                );

        if (user.getUserStatus() == UserStatus.BANNED) {
            throw new IllegalArgumentException("영구 이용정지 회원입니다.");
        }

        if (user.getUserStatus() == UserStatus.SUSPENDED) {
            throw new IllegalArgumentException(
                    "현재 이용 정지 상태입니다. 정지 종료일 : "
                            + user.getPenaltyEndDate()
            );
        }

        if (!passwordEncoder.matches(
                req.password(),
                user.getPassword()
        )) {
            throw new IllegalArgumentException(
                    "전화번호 또는 비밀번호가 일치하지 않습니다."
            );
        }

        String accessToken =
                jwtProvider.generateAccessToken(user);

        String refreshToken =
                jwtProvider.generateRefreshToken(user);

        saveRefreshToken(user, refreshToken);

        JwtTokenRes token = new JwtTokenRes(
        accessToken,
        refreshToken
);

return LoginRes.from(token, user);
    }

    private void saveRefreshToken(
        User user,
        String refreshToken
) {

    LocalDateTime expiredAt =
            LocalDateTime.now().plusDays(7);

    refreshTokenRepository
            .findByUserId(user.getId())
            .ifPresentOrElse(

                    token -> {

                        token.update(
                                refreshToken,
                                expiredAt
                        );

                    },

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