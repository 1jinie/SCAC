package com.scac.checkin.dto;

import java.time.LocalDateTime;

import com.scac.checkin.domain.Checkin;

import lombok.Getter;

@Getter
public class CheckinResponse {
    private Long checkinId;
    private Long seatId;
    private Long userId;
    private Long usageId;
    private LocalDateTime checkinAt;
    private String checkinStatus;

    public CheckinResponse(Checkin checkin) {
        this.checkinId = checkin.getCheckinId();
        this.userId = checkin.getUserId();
        this.seatId = checkin.getSeatId();
        this.usageId = checkin.getUsageId();
        this.checkinAt = checkin.getCheckinAt();
        this.checkinStatus = checkin.getCheckinStatus().name();
    }

    public static CheckinResponse from(Checkin checkin){
        return new CheckinResponse(checkin);
    }
}
