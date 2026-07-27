package com.scac.payment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.payment.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

  List<Payment> findAllByOrderByPaidAtDesc();

  List<Payment> findByUserIdOrderByPaidAtDesc(Long userId);

  Optional<Payment> findByOrderId(String orderId);
}
