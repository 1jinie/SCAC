package com.scac.user.dto;

import com.scac.user.entity.User;
import com.scac.user.entity.UserRole;
import com.scac.user.entity.UserStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record GuestRegisterReq(

    @NotBlank(message = "이름은 필수 입력 값입니다.")
    String name,

    @NotBlank(message = "전화번호는 필수 입력 값입니다.")
    @Pattern(regexp = "^01[016789]-\\d{3,4}-\\d{4}$", message = "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)")
    String phoneNumber,

    @NotBlank(message = "입실 비밀번호는 필수 입력 값입니다.")
    @Pattern(regexp = "^\\d{4,6}$", message = "입실 비밀번호는 4~6자리 숫자여야 합니다.")
    String entryPassword
) {
    /**
     * DTO -> Entity 변환 (비회원용 isMember = false, role = GUEST)
     */
    public User toEntity(String encodedEntryPassword) {
        return User.builder()
            .loginId(null)
            .password(null)
            .entryPassword(encodedEntryPassword)
            .name(name)
            .phoneNumber(phoneNumber)
            .email(null)
            .role(UserRole.GUEST)
            .status(UserStatus.ACTIVE)
            .isMember(false)
            .build();
    }
}