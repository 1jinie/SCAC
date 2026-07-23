package com.scac.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserStatus {
    ACTIVE("정상"),
    SUSPENDED("정지"),
    BANNED("탈퇴/휴면");

    private final String description;
}