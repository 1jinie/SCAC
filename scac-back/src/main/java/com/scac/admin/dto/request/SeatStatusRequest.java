package com.scac.admin.dto.request;

import com.scac.global.enums.SeatStatus;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SeatStatusRequest {
    private SeatStatus status;
}
