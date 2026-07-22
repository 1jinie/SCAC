package com.scac.payment.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.payment.dto.PaymentCancelDTO;
import com.scac.payment.dto.PaymentRequestDTO;
import com.scac.payment.dto.PaymentDTO;
import com.scac.payment.dto.PaymentStatusUpdateDTO;
import com.scac.payment.entity.Payment;
import com.scac.payment.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

  private final PaymentRepository paymentRepository;

  @Transactional
  public PaymentDTO create(PaymentRequestDTO dto) {
    Payment payment = Payment.create(
        dto.getUsageId(),
        dto.getUserId(),
        dto.getAmount(),
        dto.getPaymentMethod(),
        dto.getApprovalNum(),
        dto.getPaymentKey()
    );

    return PaymentDTO.from(paymentRepository.save(payment));
  }

  public PaymentDTO findById(Long paymentId) {
    return PaymentDTO.from(getPayment(paymentId));
  }

  public List<PaymentDTO> findAll(Long userId) {
    List<Payment> payments = userId == null
        ? paymentRepository.findAllByOrderByPaidAtDesc()
        : paymentRepository.findByUserIdOrderByPaidAtDesc(userId);

    return payments.stream()
        .map(payment -> PaymentDTO.from(payment))
        .toList();
  }

  @Transactional
  public PaymentDTO updateStatus(
      Long paymentId,
      PaymentStatusUpdateDTO request
  ) {
    Payment payment = getPayment(paymentId);
    payment.updateStatus(request.getStatus());
    return PaymentDTO.from(payment);
  }

  @Transactional
  public PaymentDTO cancel(
      Long paymentId,
      PaymentCancelDTO request
  ) {
    Payment payment = getPayment(paymentId);
    payment.cancel(request.getCancelReason());
    return PaymentDTO.from(payment);
  }

  @Transactional
  public void delete(Long paymentId) {
    Payment payment = getPayment(paymentId);
    paymentRepository.delete(payment);
  }

  private Payment getPayment(Long paymentId) {
    return paymentRepository.findById(paymentId)
        .orElseThrow(() -> new PaymentNotFoundException(paymentId));
  }
}
