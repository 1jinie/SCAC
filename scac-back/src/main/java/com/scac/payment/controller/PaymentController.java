package com.scac.payment.controller;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.auth.jwt.UserPrincipal;
import com.scac.global.response.ApiResponse;
import com.scac.payment.dto.PaymentConfirmDTO;
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

    // 키오스크
    // 결제 요청
    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResDTO>> create(@Valid @RequestBody PaymentRequestDTO form,
        @AuthenticationPrincipal UserPrincipal currentUser) {
        PaymentResDTO payment = paymentService.create(form, currentUser.id());

        return ResponseEntity.created(URI.create("/api/payments/" + payment.getPaymentId()))
            .body(ApiResponse.success("결제 요청을 생성했습니다.", payment));
    }

    // 결제 승인
    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<PaymentResDTO>> confirm(@Valid @RequestBody PaymentConfirmDTO form,
        @AuthenticationPrincipal UserPrincipal currentUser) {
        PaymentResDTO payment = paymentService.confirm(form, currentUser.id());

        return ResponseEntity.ok(ApiResponse.success("결제 승인을 완료했습니다.", payment));
    }

    // 일반결제 모크 승인
    @PostMapping("/{paymentId}/mock-confirm")
    public ResponseEntity<ApiResponse<PaymentResDTO>> mockConfirm(@PathVariable("paymentId") Long paymentId,
        @AuthenticationPrincipal UserPrincipal currentUser) {
        PaymentResDTO payment = paymentService.mockConfirm(paymentId, currentUser.id());
        return ResponseEntity.ok(ApiResponse.success("Mock 카드 결제가 승인되었습니다.", payment));
    }

    // 결제 내역 조회
    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResDTO>> findMyPayment(@PathVariable("paymentId") Long paymentId,
        @AuthenticationPrincipal UserPrincipal currentUser) {
        PaymentResDTO payment = paymentService.findMyPayment(paymentId, currentUser.id());

        return ResponseEntity.ok(ApiResponse.success("결제 내역 조회를 완료했습니다.", payment));
    }

    // 스터디룸 예약 결제 요청
    // @PostMapping("/reservation")
    // public ResponseEntity<ApiResponse<PaymentResDTO>> createReservationPayment(
    // @Valid @RequestBody MeetingRoomReservationRequest form, @RequestBody
    // PaymentMethod paymentMethod,
    // @AuthenticationPrincipal UserPrincipal currentUser) {
    // PaymentResDTO payment = paymentService.createReservationPayment2(form,
    // currentUser.id(),
    // paymentMethod);

    // return ResponseEntity.created(URI.create("/api/payments/" +
    // payment.getPaymentId()))
    // .body(ApiResponse.success("스터디룸 예약 결제 요청을 생성했습니다.", payment));
    // }

}