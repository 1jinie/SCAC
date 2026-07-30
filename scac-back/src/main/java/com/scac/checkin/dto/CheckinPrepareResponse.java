package com.scac.checkin.dto;

import com.scac.ticketusage.entity.TicketUsage;

import lombok.Getter;

@Getter
public class CheckinPrepareResponse {
    private Long userId;
    private Long usageId;
    private String ticketType;
    private Integer remainingTime;

    public CheckinPrepareResponse(
        Long userId,
        Long usageId,
        String ticketType,
        Integer remainingTime
    ){
        this.userId = userId;
        this.usageId = usageId;
        this.ticketType = ticketType;
        this.remainingTime = remainingTime;
    }

    public static CheckinPrepareResponse from(
        TicketUsage ticketUsage
    ){
        return new CheckinPrepareResponse(
            ticketUsage.getUserId(), 
            ticketUsage.getUsageId(), 
            ticketUsage.getTicketType().name(), 
            ticketUsage.getRemainingTime());
    }
}
