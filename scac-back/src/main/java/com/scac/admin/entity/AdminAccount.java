package com.scac.admin.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Access;
import jakarta.persistence.AccessType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admin_account")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Access(AccessType.FIELD)
public class AdminAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Long id;

    @Column(
            name = "login_id",
            nullable = false,
            unique = true,
            length = 100
    )
    private String loginId;

    @Column(
            nullable = false,
            length = 255
    )
    private String password;

    @Column(
            nullable = false,
            length = 50
    )
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    private AdminRole role;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Builder
    public AdminAccount(
            String loginId,
            String password,
            String name,
            AdminRole role
    ) {
        this.loginId = loginId;
        this.password = password;
        this.name = name;
        this.role = role;
    }

    /**
     * 마지막 로그인 시간 갱신
     */
    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
    }

    /**
     * 비밀번호 변경
     */
    public void changePassword(String password) {
        this.password = password;
    }

    /**
     * 권한 변경
     */
    public void changeRole(AdminRole role) {
        this.role = role;
    }
}