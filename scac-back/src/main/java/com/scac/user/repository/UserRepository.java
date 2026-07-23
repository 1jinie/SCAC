package com.scac.user.repository;

import com.scac.user.entity.User;
import com.scac.user.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 1. 로그인 아이디로 회원 조회 (일반 회원 로그인)
    Optional<User> findByLoginId(String loginId);

    // 2. 전화번호로 회원 조회 (게스트 및 전화번호 기반 입실 인증)
    Optional<User> findByPhoneNumber(String phoneNumber);

    // 3. 아이디 중복 확인
    boolean existsByLoginId(String loginId);

    // 4. 전화번호 중복 확인
    boolean existsByPhoneNumber(String phoneNumber);

    // 5. 전화번호 및 입실 비밀번호 일치 회원 조회 (키오스크/출입문인증용)
    Optional<User> findByPhoneNumberAndIsMember(String phoneNumber, Boolean isMember);

    /**
     * 6. 패널티 기간이 경과한 정지 회원을 일괄 ACTIVE로 자동 전환 (스케줄러 또는 배치작업용)
     */
    @Modifying
    @Query("UPDATE User u SET u.status = :activeStatus, u.penaltyEndDate = null " +
           "WHERE u.status = :suspendedStatus AND u.penaltyEndDate < :now")
    int releaseExpiredSuspensions(
        @Param("activeStatus") UserStatus activeStatus,
        @Param("suspendedStatus") UserStatus suspendedStatus,
        @Param("now") LocalDateTime now
    );
}