package com.scac.admin.dto.request;

import com.scac.global.enums.SeatStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SeatStatusRequest {

    @NotNull(message = "변경할 좌석 상태값은 필수입니다.")
    private SeatStatus status;
}