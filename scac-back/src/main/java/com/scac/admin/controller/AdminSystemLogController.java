package com.scac.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scac.admin.dto.response.SystemLogRes;
import com.scac.global.response.ApiResponse;
import com.scac.system.dto.SeatLogRes;
import com.scac.system.service.SystemLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/logs")
@RequiredArgsConstructor
public class AdminSystemLogController {

        private final SystemLogService systemLogService;

        /**
         * 1. 시스템 로그 목록 조회 (최신순, N+1 최적화 DTO 반환)
         */
        @GetMapping
        public ResponseEntity<ApiResponse<List<SystemLogRes>>> getSystemLogs(
                @RequestParam(name = "logLevel", required = false) String logLevel) {
                List<SystemLogRes> logs = systemLogService.getAllSystemLogs(logLevel);
                return ResponseEntity.ok(ApiResponse.success("시스템 로그 조회를 완료했습니다.", logs));
        }

        /**
         * 2. 시스템 로그 단일 상세 조회
         */
        @GetMapping("/{logId}")
        public ResponseEntity<ApiResponse<SystemLogRes>> getSystemLogDetail(
                @PathVariable(name = "logId") Long logId) {
                SystemLogRes logDetail = systemLogService.getLogDetail(logId);
                return ResponseEntity.ok(ApiResponse.success("시스템 로그 상세 조회를 완료했습니다.", logDetail));
        }

        /**
         * 3. 전체 좌석 로그 확인
         */
        @GetMapping("/seat")
        public ResponseEntity<ApiResponse<List<SeatLogRes>>> getAllSeatLogs() {
                return ResponseEntity.ok(ApiResponse.success("전체 좌석 로그 조회를 완료했습니다.",
                        systemLogService.getLogsByTarget("SEAT")));
        }

        /**
         * 4. 특정 선택 좌석 로그 확인
         */
        @GetMapping("/seat/{seatId}")
        public ResponseEntity<ApiResponse<List<SeatLogRes>>> getSeatLogs(
                @PathVariable(name = "seatId") Long seatId) {
                return ResponseEntity.ok(ApiResponse.success("선택 좌석 로그 조회를 완료했습니다.",
                        systemLogService.getLogsByTarget("SEAT", seatId)));
        }
}