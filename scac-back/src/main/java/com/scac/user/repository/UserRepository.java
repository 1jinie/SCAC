package com.scac.user.repository;

import com.scac.global.enums.UserRole;
import com.scac.global.enums.UserStatus;
import com.scac.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByPhoneNumber(String phoneNumber);

    boolean existsByPhoneNumber(String phoneNumber);

    List<User> findByUserStatus(UserStatus userStatus);

    List<User> findByRole(UserRole role);

    List<User> findByIsMember(Boolean isMember);

    long countByUserStatus(UserStatus userStatus);

    @Query("SELECT u FROM User u WHERE u.userStatus = :status " +
           "AND u.penaltyEndDate IS NOT NULL " +
           "AND u.penaltyEndDate <= :today")
    List<User> findExpiredSuspendedUsers(
            @Param("status") UserStatus status,
            @Param("today") LocalDate today
    );

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
    UPDATE User u
    SET u.userStatus = :active,
        u.penaltyEndDate = null
    WHERE u.userStatus = :suspended
    AND u.penaltyEndDate < :today
    """)
    int releaseExpiredSuspensions(
            UserStatus active,
            UserStatus suspended,
            LocalDate today
    );
}