package com.scac.user.dto;

import com.scac.user.entity.User;
import com.scac.user.entity.UserRole;
import com.scac.user.entity.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserSignUpReq(

    @NotBlank(message = "아이디는 필수 입력 값입니다.")
    @Size(min = 4, max = 20, message = "아이디는 4자 이상 20자 이하로 입력해주세요.")
    String loginId,

    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    @Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하로 입력해주세요.")
    String password,

    @NotBlank(message = "입실 비밀번호는 필수 입력 값입니다.")
    @Pattern(regexp = "^\\d{4,6}$", message = "입실 비밀번호는 4~6자리 숫자여야 합니다.")
    String entryPassword,

    @NotBlank(message = "이름은 필수 입력 값입니다.")
    String name,

    @NotBlank(message = "전화번호는 필수 입력 값입니다.")
    @Pattern(regexp = "^01[016789]-\\d{3,4}-\\d{4}$", message = "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)")
    String phoneNumber,

    @Email(message = "올바른 이메일 형식이 아닙니다.")
    String email
) {
    /**
     * DTO -> Entity 변환 메서드 (비밀번호 암호화는 Service 계층에서 수행 후 전달)
     */
    public User toEntity(String encodedPassword, String encodedEntryPassword) {
        return User.builder()
            .loginId(loginId)
            .password(encodedPassword)
            .entryPassword(encodedEntryPassword)
            .name(name)
            .phoneNumber(phoneNumber)
            .email(email)
            .role(UserRole.USER)
            .status(UserStatus.ACTIVE)
            .isMember(true)
            .build();
    }
}