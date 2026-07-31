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
    LocalDateTime createdAt,
    String currentTicketName
) {
    /**
     * 1. 기존 인자 1개짜리 (이용권 정보가 없을 때 호출)
     * signUp, signUpGuest, verifyEntryPassword 등에서 사용됩니다.
     */
    public static UserRes from(User user) {
        return from(user, null);
    }

    /**
     * 2. 인자 2개짜리 (마이페이지 등 이용권 정보가 포함될 때 호출)
     */
    public static UserRes from(User user, String currentTicketName) {
        return new UserRes(
            user.getId(),
            user.getPhoneNumber(),
            user.getIsMember(),
            user.getRole(),
            user.getUserStatus(),
            user.getPenaltyEndDate(),
            user.getCreatedAt(),
            currentTicketName
        );
    }
}