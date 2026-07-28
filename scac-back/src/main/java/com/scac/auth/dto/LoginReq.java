package com.scac.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record LoginReq(

    @NotBlank(message = "전화번호는 필수입니다.")
    @Pattern(
        regexp = "^01[016789]-?\\d{3,4}-?\\d{4}$",
        message = "올바른 전화번호 형식이 아닙니다."
    )
    String phoneNumber,

    @NotBlank(message = "입실 비밀번호는 필수입니다.")
    @Pattern(
        regexp = "^\\d{4,6}$",
        message = "입실 비밀번호는 4~6자리 숫자입니다."
    )
    String password

) {}
