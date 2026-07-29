package com.scac.checkin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CheckinRequest {
    private String phoneNumber;
    private String password;
    private Long seatId;
}
