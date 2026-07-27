package com.scac.user.dto;

import com.scac.global.enums.UserRole;
import com.scac.global.enums.UserStatus;
import com.scac.user.entity.User;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UserSignUpReq(

    @NotBlank(message = "전화번호는 필수 입력 값입니다.")
    @Pattern(regexp = "^01[016789]-?\\d{3,4}-?\\d{4}$", message = "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)")
    String phoneNumber,

    @NotBlank(message = "입실 비밀번호는 필수 입력 값입니다.")
    @Pattern(regexp = "^\\d{4,6}$", message = "입실 비밀번호는 4~6자리 숫자여야 합니다.")
    String password

) {
    /**
     * DTO -> Entity 변환 메서드 (비밀번호 암호화는 Service 계층에서 수행 후 전달)
     */
    public User toEntity(String encodedPassword) {
        return User.builder()
            .phoneNumber(phoneNumber)
            .password(encodedPassword)
            .role(UserRole.USER)
            .userStatus(UserStatus.ACTIVE)
            .isMember(true)
            .build();
    }
}