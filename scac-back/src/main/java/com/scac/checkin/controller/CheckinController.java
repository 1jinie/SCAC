package com.scac.checkin.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.checkin.dto.CheckinRequest;
import com.scac.checkin.dto.CheckinResponse;
import com.scac.checkin.service.CheckinService;
import com.scac.global.response.ApiResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/checkin")
public class CheckinController {
    private final CheckinService checkinService;

    // 입실
    @PostMapping
    public ResponseEntity<ApiResponse<CheckinResponse>> checkin(@RequestBody CheckinRequest request) {
        
        return ResponseEntity.ok(
            ApiResponse.success(
                "입실이 완료되었습니다",
                checkinService.checkIn(request)
            )
        );
    }
    
}