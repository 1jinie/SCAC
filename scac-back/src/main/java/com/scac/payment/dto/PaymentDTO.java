package com.scac.payment.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.scac.payment.entity.Payment;
import com.scac.payment.entity.PaymentMethod;
import com.scac.payment.entity.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentDTO {
    private final Long paymentId;
    private final Long usageId;
    private final Long userId;
    private final Integer amount;
    private final PaymentMethod paymentMethod;
    private final PaymentStatus status;
    private final LocalDateTime paidAt;
    private final String approvalNum;
    private final String paymentKey;
    private final String cancelReason;
    private final LocalDate cancelledAt;

  // Payment 엔티티를 PaymentDTO로 변환하는 메서드
  public static PaymentDTO from(Payment payment) {
    return new PaymentDTO(
        payment.getPaymentId(),
        payment.getUsageId(),
        payment.getUserId(),
        payment.getAmount(),
        payment.getPaymentMethod(),
        payment.getStatus(),
        payment.getPaidAt(),
        payment.getApprovalNum(),
        payment.getPaymentKey(),
        payment.getCancelReason(),
        payment.getCancelledAt()
    );
  }
}
