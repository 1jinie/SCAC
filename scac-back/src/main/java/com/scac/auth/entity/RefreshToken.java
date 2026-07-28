package com.scac.auth.entity;

import java.time.LocalDateTime;

import com.scac.user.entity.User;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "refresh_token",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_refresh_token_user",
            columnNames = "user_id"
        )
    }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    @Column(
            name = "refresh_token",
            nullable = false,
            length = 512
    )
    private String refreshToken;

    @Column(
            name = "expired_at",
            nullable = false
    )
    private LocalDateTime expiredAt;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false,
            insertable = false
    )
    private LocalDateTime createdAt;

    @Builder
    public RefreshToken(
            User user,
            String refreshToken,
            LocalDateTime expiredAt
    ) {
        this.user = user;
        this.refreshToken = refreshToken;
        this.expiredAt = expiredAt;
    }

    /**
     * Refresh Token 재발급 시 토큰 갱신
     */
    public void update(
            String refreshToken,
            LocalDateTime expiredAt
    ) {
        this.refreshToken = refreshToken;
        this.expiredAt = expiredAt;
    }
}