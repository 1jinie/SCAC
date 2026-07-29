package com.scac.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.auth.entity.AdminRefreshToken;

public interface AdminRefreshTokenRepository extends JpaRepository<AdminRefreshToken, Long> {

    Optional<AdminRefreshToken> findByAdminId(Long adminId);

    Optional<AdminRefreshToken> findByRefreshToken(String refreshToken);

    boolean existsByAdminId(Long adminId);

    void deleteByAdminId(Long adminId);

    void deleteByRefreshToken(String refreshToken);

}
