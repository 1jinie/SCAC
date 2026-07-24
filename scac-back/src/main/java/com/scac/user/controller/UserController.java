package com.scac.user.controller;

import com.scac.global.response.ApiResponse;
import com.scac.user.dto.*;
import com.scac.user.entity.User;
import com.scac.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 1. 일반 회원가입
     */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<User>> signUp(
            @Valid @RequestBody UserSignUpReq req
    ) {
        UserRes userRes = userService.signUp(req);

        return ResponseEntity.ok(
                ApiResponse.success("회원가입이 완료되었습니다.", userRes)
        );
    }

    /**
     * 2. 비회원/게스트 간편 등록 (전화번호 기반)
     */
    @PostMapping("/guest")
    public ResponseEntity<ApiResponse<UserRes>> registerGuest(
            @Valid @RequestBody RegisterReq req
    ) {
        UserRes guestRes = userService.registerGuest(req);

        return ResponseEntity.ok(
                ApiResponse.success("비회원 등록이 완료되었습니다.", guestRes)
        );
    }

    /**
     * 3. 회원 프로필 조회 (마이페이지)
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserRes>> getUserProfile(
            @PathVariable Long userId
    ) {
        UserRes userRes = userService.getUserProfile(userId);

        return ResponseEntity.ok(
                ApiResponse.success("회원 정보 조회를 완료했습니다.", userRes)
        );
    }

    /**
     * 4. 입실 비밀번호 검증 (키오스크 / 출입문 단말기용)
     */
    @PostMapping("/entry-password/verify")
    public ResponseEntity<ApiResponse<Boolean>> verifyEntryPassword(
            @Valid @RequestBody EntryPasswordVerifyReq req
    ) {
        boolean isVerified = userService.verifyEntryPassword(req);

        return ResponseEntity.ok(
                ApiResponse.success("입실 비밀번호 검증에 성공했습니다.", isVerified)
        );
    }

    /**
     * 5. 입실 비밀번호 변경 (마이페이지용)
     */
    @PatchMapping("/{userId}/entry-password")
    public ResponseEntity<ApiResponse<Void>> updateEntryPassword(
            @PathVariable Long userId,
            @Valid @RequestBody PasswordUpdateReq req
    ) {
        userService.updateEntryPassword(userId, req);

        return ResponseEntity.ok(
                ApiResponse.success("입실 비밀번호 변경이 완료되었습니다.")
        );
    }
}