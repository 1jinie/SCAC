package com.scac.auth.entity;

import java.time.LocalDateTime;

import com.scac.admin.entity.AdminAccount;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "admin_refresh_token",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_admin_refresh_user",
            columnNames = "admin_id"
        ),
        @UniqueConstraint(
            name = "uq_admin_refresh_token",
            columnNames = "refresh_token"
        )
    },
    indexes = {
        @Index(
            name = "idx_admin_refresh_expired",
            columnList = "expired_at"
        )
    }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminRefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private AdminAccount admin;

    @Column(name = "refresh_token", nullable = false, length = 512)
    private String refreshToken;

    @Column(name = "expired_at", nullable = false)
    private LocalDateTime expiredAt;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private LocalDateTime createdAt;

    @Builder
    public AdminRefreshToken(
            AdminAccount admin,
            String refreshToken,
            LocalDateTime expiredAt
    ) {
        this.admin = admin;
        this.refreshToken = refreshToken;
        this.expiredAt = expiredAt;
    }

    public void update(String refreshToken, LocalDateTime expiredAt) {
        this.refreshToken = refreshToken;
        this.expiredAt = expiredAt;
    }

}
