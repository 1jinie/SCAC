package com.scac.auth.controller;

import com.scac.auth.dto.RefreshTokenReq;
import com.scac.auth.dto.request.LoginReq;
import com.scac.auth.dto.response.LoginRes;
import com.scac.auth.service.AuthService;
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
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /* 사용자 로그인 */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginRes>> login(
            @Valid @RequestBody LoginReq req
    ) {
        LoginRes loginRes = authService.login(req);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "로그인에 성공했습니다.",
                        loginRes
                )
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginRes>> refresh(
            @Valid @RequestBody RefreshTokenReq req
    ) {
        LoginRes loginRes = authService.refresh(req);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "토큰을 재발급했습니다.",
                        loginRes
                )
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {

        authService.logout(authorization);

        return ResponseEntity.ok(
                ApiResponse.success("로그아웃되었습니다.")
        );
    }





}