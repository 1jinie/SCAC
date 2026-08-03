package com.scac.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scac.global.response.ApiResponse;
import com.scac.system.entity.SystemLog;
import com.scac.system.service.SystemLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/logs")
@RequiredArgsConstructor
public class AdminSystemLogController {

    private final SystemLogService systemLogService;

    /**
     * 시스템 로그 조회 (로그 레벨 필터링 가능)
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
}