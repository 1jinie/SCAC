package com.scac.payment.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.scac.global.enums.PaymentMethod;
import com.scac.global.enums.PaymentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "payment_table")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "payment_id")
  private Long paymentId;

  // 토스 페이먼트 연동용 id
  @Column(name = "order_id", nullable = false, unique = true, length = 64)
  private String orderId = "SCAC-" + UUID.randomUUID();

  @Column(name = "usage_id")
  private Long usageId;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "ticket_id", nullable = false)
  private Long ticketId;

  @Column(nullable = false)
  private Integer amount;

  @Enumerated(EnumType.STRING)
  @Column(name = "payment_method", nullable = false, length = 100)
  private PaymentMethod paymentMethod;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 100)
  private PaymentStatus status;

  @Column(name = "paid_at")
  private LocalDateTime paidAt;

  @Column(name = "approval_num", length = 100)
  private String approvalNum;

  @Column(name = "payment_key", length = 200)
  private String paymentKey;

  @Column(name = "cancel_reason", length = 200)
  private String cancelReason;

  @Column(name = "cancelled_at")
  private LocalDate cancelledAt;

  private Payment(Long userId, Long ticketId, Integer amount, PaymentMethod paymentMethod) {
    this.usageId = null;
    this.userId = userId;
    this.ticketId = ticketId;
    this.amount = amount;
    this.paymentMethod = paymentMethod;
    this.status = PaymentStatus.PENDING;
  }

  // 결제데이터 생성
  public static Payment create(Long userId, Long ticketId, Integer amount,
      PaymentMethod paymentMethod) {
    return new Payment(userId, ticketId, amount, paymentMethod);
  }

  // 결제 취소
  public void cancel(String cancelReason) {
    if (status == PaymentStatus.CANCELED) {
      throw new IllegalStateException("이미 취소된 결제입니다.");
    }

    if (status != PaymentStatus.PAID) {
      throw new IllegalStateException("결제 완료 상태에서만 취소할 수 있습니다.");
    }

    if (cancelReason == null || cancelReason.isBlank()) {
      throw new IllegalArgumentException("결제 취소 사유는 필수입니다.");
    }

    if (cancelReason.length() > 200) {
      throw new IllegalArgumentException("결제 취소 사유는 200자 이하여야 합니다.");
    }

    this.status = PaymentStatus.CANCELED;
    this.cancelReason = cancelReason;
    this.cancelledAt = LocalDate.now();
  }

  // 결제 완료 후 usageId 할당
  public void assignUsage(Long usageId) {
    if (usageId == null) {
      throw new IllegalArgumentException("사용자 이용권 ID는 필수입니다.");
    }

    if (this.usageId != null) {
      throw new IllegalStateException("이미 사용자 이용권이 연결된 결제입니다.");
    }

    this.usageId = usageId;
  }

  // 토스 페이먼트 승인 성공 시 결체 데이터에 추가 데이터 할당
  public void approve(String paymentKey, String approvalNum, LocalDateTime paidAt) {
    if (status != PaymentStatus.PENDING) {
      throw new IllegalStateException("결제 대기 상태에서만 승인할 수 있습니다.");
    }

    this.paymentKey = paymentKey;
    this.approvalNum = approvalNum;
    this.paidAt = paidAt != null ? paidAt : LocalDateTime.now();
    this.status = PaymentStatus.PAID;
  }

  // 일반 카드 결제 Mock 승인
  public void approveMock(String approvalNum2, LocalDateTime paidAt) {
    this.status = PaymentStatus.PAID;
    this.approvalNum = approvalNum2;
    this.paidAt = paidAt;
  }
}
