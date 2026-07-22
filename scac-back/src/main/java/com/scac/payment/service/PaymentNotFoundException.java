package com.scac.payment.service;

public class PaymentNotFoundException extends RuntimeException {

  public PaymentNotFoundException(Long paymentId) {
    super("결제 내역을 찾을 수 없습니다. paymentId=" + paymentId);
  }
}
