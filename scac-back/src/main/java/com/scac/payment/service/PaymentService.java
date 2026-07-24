package com.scac.payment.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.global.exception.ResourceNotFoundException;
import com.scac.payment.dto.PaymentCancelDTO;
import com.scac.payment.dto.PaymentHistoryDTO;
import com.scac.payment.dto.PaymentRequestDTO;
import com.scac.payment.dto.PaymentResDTO;
import com.scac.payment.dto.PaymentStatusUpdateDTO;
import com.scac.payment.entity.Payment;
import com.scac.payment.mapper.PaymentMapper;
import com.scac.payment.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

  private final PaymentRepository paymentRepository;
  private final PaymentMapper paymentMapper;

  @Transactional
  public PaymentResDTO create(PaymentRequestDTO dto) {
    Payment payment = Payment.create(
        dto.getUsageId(),
        dto.getUserId(),
        dto.getAmount(),
        dto.getPaymentMethod(),
        dto.getApprovalNum(),
        dto.getPaymentKey()
    );

    return PaymentResDTO.from(paymentRepository.save(payment));
  }

  public PaymentResDTO findById(Long paymentId) {
    return PaymentResDTO.from(getPayment(paymentId));
  }

  public List<PaymentHistoryDTO> findAll(Long userId) {
    List<PaymentHistoryDTO> payments = userId == null
        ? paymentMapper.findAllPaymentHistory()
        : paymentMapper.findByUserId(userId);

    return payments;
  }

  @Transactional
  public PaymentResDTO updateStatus(
      Long paymentId,
      PaymentStatusUpdateDTO request
  ) {
    Payment payment = getPayment(paymentId);
    payment.updateStatus(request.getStatus());
    return PaymentResDTO.from(payment);
  }

  @Transactional
  public PaymentResDTO cancel(
      Long paymentId,
      PaymentCancelDTO request
  ) {
    Payment payment = getPayment(paymentId);
    payment.cancel(request.getCancelReason());
    return PaymentResDTO.from(payment);
  }

  @Transactional
  public void delete(Long paymentId) {
    Payment payment = getPayment(paymentId);
    paymentRepository.delete(payment);
  }

  private Payment getPayment(Long paymentId) {
    return paymentRepository.findById(paymentId)
        .orElseThrow(() ->  new ResourceNotFoundException(
              "존재하지 않는 결제 내역입니다."
          ));
  }
}
