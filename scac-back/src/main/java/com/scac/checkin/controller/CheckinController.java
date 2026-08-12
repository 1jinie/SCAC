package com.scac.checkin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/checkin")
public class CheckinController {
    private final CheckinService checkinService;

    // 비회원 입실 준비
    @PostMapping("/prepare")
    public ResponseEntity<ApiResponse<CheckinPrepareResponse>> prepare(
        @Valid @RequestBody CheckinPrepareRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success("입실 준비 완료", checkinService.prepare(request))
        );
    }

    // 회원 입실 준비
    @PostMapping("/prepare/member")
    public ResponseEntity<ApiResponse<CheckinPrepareResponse>> prepareMember(
        Authentication authentication
    ) {
        return ResponseEntity.ok(
            ApiResponse.success("입실 준비 완료", checkinService.prepareMember(authentication))
        );
    }

    // 입실
    @PostMapping
    public ResponseEntity<ApiResponse<CheckinResponse>> checkin(
        @Valid @RequestBody CheckinRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success("입실이 완료되었습니다.", checkinService.checkin(request))
        );
    }

    // 외출
    @PatchMapping("/away")
    public ResponseEntity<ApiResponse<CheckinResponse>> goAway(
        @Valid @RequestBody CheckinPrepareRequest request
    ){
        return ResponseEntity.ok(
            ApiResponse.success("외출처리 완료", checkinService.goAway(request))
        );
    }

    // 회원 외출
    @PatchMapping("/away/member")
    public ResponseEntity<ApiResponse<CheckinResponse>> memberGoAway(
        Authentication authentication
    ){
        return ResponseEntity.ok(
            ApiResponse.success(
                "외출 처리 완료",
                checkinService.memberGoAway(authentication)
            )
        );
    }

    // 외출 복귀
    @PatchMapping("/comeback")
    public ResponseEntity<ApiResponse<CheckinResponse>> comeBack(
        @Valid @RequestBody CheckinPrepareRequest request
    ){
        return ResponseEntity.ok(
            ApiResponse.success("외출 복귀 완료", checkinService.comeBack(request))
        );
    }

    // 회원 외출 복귀
    @PatchMapping("/comeback/member")
    public ResponseEntity<ApiResponse<CheckinResponse>> memberComeBack(
        Authentication authentication
    ){
        return ResponseEntity.ok(
            ApiResponse.success(
                "외출 복귀 완료", 
                checkinService.memberComeBack(authentication))
        );
    }

    // 퇴실
    @PatchMapping("/checkout")
    public ResponseEntity<ApiResponse<CheckinResponse>> checkout(
        @Valid @RequestBody CheckinPrepareRequest request
    ){
        return ResponseEntity.ok(
            ApiResponse.success("퇴실 완료", checkinService.checkout(request))
        );
    }
    
    // 회원 퇴실
    @PatchMapping("/checkout/member")
    public ResponseEntity<ApiResponse<CheckinResponse>> memberCheckout(
        Authentication authentication
    ){
        return ResponseEntity.ok(
            ApiResponse.success(
                "퇴실 완료", 
                checkinService.memberCheckout(authentication)
            )
        );
    }
}