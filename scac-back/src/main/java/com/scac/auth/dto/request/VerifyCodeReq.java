package com.scac.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record VerifyCodeReq(
    @NotBlank(message = "전화번호는 필수입니다.")
    String phoneNumber,

    @NotBlank(message = "인증번호는 필수입니다.")
    String code
) {
    public VerifyCodeReq {
        if (phoneNumber != null) {
            phoneNumber = phoneNumber.replaceAll("-", "");
        }
        if (code != null) {
            code = code.trim();
        }
    }
}
