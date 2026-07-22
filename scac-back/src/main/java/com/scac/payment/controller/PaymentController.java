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

import com.scac.payment.dto.PaymentCancelDTO;
import com.scac.payment.dto.PaymentRequestDTO;
import com.scac.payment.dto.PaymentDTO;
import com.scac.payment.dto.PaymentStatusUpdateDTO;
import com.scac.payment.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

  private final PaymentService paymentService;

  @PostMapping
  public ResponseEntity<PaymentDTO> create(
      @Valid @RequestBody PaymentRequestDTO request
  ) {
    PaymentDTO dto = paymentService.create(request);
    return ResponseEntity
        .created(URI.create("/api/payments/" + dto.getPaymentId()))
        .body(dto);
  }

  @GetMapping("/{paymentId}")
  public PaymentDTO findById(@PathVariable Long paymentId) {
    return paymentService.findById(paymentId);
  }

  @GetMapping
  public List<PaymentDTO> findAll(
      @RequestParam(required = false) Long userId
  ) {
    return paymentService.findAll(userId);
  }

  @PatchMapping("/{paymentId}/status")
  public PaymentDTO updateStatus(
      @PathVariable Long paymentId,
      @Valid @RequestBody PaymentStatusUpdateDTO dto
  ) {
    return paymentService.updateStatus(paymentId, dto);
  }

  @PatchMapping("/{paymentId}/cancel")
  public PaymentDTO cancel(
      @PathVariable Long paymentId,
      @Valid @RequestBody PaymentCancelDTO dto
  ) {
    return paymentService.cancel(paymentId, dto);
  }

  @DeleteMapping("/{paymentId}")
  public ResponseEntity<Void> delete(@PathVariable Long paymentId) {
    paymentService.delete(paymentId);
    return ResponseEntity.noContent().build();
  }
}
