package com.scac.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.admin.dto.response.DashboardRes;
import com.scac.admin.service.AdminDashboardService;
import com.scac.global.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    /**
     * 대시보드 통합 요약 정보 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<DashboardRes>> getDashboardSummary() {
        DashboardRes summary = adminDashboardService.getDashboardSummary();
        return ResponseEntity.ok(
                ApiResponse.success("대시보드 요약 정보 조회를 완료했습니다.", summary)
        );
    }
}