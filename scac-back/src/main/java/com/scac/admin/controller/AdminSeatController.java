package com.scac.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.admin.dto.SeatStatusRequest;
import com.scac.global.response.ApiResponse;
import com.scac.seat.service.SeatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/seats")
public class AdminSeatController {
    private final SeatService seatService;

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
}
