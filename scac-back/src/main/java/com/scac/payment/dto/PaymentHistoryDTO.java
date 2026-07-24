package com.scac.payment.dto;

import java.time.LocalDateTime;

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
  private String ticketName;
  private String targetType;
  private String ticketType;
  private Integer paymentAmount;
  private String paymentMethod;
  private String status;
  private String paymentKey;
  private String approvalNum;
  private LocalDateTime paidAt;
  private String cancelReason;
  private LocalDateTime cancelledAt;
}
