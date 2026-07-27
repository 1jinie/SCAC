package com.scac.user.repository;

import com.scac.global.enums.UserRole;
import com.scac.global.enums.UserStatus;
import com.scac.user.entity.User;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 전화번호 로그인
    Optional<User> findByPhoneNumber(String phoneNumber);

    // 회원가입 중복 검사
    boolean existsByPhoneNumber(String phoneNumber);

    // 회원 여부 확인
    Optional<User> findByPhoneNumberAndIsMember(String phoneNumber, Boolean isMember);

    List<User> findByUserStatus(UserStatus userStatus);

    List<User> findByRole(UserRole role);

    List<User> findByIsMember(Boolean isMember);

    // 정지기간 종료 회원 ACTIVE 변경
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE User u
        SET u.userStatus = com.scac.user.entity.UserStatus.ACTIVE,
            u.penaltyEndDate = null
        WHERE u.userStatus = com.scac.user.entity.UserStatus.SUSPENDED
          AND u.penaltyEndDate < :today
    """)
    int releaseExpiredSuspensions(LocalDate today);
}