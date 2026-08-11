package com.scac.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record SendCodeReq(
    @NotBlank(message = "전화번호는 필수입니다.")
    @Pattern(
        regexp = "^01[016789]-?\\d{3,4}-?\\d{4}$",
        message = "올바른 전화번호 형식이 아닙니다."
    )
    String phoneNumber
) {
    public SendCodeReq {
        if (phoneNumber != null) {
            phoneNumber = phoneNumber.replaceAll("-", "");
        }
    }
}
