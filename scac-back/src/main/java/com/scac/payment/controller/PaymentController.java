package com.scac.payment.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scac.global.response.ApiResponse;
import com.scac.payment.dto.PaymentCancelDTO;
import com.scac.payment.dto.PaymentConfirmDTO;
import com.scac.payment.dto.PaymentHistoryDTO;
import com.scac.payment.dto.PaymentRequestDTO;
import com.scac.payment.dto.PaymentResDTO;
import com.scac.payment.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

  private final PaymentService paymentService;

  // 결제 요청
  @PostMapping
  public ResponseEntity<ApiResponse<PaymentResDTO>> create(
      @Valid @RequestBody PaymentRequestDTO form
  ) {
    PaymentResDTO payment = paymentService.create(form);

    return ResponseEntity
        .created(URI.create(
            "/api/payments/" + payment.getPaymentId()
        ))
        .body(ApiResponse.success(
            "결제를 요청을 생성했습니다.",
            payment
        ));
  }

  // 결제 승인
    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<PaymentResDTO>> confirm(
        @Valid @RequestBody PaymentConfirmDTO form
    ) {
    PaymentResDTO payment = paymentService.confirm(form);

    return ResponseEntity.ok(
        ApiResponse.success(
            "결제 승인을 완료했습니다.",
            payment
        )
    );
    }

  // 특정 결제내역 조회
  @GetMapping("/{paymentId}")
  public ResponseEntity<ApiResponse<PaymentResDTO>> findById(
      @PathVariable("paymentId") Long paymentId
  ) {
    PaymentResDTO payment = paymentService.findById(paymentId);

    return ResponseEntity.ok(
        ApiResponse.success(
            "결제 내역 조회를 완료했습니다.",
            payment
        )
    );
  }

  // 모든 결제내역 조회
  @GetMapping
  public ResponseEntity<ApiResponse<List<PaymentHistoryDTO>>> findAll(
      @RequestParam(name = "userId", required = false) Long userId
  ) {
    List<PaymentHistoryDTO> payments = paymentService.findAll(userId);

    return ResponseEntity.ok(
        ApiResponse.success(
            "결제 내역 목록 조회를 완료했습니다.",
            payments
        )
    );
  }

  // 결제 취소
  @PatchMapping("/{paymentId}/cancel")
  public ResponseEntity<ApiResponse<PaymentResDTO>> cancel(
      @PathVariable("paymentId") Long paymentId,
      @Valid @RequestBody PaymentCancelDTO form
  ) {
    PaymentResDTO payment =
        paymentService.cancel(paymentId, form);

    return ResponseEntity.ok(
        ApiResponse.success(
            "결제 취소를 완료했습니다.",
            payment
        )
    );
  }

  // 결제내역 삭제
  @DeleteMapping("/{paymentId}")
  public ResponseEntity<ApiResponse<Void>> delete(
      @PathVariable("paymentId") Long paymentId
  ) {
    paymentService.delete(paymentId);

    return ResponseEntity.ok(
        ApiResponse.success(
            "결제 내역 삭제를 완료했습니다."
        )
    );
  }

  
}