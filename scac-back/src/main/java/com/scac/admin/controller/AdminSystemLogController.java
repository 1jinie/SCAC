package com.scac.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scac.global.response.ApiResponse;
import com.scac.system.dto.SeatLogRes; // 💡 SeatLogRes DTO 추가
import com.scac.system.entity.SystemLog;
import com.scac.system.service.SystemLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/logs")
@RequiredArgsConstructor
public class AdminSystemLogController {

    private final SystemLogService systemLogService;

    /**
     * 1. 시스템 로그 조회 (로그 레벨 필터링 가능)
     * GET /api/admin/logs
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<SystemLog>>> getSystemLogs(
            @RequestParam(required = false) String logLevel
    ) {
        List<SystemLog> logs = (logLevel != null && !logLevel.isBlank())
                ? systemLogService.getLogsByLevel(logLevel)
                : systemLogService.getAllLogs();

        return ResponseEntity.ok(
                ApiResponse.success("시스템 로그 조회를 완료했습니다.", logs)
        );
    }

    /**
     * 2. 전체 좌석 로그 확인
     * GET /api/admin/logs/seat
     */
    @GetMapping("/seat")
    public ResponseEntity<ApiResponse<List<SeatLogRes>>> getAllSeatLogs() {
        return ResponseEntity.ok(
                ApiResponse.success("전체 좌석 로그 조회를 완료했습니다.", systemLogService.getLogsByTarget("SEAT"))
        );
    }

    /**
     * 3. 특정 선택 좌석 로그 확인
     * GET /api/admin/logs/seat/{seatId}
     */
    @GetMapping("/seat/{seatId}")
    public ResponseEntity<ApiResponse<List<SeatLogRes>>> getSeatLogs(
            @PathVariable Long seatId
    ) {
        return ResponseEntity.ok(
                ApiResponse.success("선택 좌석 로그 조회를 완료했습니다.", systemLogService.getLogsByTarget("SEAT", seatId))
        );
    }
}