package com.scac.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scac.global.response.ApiResponse;
import com.scac.payment.dto.PaymentCancelDTO;
import com.scac.payment.dto.PaymentHistoryDTO;
import com.scac.payment.dto.PaymentResDTO;
import com.scac.payment.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
public class AdminPaymentController {

  private final PaymentService paymentService;

  // 관리자
  // 특정 결제내역 조회
  @GetMapping("/{paymentId}")
  public ResponseEntity<ApiResponse<PaymentResDTO>> findById(@PathVariable("paymentId") Long paymentId) {
    PaymentResDTO payment = paymentService.findById(paymentId);

    return ResponseEntity.ok(ApiResponse.success("결제 내역 조회를 완료했습니다.", payment));
  }

  // 전체 결제내역 조회
  @GetMapping
  public ResponseEntity<ApiResponse<List<PaymentHistoryDTO>>> findAll(
      @RequestParam(name = "userId", required = false) Long userId) {
    List<PaymentHistoryDTO> payments = paymentService.findAll(userId);

    return ResponseEntity.ok(ApiResponse.success("결제 내역 목록 조회를 완료했습니다.", payments));
  }

  // 결제 취소
  @PatchMapping("/{paymentId}/cancel")
  public ResponseEntity<ApiResponse<PaymentResDTO>> cancel(@PathVariable("paymentId") Long paymentId,
      @Valid @RequestBody PaymentCancelDTO form) {
    PaymentResDTO payment = paymentService.cancel(paymentId, form);

    return ResponseEntity.ok(ApiResponse.success("결제 취소를 완료했습니다.", payment));
  }

  // 결제내역 삭제
  @DeleteMapping("/{paymentId}")
  public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("paymentId") Long paymentId) {
    paymentService.delete(paymentId);

    return ResponseEntity.ok(ApiResponse.success("결제 내역 삭제를 완료했습니다."));
  }
}
