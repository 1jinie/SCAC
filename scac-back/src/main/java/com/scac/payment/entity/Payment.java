package com.scac.payment.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.scac.global.enums.PaymentMethod;
import com.scac.global.enums.PaymentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "payment")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "payment_id")
  private Long paymentId;

  @Column(name = "usage_id", nullable = false)
  private Long usageId;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(nullable = false)
  private Integer amount;

  @Enumerated(EnumType.STRING)
  @Column(name = "payment_method", nullable = false, length = 100)
  private PaymentMethod paymentMethod;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 100)
  private PaymentStatus status;

  @Column(name = "paid_at", nullable = false)
  private LocalDateTime paidAt;

  @Column(name = "approval_num", length = 100)
  private String approvalNum;

  @Column(name = "payment_key", length = 100)
  private String paymentKey;

  @Column(name = "cancel_reason", length = 100)
  private String cancelReason;

  @Column(name = "cancelled_at")
  private LocalDate cancelledAt;

  private Payment(
      Long usageId,
      Long userId,
      Integer amount,
      PaymentMethod paymentMethod,
      String approvalNum,
      String paymentKey
  ) {
    this.usageId = usageId;
    this.userId = userId;
    this.amount = amount;
    this.paymentMethod = paymentMethod;
    this.status = PaymentStatus.PAID;
    this.approvalNum = approvalNum;
    this.paymentKey = paymentKey;
  }

  public static Payment create(
      Long usageId,
      Long userId,
      Integer amount,
      PaymentMethod paymentMethod,
      String approvalNum,
      String paymentKey
  ) {
    return new Payment(
        usageId,
        userId,
        amount,
        paymentMethod,
        approvalNum,
        paymentKey
    );
  }

  @PrePersist
  void setPaidAt() {
    if (paidAt == null) {
      paidAt = LocalDateTime.now();
    }
  }

  public void updateStatus(PaymentStatus status) {
    this.status = status;
  }

  public void cancel(String cancelReason) {
    if (status == PaymentStatus.CANCELLED) {
      throw new IllegalStateException("이미 취소된 결제입니다.");
    }

    this.status = PaymentStatus.CANCELLED;
    this.cancelReason = cancelReason;
    this.cancelledAt = LocalDate.now();
  }
}
