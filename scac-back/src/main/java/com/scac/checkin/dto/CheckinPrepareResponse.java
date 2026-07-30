package com.scac.checkin.dto;

import lombok.Getter;

@Getter
public class CheckinPrepareResponse {
    private Long userId;
    private Long usageId;
    private String ticketType;
    private Integer remainingTime;

    private boolean away;

    public CheckinPrepareResponse(
        Long userId,
        Long usageId,
        String ticketType,
        Integer remainingTime,
        boolean away
    ){
        this.userId = userId;
        this.usageId = usageId;
        this.ticketType = ticketType;
        this.remainingTime = remainingTime;
        this.away = away;
    }

}
