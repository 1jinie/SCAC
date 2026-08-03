package com.scac.admin.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.scac.global.enums.UserRole;
import com.scac.global.enums.UserStatus;
import com.scac.user.entity.User;

public record AdminUserRes(
    Long userId,
    String phoneNumber,
    Boolean isMember,
    UserRole role,
    UserStatus userStatus,
    LocalDate penaltyEndDate,
    LocalDateTime createdAt
) {
    public static AdminUserRes from(User user) {
        return new AdminUserRes(
            user.getId(),
            user.getPhoneNumber(),
            user.getIsMember(),
            user.getRole(),
            user.getUserStatus(),
            user.getPenaltyEndDate(),
            user.getCreatedAt()
        );
    }
}