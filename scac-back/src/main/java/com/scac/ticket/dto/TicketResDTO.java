package com.scac.ticket.dto;

import java.time.LocalDateTime;

import com.scac.global.enums.TargetType;
import com.scac.global.enums.TicketType;
import com.scac.ticket.entity.Ticket;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TicketResDTO {

    private final Long ticketId;
    private final String ticketName;
    private final TicketType ticketType;
    private final Integer ticketTime;
    private final Integer ticketPrice;
    private final Integer validDays;
    private final Boolean isActive;
    private final TargetType targetType;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    // Ticket 엔티티를 TicketResDTO로 변환하는 메서드
    public static TicketResDTO from(Ticket ticket) {
        return new TicketResDTO(ticket.getTicketId(), ticket.getTicketName(), ticket.getTicketType(),
            ticket.getTicketTime(), ticket.getValidDays(), ticket.getTicketPrice(), ticket.isActive(),
            ticket.getTargetType(), ticket.getCreatedAt(), ticket.getUpdatedAt());

    }
}
