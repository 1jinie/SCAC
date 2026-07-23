package com.scac.ticketusage.dto;

import java.time.LocalDateTime;

import com.scac.ticketusage.domain.TicketUsage;

import lombok.Getter;

@Getter
public class TicketUsageResponse {
    private Long usageId;
    private Long seatId;
    private Long ticketId;
    private String status;
    private LocalDateTime startAt;
    private LocalDateTime endAt;


    private TicketUsageResponse(TicketUsage usage) {
        this.usageId = usage.getUsageId();
        this.seatId = usage.getSeatId();
        this.ticketId = usage.getTicketId();
        this.status = usage.getStatus().name();
        this.startAt = usage.getStartAt();
        this.endAt = usage.getEndAt();
    }


    public static TicketUsageResponse from(TicketUsage usage) {
        return new TicketUsageResponse(usage);
    }
}
