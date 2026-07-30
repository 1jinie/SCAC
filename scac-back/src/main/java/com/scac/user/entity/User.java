package com.scac.user.entity;

import com.scac.global.enums.UserRole;
import com.scac.global.enums.UserStatus;
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
    private String password;

    @Column(name = "is_member", nullable = false)
    private Boolean isMember;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_status", nullable = false, length = 20)
    private UserStatus userStatus;

    @Column(name = "penalty_end_date")
    private LocalDate penaltyEndDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
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

    public void completeMembership(String encodedPassword) {
        this.isMember = true;
        this.role = UserRole.USER;
        this.password = encodedPassword;
    }

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

    public void applyPenalty(LocalDate endDate) {
        this.userStatus = UserStatus.SUSPENDED;
        this.penaltyEndDate = endDate;
    }

    public void changePassword(String newEncodedPassword) {
        this.password = newEncodedPassword;
    }
}