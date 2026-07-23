package com.scac.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record EntryPasswordUpdateReq(

    @NotBlank(message = "현재 입실 비밀번호를 입력해주세요.")
    String currentEntryPassword,

    @NotBlank(message = "새로운 입실 비밀번호를 입력해주세요.")
    @Pattern(regexp = "^\\d{4,6}$", message = "새로운 입실 비밀번호는 4~6자리 숫자여야 합니다.")
    String newEntryPassword
) {
}