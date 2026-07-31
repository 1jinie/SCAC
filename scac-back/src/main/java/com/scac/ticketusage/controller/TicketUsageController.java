package com.scac.ticketusage.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.global.response.ApiResponse;
import com.scac.ticketusage.dto.TicketUsageCreateDTO;
import com.scac.ticketusage.dto.TicketUsageResDTO;
import com.scac.ticketusage.service.TicketUsageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/ticket-usages")
public class TicketUsageController {
    private final TicketUsageService ticketUsageService;

    // 추후 관리자 수동 이용권 발급 API로 전환
    // - 경로: POST /api/admin/ticket-usages
    // - 관리자 권한 검증 추가
    // - 발급 사유 저장 여부 검토

    @PostMapping
    public ResponseEntity<ApiResponse<TicketUsageResDTO>> issue(
        @Valid @RequestBody TicketUsageCreateDTO form) {
        TicketUsageResDTO response = ticketUsageService.issue(form.getUserId(), form.getTicketId());

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("이용권이 발급되었습니다.", response));
    }
}
