package com.scac.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "phone_number", nullable = false, unique = true, length = 30)
    private String phoneNumber;

    @Column(name = "password", nullable = false, length = 255)
    private String password; // 6자리 간편 암호 (해시 암호화 저장)

    @Column(name = "is_member", nullable = false)
    private Boolean isMember; // TRUE: 회원, FALSE: 비회원/게스트

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role; // GUEST, USER, ADMIN

    @Enumerated(EnumType.STRING)
    @Column(name = "user_status", nullable = false, length = 20)
    private UserStatus userStatus; // ACTIVE, SUSPENDED, BANNED

    @Column(name = "penalty_end_date")
    private LocalDate penaltyEndDate; // 정지 해제 날짜 (DATE)

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.isMember == null) this.isMember = false;
        if (this.role == null) this.role = UserRole.USER;
        if (this.userStatus == null) this.userStatus = UserStatus.ACTIVE;
    }

    @Builder
    public User(String phoneNumber, String password, Boolean isMember,
                UserRole role, UserStatus userStatus, LocalDate penaltyEndDate) {
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.isMember = isMember != null ? isMember : false;
        this.role = role != null ? role : UserRole.USER;
        this.userStatus = userStatus != null ? userStatus : UserStatus.ACTIVE;
        this.penaltyEndDate = penaltyEndDate;
    }

    public void activate() {
    this.userStatus = UserStatus.ACTIVE;
    this.penaltyEndDate = null;
    }

    public void ban() {
        this.userStatus = UserStatus.BANNED;
    }

    public void changeRole(UserRole role) {
        this.role = role;
    }

    public void completeMembership() {
        this.isMember = true;
    }

    // ================= 비즈니스 로직 메서드 ================= //

    /**
     * 패널티 정지 자동 해제 검증 (LocalDate 기준)
     */
    public boolean checkAndReleaseSuspension() {
        if (this.userStatus == UserStatus.SUSPENDED) {
            if (this.penaltyEndDate != null && LocalDate.now().isAfter(this.penaltyEndDate)) {
                this.userStatus = UserStatus.ACTIVE;
                this.penaltyEndDate = null;
                return false;
            }
            return true;
        }
        return false;
    }

    /**
     * 관리자 정지 부여 (LocalDate 기준)
     */
    public void applyPenalty(LocalDate endDate) {
        this.userStatus = UserStatus.SUSPENDED;
        this.penaltyEndDate = endDate;
    }

    /**
     * 비밀번호 변경
     */
    public void changePassword(String newEncodedPassword) {
        this.password = newEncodedPassword;
    }
}