package com.scac.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.auth.entity.RefreshToken;

public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, Long> {

    // userId로 조회
    Optional<RefreshToken> findByUserId(Long userId);

    // Refresh Token 문자열로 조회
    Optional<RefreshToken> findByRefreshToken(String refreshToken);

    // userId 존재 여부
    boolean existsByUserId(Long userId);

    // userId 삭제 (로그아웃)
    void deleteByUserId(Long userId);

    // Refresh Token 삭제
    void deleteByRefreshToken(String refreshToken);
}