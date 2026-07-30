package com.scac.checkin.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.checkin.dto.CheckinPrepareRequest;
import com.scac.checkin.dto.CheckinPrepareResponse;
import com.scac.checkin.dto.CheckinRequest;
import com.scac.checkin.dto.CheckinResponse;
import com.scac.checkin.service.CheckinService;
import com.scac.global.response.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/checkin")
public class CheckinController {
    private final CheckinService checkinService;
    // 입실 준비
    @PostMapping("/prepare")
    public ResponseEntity<ApiResponse<CheckinPrepareResponse>> prepare(@RequestBody CheckinPrepareRequest request) {
        return ResponseEntity.ok(
            ApiResponse.success(
                "입실 준비 완료",
                checkinService.prepare(request)
            )
        );
    }
    

    // 입실
    @PostMapping
    public ResponseEntity<ApiResponse<CheckinResponse>> checkin(@RequestBody CheckinRequest request) {
        
        return ResponseEntity.ok(
            ApiResponse.success(
                "입실이 완료되었습니다",
                checkinService.checkin(request)
            )
        );
    }

    // 외출
    @PatchMapping("/away")
    public ResponseEntity<ApiResponse<CheckinResponse>> goAway(
        @Valid @RequestBody CheckinPrepareRequest request
    ){
        CheckinResponse response = checkinService.goAway(request);
        return ResponseEntity.ok(
            ApiResponse.success(
                "외출처리 완료", 
                response
            )
        );
    }

    // 외출 복귀
    @PatchMapping("/comeback")
    public ResponseEntity<ApiResponse<CheckinResponse>> comeBack(
        @Valid @RequestBody CheckinPrepareRequest request
    ){
        CheckinResponse response = checkinService.comeBack(request);
        return ResponseEntity.ok(
            ApiResponse.success(
                "외출 복귀 완료", response
            )
        );
    }

    // 퇴실
    @PatchMapping("/checkout")
    public ResponseEntity<ApiResponse<CheckinResponse>> checkout(
        @Valid @RequestBody CheckinPrepareRequest request
    ){
        CheckinResponse response = checkinService.checkout(request);
        return ResponseEntity.ok(
            ApiResponse.success(
                "퇴실 완료", response
            )
        );
    }
}