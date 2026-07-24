package com.scac.checkin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CheckinRequest {
    private Long userId;
    private Long seatId;
    private Long usageId;
}
