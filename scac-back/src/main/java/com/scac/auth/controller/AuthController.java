package com.scac.auth.controller;

import com.scac.auth.dto.LoginReq;
import com.scac.auth.dto.LoginRes;
import com.scac.auth.service.AuthService;
import com.scac.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
}