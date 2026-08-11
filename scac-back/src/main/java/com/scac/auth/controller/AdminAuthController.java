package com.scac.auth.controller;

import com.scac.auth.dto.RefreshTokenReq;
import com.scac.auth.dto.request.AdminLoginReq;
import com.scac.auth.dto.response.AdminLoginRes;
import com.scac.auth.service.AdminAuthService;
import com.scac.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    /**
     * 관리자 로그인
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AdminLoginRes>> login(
            @Valid @RequestBody AdminLoginReq req
    ) {
        AdminLoginRes loginRes = adminAuthService.login(req);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "관리자 로그인에 성공했습니다.",
                        loginRes
                )
        );
    }

    /**
     * 관리자 토큰 재발급
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AdminLoginRes>> refresh(
            @Valid @RequestBody RefreshTokenReq req
    ) {
        AdminLoginRes loginRes = adminAuthService.refresh(req);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "토큰을 재발급했습니다.",
                        loginRes
                )
        );
    }

    /**
     * 관리자 로그아웃
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        adminAuthService.logout(authorization);

        return ResponseEntity.ok(
                ApiResponse.success("로그아웃되었습니다.")
        );
    }

}
