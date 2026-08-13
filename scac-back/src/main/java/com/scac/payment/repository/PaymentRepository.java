package com.scac.payment.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.scac.global.enums.PaymentStatus;
import com.scac.payment.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

  List<Payment> findAllByOrderByPaidAtDesc();

  List<Payment> findByUserIdOrderByPaidAtDesc(Long userId);

  Optional<Payment> findByOrderId(String orderId);

  @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p " +
      "WHERE p.status = :status " +
      "AND p.paidAt BETWEEN :startOfDay AND :endOfDay")
  Long sumTodayRevenue(
      @Param("status") PaymentStatus status,
      @Param("startOfDay") LocalDateTime startOfDay,
      @Param("endOfDay") LocalDateTime endOfDay);

  boolean existsByReservationId(Long reservationId);
}
