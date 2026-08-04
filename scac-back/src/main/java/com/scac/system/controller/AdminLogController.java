package com.scac.system.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.global.response.ApiResponse;
import com.scac.system.dto.SeatLogRes;
import com.scac.system.service.SystemLogService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/logs")
public class AdminLogController {
    private final SystemLogService systemLogService;

    // 전체 좌석 로그 확인
    @GetMapping("/seat")
    public ResponseEntity<ApiResponse<List<SeatLogRes>>> getAllSeatLogs() {
        return ResponseEntity.ok(
            ApiResponse.success(
                systemLogService.getLogsByTarget("SEAT")
            )
        );
    }
    

    // 선택 좌석 로그 확인
    @GetMapping("/seat/{seatId}")
    public ResponseEntity<ApiResponse<List<SeatLogRes>>> getSeatLogs(@PathVariable Long seatId) {
        return ResponseEntity.ok(
            ApiResponse.success(
                systemLogService.getLogsByTarget("SEAT", seatId)
            )
        );
    }
    
}
