package com.scac.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "User")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "login_id", unique = true, length = 50)
    private String loginId; // GUEST는 null 가능

    @Column(name = "password", length = 255)
    private String password; // GUEST는 null 가능

    @Column(name = "entry_password", length = 255)
    private String entryPassword; // 출입용 4~6자리 비밀번호 (BCrypt 암호화)

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "email", length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role; // USER, GUEST

    @Enumerated(EnumType.STRING)
    @Column(name = "user_status", nullable = false, length = 20)
    private UserStatus status; // ACTIVE, SUSPENDED, INACTIVE

    @Column(name = "penalty_end_date")
    private LocalDateTime penaltyEndDate; // 패널티 종료 일시

    @Column(name = "is_member", nullable = false)
    private Boolean isMember;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isMember == null) this.isMember = true;
        if (this.role == null) this.role = UserRole.USER;
        if (this.status == null) this.status = UserStatus.ACTIVE;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Builder
    public User(String loginId, String password, String entryPassword, String name,
                String phoneNumber, String email, UserRole role, UserStatus status,
                LocalDateTime penaltyEndDate, Boolean isMember) {
        this.loginId = loginId;
        this.password = password;
        this.entryPassword = entryPassword;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.role = role != null ? role : UserRole.USER;
        this.status = status != null ? status : UserStatus.ACTIVE;
        this.penaltyEndDate = penaltyEndDate;
        this.isMember = isMember != null ? isMember : true;
    }

    // ================= 비즈니스 로직 메서드 ================= //

    /**
     * 로그인 / 이용권 구매 / 입실 시 패널티 자동 해제 검증
     * @return 패널티 정지 상태 지속 여부 (true: 여전히 정지 중, false: 정상 이용 가능)
     */
    public boolean checkAndReleaseSuspension() {
        if (this.status == UserStatus.SUSPENDED) {
            if (this.penaltyEndDate != null && LocalDateTime.now().isAfter(this.penaltyEndDate)) {
                // 정지 기간이 지났으므로 자동 해제
                this.status = UserStatus.ACTIVE;
                this.penaltyEndDate = null;
                return false; // 정지 해제됨
            }
            return true; // 여전히 정지 상태
        }
        return false; // 정지 상태 아님
    }

    /**
     * 관리자 강제 퇴실 등에 의한 패널티 부여
     */
    public void applyPenalty(LocalDateTime endDate) {
        this.status = UserStatus.SUSPENDED;
        this.penaltyEndDate = endDate;
    }

    // User.java 내부 추가
public void changeEntryPassword(String newEncodedEntryPassword) {
    this.entryPassword = newEncodedEntryPassword;
}

    
}