package com.scac.ticketusage.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.global.response.ApiResponse;
import com.scac.ticketusage.dto.TicketUsageRequest;
import com.scac.ticketusage.dto.TicketUsageResponse;
import com.scac.ticketusage.service.TicketUsageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ticket-usages")
public class TicketUsageController {
    private final TicketUsageService ticketUsageService;


    @PostMapping("/check-in")
    public ResponseEntity<ApiResponse<TicketUsageResponse>> checkIn(
            @RequestBody TicketUsageRequest request
    ) {

        return ResponseEntity.ok(
            ApiResponse.success(
                "입실이 완료되었습니다.",
                ticketUsageService.checkIn(request)
            )
        );
    }
}
