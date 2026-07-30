package com.scac.user.dto;

import com.scac.global.enums.UserRole;
import com.scac.global.enums.UserStatus;
import com.scac.user.entity.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserRes(
    Long userId,
    String phoneNumber,
    Boolean isMember,
    UserRole role,
    UserStatus userStatus,
    LocalDate penaltyEndDate,
    LocalDateTime createdAt
) {
    public static UserRes from(User user) {
        return new UserRes(
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