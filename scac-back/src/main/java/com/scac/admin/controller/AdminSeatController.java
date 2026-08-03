package com.scac.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.admin.dto.request.SeatStatusRequest;
import com.scac.global.response.ApiResponse;
import com.scac.seat.service.SeatService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/seats")
public class AdminSeatController {
    private final SeatService seatService;

    // 좌석 상태 변경
    @PatchMapping("/{seatId}/status")
    public ResponseEntity<ApiResponse<Void>> updateSeatStatus(
        @PathVariable Long seatId,
        @RequestBody SeatStatusRequest request
    ){
        seatService.updateStatus(seatId, request.getStatus());

        return ResponseEntity.ok(
            ApiResponse.success(null)
        );
    }

    // 강제 퇴실 조치
    @PostMapping("/{seatId}/force-checkout")
    public ResponseEntity<ApiResponse<Void>> forceCheckout(@PathVariable Long seatId) {
        seatService.forceCheckout(seatId);

        return ResponseEntity.ok(
            ApiResponse.success(null)
        );
    }
    
}
