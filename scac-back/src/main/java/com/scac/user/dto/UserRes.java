package com.scac.user.dto;

import com.scac.user.entity.User;
import com.scac.user.entity.UserRole;
import com.scac.user.entity.UserStatus;

import java.time.LocalDateTime;

public record UserRes(
    Long userId,
    String loginId,
    String name,
    String phoneNumber,
    String email,
    UserRole role,
    UserStatus status,
    LocalDateTime penaltyEndDate,
    Boolean isMember,
    LocalDateTime createdAt
) {
    /**
     * Entity -> DTO 변환 정적 팩토리 메서드
     */
    public static UserRes from(User user) {
        return new UserRes(
            user.getId(),
            user.getLoginId(),
            user.getName(),
            user.getPhoneNumber(),
            user.getEmail(),
            user.getRole(),
            user.getStatus(),
            user.getPenaltyEndDate(),
            user.getIsMember(),
            user.getCreatedAt()
        );
    }
}