package com.scac.payment.dto;

import java.time.LocalDateTime;

import com.scac.global.enums.PaymentMethod;
import com.scac.global.enums.PaymentStatus;
import com.scac.global.enums.TargetType;
import com.scac.global.enums.TicketType;

import lombok.Getter;
import lombok.Setter;

// 관리자 결제내역 조회용
@Getter
@Setter
public class PaymentHistoryDTO {
  private Long paymentId;
  private Long userId;
  private String phoneNumber;

  private Long usageId;

  private Long ticketId;
  private Long reservationId;
  private Long roomId;

  // COALESCE(t.ticket_name, m.room_name) AS ticket_name 으로 만들어서
  // 이용권이면 ticket_name, 스터디룸이면 room_name이 들어감
  private String ticketName;

  private TargetType targetType;
  private TicketType ticketType;
  private Integer paymentAmount;
  private PaymentMethod paymentMethod;
  private PaymentStatus status;
  private String paymentKey;
  private String approvalNum;
  private LocalDateTime paidAt;
  private String cancelReason;
  private LocalDateTime cancelledAt;
}
