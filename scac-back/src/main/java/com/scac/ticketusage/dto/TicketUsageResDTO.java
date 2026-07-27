package com.scac.ticketusage.dto;

import java.time.LocalDateTime;

import com.scac.global.enums.TicketType;
import com.scac.global.enums.TicketUsageStatus;
import com.scac.ticketusage.entity.TicketUsage;

import lombok.Getter;

@Getter
public class TicketUsageResDTO {

  private final Long usageId;
  private final Long userId;
  private final Long ticketId;
  private final TicketType ticketType;
  private final Integer remainingTime;
  private final TicketUsageStatus usageStatus;
  private final LocalDateTime startAt;
  private final LocalDateTime endAt;
  private final LocalDateTime createdAt;

  private TicketUsageResDTO(TicketUsage ticketUsage) {
    this.usageId = ticketUsage.getUsageId();
    this.userId = ticketUsage.getUserId();
    this.ticketId = ticketUsage.getTicketId();
    this.ticketType = ticketUsage.getTicketType();
    this.remainingTime = ticketUsage.getRemainingTime();
    this.usageStatus = ticketUsage.getStatus();
    this.startAt = ticketUsage.getStartAt();
    this.endAt = ticketUsage.getEndAt();
    this.createdAt = ticketUsage.getCreatedAt();
  }

  public static TicketUsageResDTO from(TicketUsage ticketUsage) {
    return new TicketUsageResDTO(ticketUsage);
  }
}