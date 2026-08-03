package com.scac.admin.dto.request;

import java.time.LocalDate;

import com.scac.global.enums.UserStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserPenaltyReq {

    @NotNull(message = "변경할 회원 상태는 필수입니다.")
    private UserStatus userStatus; // ACTIVE, SUSPENDED, BANNED

    private LocalDate penaltyEndDate; // SUSPENDED일 경우 정지 종료일
}