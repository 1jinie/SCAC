package com.scac.ticketusage.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.auth.jwt.UserPrincipal;
import com.scac.global.response.ApiResponse;
import com.scac.ticketusage.service.TicketUsageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ticket-usages")
public class TicketUsageController {
    private final TicketUsageService ticketUsageService;

    // UserId로 사용가능한 좌석 이용권 보유 여부 조회
    @GetMapping("/available-seat/exists")
    public ResponseEntity<ApiResponse<Boolean>> hasAvailableSeatTicketUsage(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        boolean exists = ticketUsageService.hasAvailableSeatTicketUsage(currentUser.id());

        return ResponseEntity.ok(ApiResponse.success("이용권 조회 성공", exists));
    }

}
