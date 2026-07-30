package com.scac.checkin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CheckinPrepareRequest {
    @NotBlank(message = "전화번호는 필수입니다")
    private String phoneNumber;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Pattern(regexp = "^\\d{6}$", message = "입실 비밀번호는 6자리 숫자여야 합니다")
    private String password;
}
