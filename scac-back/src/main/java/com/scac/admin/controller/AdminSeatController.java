package com.scac.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.admin.dto.request.SeatStatusRequest;
import com.scac.global.response.ApiResponse;
import com.scac.seat.dto.SeatUserInfoRes;
import com.scac.seat.service.SeatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/seats")
public class AdminSeatController {

        private final SeatService seatService;

        /**
         * 1. 좌석 사용자 조회 (전화번호 등 개인정보 포함)
         */
        @GetMapping("/{seatId}/user")
        public ResponseEntity<ApiResponse<SeatUserInfoRes>> getSeatUser(
                @PathVariable(name = "seatId") Long seatId) {
                return ResponseEntity
                        .ok(ApiResponse.success("현재 좌석 이용자 조회를 완료했습니다.", seatService.getCurrentUser(seatId)));
        }

        /**
         * 2. 좌석 상태 수동 변경 (점검중/사용가능 등)
         */
        @PatchMapping("/{seatId}/status")
        public ResponseEntity<ApiResponse<Void>> updateSeatStatus(@PathVariable(name = "seatId") Long seatId,
                @Valid @RequestBody SeatStatusRequest request) {
                seatService.updateStatus(seatId, request.getStatus());
                return ResponseEntity.ok(ApiResponse.success("좌석 상태 변경이 완료되었습니다."));
        }

        /**
         * 3. 강제 퇴실 조치
         */
        @PostMapping("/{seatId}/force-checkout")
        public ResponseEntity<ApiResponse<Void>> forceCheckout(@PathVariable(name = "seatId") Long seatId) {
                seatService.forceCheckout(seatId);
                return ResponseEntity.ok(ApiResponse.success("강제 퇴실 처리가 완료되었습니다."));
        }
}