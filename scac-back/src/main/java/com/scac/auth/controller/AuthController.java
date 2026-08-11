package com.scac.auth.controller;

import com.scac.auth.dto.RefreshTokenReq;
import com.scac.auth.dto.request.LoginReq;
import com.scac.auth.dto.request.SendCodeReq;
import com.scac.auth.dto.request.VerifyCodeReq;
import com.scac.auth.dto.response.LoginRes;
import com.scac.auth.service.AuthService;
import com.scac.auth.service.VerificationCodeService;
import com.scac.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    private final VerificationCodeService verificationCodeService;

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

    /* 인증번호 발송 */
    @PostMapping("/send-code")
    public ResponseEntity<ApiResponse<Void>> sendCode(
            @Valid @RequestBody SendCodeReq req
    ) {
        verificationCodeService.sendCode(req.phoneNumber());
        return ResponseEntity.ok(
                ApiResponse.success("인증번호가 발송되었습니다.")
        );
    }

    /* 인증번호 검증 */
    @PostMapping("/verify-code")
    public ResponseEntity<ApiResponse<Void>> verifyCode(
            @Valid @RequestBody VerifyCodeReq req
    ) {
        boolean isValid = verificationCodeService.verifyCode(req.phoneNumber(), req.code());
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("인증번호가 일치하지 않거나 만료되었습니다."));
        }
        return ResponseEntity.ok(
                ApiResponse.success("전화번호 인증이 완료되었습니다.")
        );
    }
}