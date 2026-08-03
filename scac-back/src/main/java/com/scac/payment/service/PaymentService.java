package com.scac.payment.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.global.enums.PaymentMethod;
import com.scac.global.enums.PaymentStatus;
import com.scac.global.enums.TicketUsageStatus;
import com.scac.global.exception.ResourceNotFoundException;
import com.scac.payment.client.TossPaymentClient;
import com.scac.payment.dto.PaymentCancelDTO;
import com.scac.payment.dto.PaymentConfirmDTO;
import com.scac.payment.dto.PaymentHistoryDTO;
import com.scac.payment.dto.PaymentRequestDTO;
import com.scac.payment.dto.PaymentResDTO;
import com.scac.payment.dto.TossPaymentResponse;
import com.scac.payment.entity.Payment;
import com.scac.payment.mapper.PaymentMapper;
import com.scac.payment.repository.PaymentRepository;
import com.scac.ticket.entity.Ticket;
import com.scac.ticket.service.TicketService;
import com.scac.ticketusage.dto.TicketUsageResDTO;
import com.scac.ticketusage.entity.TicketUsage;
import com.scac.ticketusage.service.TicketUsageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

  private final PaymentRepository paymentRepository;
  private final PaymentMapper paymentMapper;
  private final TicketService ticketService;
  private final TicketUsageService ticketUsageService;
  private final TossPaymentClient tossPaymentClient;

  // id로 Payment 찾기
  private Payment getPayment(Long paymentId) {
    return paymentRepository.findById(paymentId)
      .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 결제 내역입니다."));
  }

  // 결제 요청
  @Transactional
  public PaymentResDTO create(PaymentRequestDTO dto) {
    Ticket ticket = ticketService.findTicket(dto.getTicketId());

    if (!ticket.isActive()) {
      throw new IllegalArgumentException("판매 중인 이용권이 아닙니다.");
    }

    if (!ticket.getTicketPrice().equals(dto.getAmount())) {
      throw new IllegalArgumentException("결제 금액이 이용권 가격과 일치하지 않습니다.");
    }

    Payment payment = Payment.create(

      dto.getUserId(), ticket.getTicketId(), ticket.getTicketPrice(), dto.getPaymentMethod()

    );

    paymentRepository.save(payment);

    // 기존 이용권 발급 코드
    // TicketUsageResDTO ticketUsage =
    // ticketUsageService.issue(dto.getUserId(), dto.getTicketId());

    // payment.assignUsage(ticketUsage.getUsageId());

    return PaymentResDTO.from(payment);
  }

  // id로 paymentDTO 가져오기
  public PaymentResDTO findById(Long paymentId) {
    return PaymentResDTO.from(getPayment(paymentId));
  }

  // 모든 결제내역 가져오기
  public List<PaymentHistoryDTO> findAll(Long userId) {
    List<PaymentHistoryDTO> payments = userId == null ? paymentMapper.findAllPaymentHistory()
      : paymentMapper.findByUserId(userId);

    return payments;
  }

  // 결제 취소 유효성 검사
  private void validateCancel(Payment payment, String cancelReason) {
    if (payment.getStatus() != PaymentStatus.PAID) {
      throw new IllegalStateException("결제 완료 상태에서만 취소할 수 있습니다.");
    }

    if (cancelReason == null || cancelReason.isBlank()) {
      throw new IllegalArgumentException("결제 취소 사유는 필수입니다.");
    }
    if (cancelReason.length() > 200) {
      throw new IllegalArgumentException("결제 취소 사유는 200자 이하여야 합니다.");
    }
  }

  // 결제 취소 이용권 유효성 검사
  private void validateTicketUsageCancel(TicketUsage ticketUsage) {
    if (ticketUsage.getStatus() != TicketUsageStatus.READY) {
      throw new IllegalStateException("사용하지 않은 이용권만 결제 취소할 수 있습니다");
    }
  }

  // Mock 카드 결제 취소
  private void cancelMockCard(Payment payment, String cancelReason) {
    payment.cancel(cancelReason);
  }

  // Toss 페이 결제 취소
  private void cancelTossPayment(Payment payment, String cancelReason) {
    if (payment.getPaymentKey() == null || payment.getPaymentKey().isBlank()) {
      throw new IllegalStateException("토스 결제 키가 존재하지 않습니다.");
    }
    TossPaymentResponse tossResponse = tossPaymentClient.cancel(payment.getPaymentKey(), cancelReason);

    if (!"CANCELED".equals(tossResponse.getStatus())) {
      throw new IllegalStateException("결제가 정상적으로 취소되지 않았습니다.");
    }

    if (!payment.getPaymentKey().equals(tossResponse.getPaymentKey())) {
      throw new IllegalStateException("토스 취소 결과가 결제 정보와 일치하지 않습니다.");
    }

    payment.cancel(cancelReason);
  }

  // 결제 취소
  @Transactional
  public PaymentResDTO cancel(Long paymentId, PaymentCancelDTO form) {
    Payment payment = getPayment(paymentId);
    String cancelReason = form.getCancelReason();
    validateCancel(payment, cancelReason);
    if (payment.getUsageId() == null) {
      throw new IllegalStateException("결제에 연결된 이용권 정보가 없습니다.");
    }
    TicketUsage ticketUsage = ticketUsageService.findTicketUsage(payment.getUsageId());
    validateTicketUsageCancel(ticketUsage);

    switch (payment.getPaymentMethod()) {
      case CARD -> cancelMockCard(payment, cancelReason);
      case TOSSPAY, KAKAOPAY -> cancelTossPayment(payment, cancelReason);
      case NAVERPAY -> throw new IllegalStateException("현재 네이버페이 결제 취소는 지원하지 않습니다");

    }
    ticketUsageService.cancel(payment.getUsageId());
    return PaymentResDTO.from(payment);
  }

  // 결제내역 삭제
  @Transactional
  public void delete(Long paymentId) {
    Payment payment = getPayment(paymentId);
    paymentRepository.delete(payment);
  }

  // 토스 결제 확인
  @Transactional
  public PaymentResDTO confirm(PaymentConfirmDTO request) {
    Payment payment = paymentRepository.findByOrderId(request.getOrderId())
      .orElseThrow(() -> new ResourceNotFoundException("주문 정보를 찾을 수 없습니다."));

    if (payment.getStatus() != PaymentStatus.PENDING) {
      throw new IllegalStateException("결제 대기 상태의 주문만 승인할 수 있습니다.");
    }

    if (!payment.getAmount().equals(request.getAmount())) {
      throw new IllegalArgumentException("주문 금액과 승인 요청 금액이 일치하지 않습니다.");
    }

    TossPaymentResponse tossResponse = tossPaymentClient.confirm(request.getPaymentKey(),
      request.getOrderId(), request.getAmount());

    if (!"DONE".equals(tossResponse.getStatus())) {
      throw new IllegalStateException("결제가 정상적으로 승인되지 않았습니다.");
    }

    if (!payment.getOrderId().equals(tossResponse.getOrderId())
      || !payment.getAmount().equals(tossResponse.getTotalAmount())) {
      throw new IllegalStateException("토스 승인 결과가 주문 정보와 일치하지 않습니다.");
    }

    payment.approve(tossResponse.getPaymentKey(), tossResponse.getApproveNo(),
      tossResponse.getApprovedAt() != null ? tossResponse.getApprovedAt().toLocalDateTime() : null);

    TicketUsageResDTO ticketUsage = ticketUsageService.issue(payment.getUserId(), payment.getTicketId());

    payment.assignUsage(ticketUsage.getUsageId());

    return PaymentResDTO.from(payment);
  }

  // 일반 카드 결제 Mock 승인
  @Transactional
  public PaymentResDTO mockConfirm(Long paymentId) {
    Payment payment = getPayment(paymentId);

    if (payment.getStatus() != PaymentStatus.PENDING) {
      throw new IllegalArgumentException("승인 대기 중인 결제만 처리할 수 있습니다");
    }
    if (payment.getPaymentMethod() != PaymentMethod.CARD) {
      throw new IllegalArgumentException("카드 결제만 Mock 승인할 수 있습니다.");
    }
    String approvalNum = "MOCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

    payment.approveMock(approvalNum, LocalDateTime.now());

    TicketUsageResDTO ticketUsage = ticketUsageService.issue(payment.getUserId(), payment.getTicketId());
    payment.assignUsage(ticketUsage.getUsageId());

    return PaymentResDTO.from(payment);
  }

  // ==========================================
    // 💡 [관리자 대시보드 연동] 금일 누적 매출액 집계
    // ==========================================
    public long getTodayRevenue() {
        LocalDateTime startOfToday = java.time.LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday = java.time.LocalDate.now().atTime(java.time.LocalTime.MAX);

        return paymentRepository.findAll().stream()
            .filter(payment -> payment.getStatus() == PaymentStatus.PAID)
            .filter(payment -> payment.getPaidAt() != null && 
                    !payment.getPaidAt().isBefore(startOfToday) && 
                    !payment.getPaidAt().isAfter(endOfToday))
            .mapToLong(Payment::getAmount)
            .sum();
    }
}
