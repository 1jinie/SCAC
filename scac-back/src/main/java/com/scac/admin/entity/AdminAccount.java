package com.scac.admin.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_account")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Long id;

    @Column(name = "login_id", nullable = false, unique = true, length = 50)
    private String loginId;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private AdminRole role;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Builder
    public AdminAccount(String loginId, String password, String name, AdminRole role) {
        this.loginId = loginId;
        this.password = password;
        this.name = name;
        this.role = role != null ? role : AdminRole.STAFF;
    }

    // 로그인 시 마지막 로그인 시간 갱신용 메서드
    public void updateLastLoginAt() {
        this.lastLoginAt = LocalDateTime.now();
    }
}