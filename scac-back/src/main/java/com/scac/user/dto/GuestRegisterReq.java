package com.scac.user.dto;

import com.scac.global.enums.UserRole;
import com.scac.global.enums.UserStatus;
import com.scac.user.entity.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record GuestRegisterReq(

    @NotBlank(message = "전화번호는 필수 입력 값입니다.")
    @Pattern(regexp = "^01[016789]-?\\d{3,4}-?\\d{4}$", message = "올바른 전화번호 형식이 아닙니다.")
    String phoneNumber,

    @NotBlank(message = "입실 비밀번호는 필수 입력 값입니다.")
    @Pattern(regexp = "^\\d{4,6}$", message = "입실 비밀번호는 4~6자리 숫자여야 합니다.")
    String password
) {
    public GuestRegisterReq {
        if (phoneNumber != null) {
            phoneNumber = phoneNumber.replaceAll("-", "");
        }
    }

    public User toEntity(String encodedPassword) {
        return User.builder()
            .phoneNumber(phoneNumber)
            .password(encodedPassword)
            .role(UserRole.GUEST)
            .userStatus(UserStatus.ACTIVE)
            .isMember(false)
            .build();
    }
}