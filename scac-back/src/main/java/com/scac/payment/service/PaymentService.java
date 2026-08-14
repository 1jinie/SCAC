package com.scac.payment.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.global.enums.PaymentMethod;
import com.scac.global.enums.PaymentStatus;
import com.scac.global.enums.ReservationStatus;
import com.scac.global.enums.TicketUsageStatus;
import com.scac.global.exception.ResourceNotFoundException;
import com.scac.meetingroom.domain.MeetingRoomReservation;
import com.scac.meetingroom.dto.ReservationPaymentInfoDTO;
import com.scac.meetingroom.service.MeetingRoomReservationService;
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
  private final MeetingRoomReservationService meetingRoomReservationService;

  // 공통 메서드 -----------------------------------------------
  // id로 paymentDTO 가져오기
  public PaymentResDTO findById(Long paymentId) {
    return PaymentResDTO.from(getPayment(paymentId));
  }

  // id로 Payment 찾기
  private Payment getPayment(Long paymentId) {
    return paymentRepository.findById(paymentId)
      .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 결제 내역입니다."));
  }

  // TicketId나 ReservationId 둘 중 하나는 반드시 존재하는지 확인
  private void validationTicketIdOrReservationId(PaymentRequestDTO dto) {

    if (dto.getTicketId() == null && dto.getReservationId() == null) {
      throw new IllegalArgumentException("결제 대상 정보가 없습니다.");
    }
    if (dto.getTicketId() != null && dto.getReservationId() != null) {
      throw new IllegalArgumentException("이용권과 예약을 동시에 결제할 수 없습니다.");
    }
  }

  // 키오스크 사용자관련 메서드 -----------------------------------------------
  // 결제 소유자 검증
  private void validatePaymentOwner(Payment payment, Long currentUserId) {
    if (!Objects.equals(payment.getUserId(), currentUserId)) {
      throw new AccessDeniedException("본인의 결제만 처리할 수 있습니다.");
    }
  }

  // 결제 수단 검증
  private void validateTossPaymentMethod(Payment payment) {
    if (payment.getPaymentMethod() != PaymentMethod.TOSSPAY) {
      throw new IllegalStateException("토스 결제 승인 대상이 아닌 결제수단입니다.");
    }
  }

  // 결제 성공 후 Usage 발급 및 예약확인처리
  private void handlePaymentSuccess(Payment payment) {
    TicketUsageResDTO usage;
    if (payment.getTicketId() != null) {
      usage = ticketUsageService.issueTicket(payment.getUserId(), payment.getTicketId());
    } else if (payment.getReservationId() != null) {
      usage = ticketUsageService.issueReservation(payment.getUserId(), payment.getReservationId());
      meetingRoomReservationService.confirmReservation(payment.getReservationId());
    } else {
      throw new IllegalStateException("결제 대상 정보가 존재하지 않습니다.");
    }
    payment.assignUsage(usage.getUsageId());
  }

  // 결제 요청
  @Transactional
  public PaymentResDTO create(PaymentRequestDTO dto, Long currentUserId) {

    // TicketId와 ReservationId 둘 중 하나는 반드시 있는지 검증
    validationTicketIdOrReservationId(dto);

    Payment payment;

    // TicketId 결제 (좌석 이용권)
    if (dto.getTicketId() != null) {
      Ticket ticket = ticketService.findTicket(dto.getTicketId());
      if (!ticket.isActive()) {
        throw new IllegalArgumentException("판매 중인 이용권이 아닙니다.");
      }

      if (!ticket.getTicketPrice().equals(dto.getAmount())) {
        throw new IllegalArgumentException("결제 금액이 이용권 가격과 일치하지 않습니다.");
      }
      payment = Payment.createTicketPayment(currentUserId, ticket.getTicketId(), ticket.getTicketPrice(),
        dto.getPaymentMethod());
    } else {

      // ReservationId 결제 (스터디룸 예약)
      ReservationPaymentInfoDTO reservation = meetingRoomReservationService
        .getPaymentInfo(dto.getReservationId());

      // 본인의 예약인지 검증
      if (!Objects.equals(reservation.getUserId(), currentUserId)) {
        throw new AccessDeniedException("본인의 예약만 결제할 수 있습니다.");
      }
      // 예약 상태가 PENDING_PAYMENT인지 검증
      if (reservation.getStatus() != ReservationStatus.PENDING_PAYMENT) {
        throw new IllegalStateException("결제 대기 중인 예약만 결제할 수 있습니다.");
      }

      // 이미 결제가 생성된 예약인지 검증
      if (paymentRepository.existsByReservationId(reservation.getReservationId())) {
        throw new IllegalStateException("이미 결제가 생성된 예약입니다.");
      }

      // 프론트에서 전달한 금액과 실제 예약 금액 비교
      if (!reservation.getAmount().equals(dto.getAmount())) {
        throw new IllegalArgumentException("결제 금액이 예약 금액과 일치하지 않습니다.");
      }
      payment = Payment.createReservationPayment(currentUserId, reservation.getReservationId(),
        reservation.getAmount(), dto.getPaymentMethod());
    }

    // 아직 결제가 완료되지 않았으므로 결제 상태는 PENDING으로 설정됩니다.
    // 또한 paid_at, usage_id는 결제 승인 후에 데이터가 입력되므로 요청단계에선 null로 초기화됩니다.
    paymentRepository.save(payment);

    return PaymentResDTO.from(payment);
  }

  // 토스 결제 확인
  @Transactional
  public PaymentResDTO confirm(PaymentConfirmDTO request, Long currentUserId) {
    Payment payment = paymentRepository.findByOrderId(request.getOrderId())
      .orElseThrow(() -> new ResourceNotFoundException("주문 정보를 찾을 수 없습니다."));

    validatePaymentOwner(payment, currentUserId);
    validateTossPaymentMethod(payment);

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

    handlePaymentSuccess(payment);
    return PaymentResDTO.from(payment);
  }

  // 일반 카드 결제 Mock 승인
  @Transactional
  public PaymentResDTO mockConfirm(Long paymentId, Long currentUserId) {
    Payment payment = getPayment(paymentId);

    validatePaymentOwner(payment, currentUserId);

    if (payment.getStatus() != PaymentStatus.PENDING) {
      throw new IllegalArgumentException("승인 대기 중인 결제만 처리할 수 있습니다");
    }
    if (payment.getPaymentMethod() != PaymentMethod.CARD) {
      throw new IllegalArgumentException("카드 결제만 Mock 승인할 수 있습니다.");
    }
    String approvalNum = "MOCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

    payment.approveMock(approvalNum, LocalDateTime.now());

    handlePaymentSuccess(payment);

    return PaymentResDTO.from(payment);
  }

  // 사용자 결제내역 조회
  public PaymentResDTO findMyPayment(Long paymentId, Long id) {
    Payment payment = getPayment(paymentId);
    validatePaymentOwner(payment, id);
    return PaymentResDTO.from(payment);
  }

  // 관리자 결제내역 관리 관련 메서드 -----------------------------------------------
  // 추후 Admin 연결시 관리자 권한 검증 추가
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
    cancelReason = cancelReason.trim();
    if (payment.getUsageId() == null) {
      throw new IllegalStateException("결제에 연결된 이용권 정보가 없습니다.");
    }
    TicketUsage ticketUsage = ticketUsageService.findTicketUsage(payment.getUsageId());
    validateTicketUsageCancel(ticketUsage);

    if (payment.getReservationId() != null) {
      MeetingRoomReservation reservation = meetingRoomReservationService
        .getReservationEntity(payment.getReservationId());

      if (reservation.getStatus() != ReservationStatus.CONFIRMED) {
        throw new IllegalStateException("예약 완료 상태에서만 결제를 취소할 수 있습니다.");
      }
    }
    switch (payment.getPaymentMethod()) {
      case CARD -> cancelMockCard(payment, cancelReason);
      case TOSSPAY -> cancelTossPayment(payment, cancelReason);
      default -> throw new IllegalStateException("지원하지 않는 결제 수단입니다.");
    }
    ticketUsageService.cancel(payment.getUsageId());

    // 예약 결제 취소 시 예약 상태를 CANCELED로 변경
    if (payment.getReservationId() != null) {
      meetingRoomReservationService.cancel(payment.getReservationId());
    }
    return PaymentResDTO.from(payment);
  }

  // 결제내역 삭제
  @Transactional
  public void delete(Long paymentId) {
    Payment payment = getPayment(paymentId);
    paymentRepository.delete(payment);
  }

  // 대시보드용 당일 매출액 집계 메서드
  public long getTodayRevenue() {
    LocalDate today = LocalDate.now();
    LocalDateTime startOfDay = today.atStartOfDay(); // 오늘 00:00:00
    LocalDateTime endOfDay = today.atTime(LocalTime.MAX); // 오늘 23:59:59.999999999

    Long revenue = paymentRepository.sumTodayRevenue(PaymentStatus.PAID, startOfDay, endOfDay);

    return revenue != null ? revenue : 0L;
  }

}