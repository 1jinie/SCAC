package com.scac.user.controller;

import com.scac.auth.jwt.UserPrincipal;
import com.scac.global.response.ApiResponse;
import com.scac.user.dto.*;
import com.scac.user.entity.User;
import com.scac.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

        private final UserService userService;

        /**
         * 0. 전화번호 중복 / 등록 여부 검증
         */
        @GetMapping("/check-phone")
        public ResponseEntity<ApiResponse<Boolean>> checkPhoneExists(
                        @RequestParam(name = "phoneNumber") String phoneNumber) {
                boolean exists = userService.existsByPhoneNumber(phoneNumber);

                return ResponseEntity.ok(ApiResponse.success("전화번호 중복 확인을 완료했습니다.", exists));
        }

        /**
         * 1. 일반 회원가입
         */
        @PostMapping("/signup")
        public ResponseEntity<ApiResponse<UserRes>> signUp(@Valid @RequestBody UserSignUpReq req) {
                User user = userService.register(req);

                return ResponseEntity.ok(ApiResponse.success("회원가입이 완료되었습니다.", UserRes.from(user)));
        }

        /**
         * 2. 비회원/게스트 간편 등록 (전화번호 기반)
         */
        @PostMapping("/guest")
        public ResponseEntity<ApiResponse<UserRes>> signUpGuest(@Valid @RequestBody GuestRegisterReq req) {
                User guest = userService.registerGuest(req);

                return ResponseEntity.ok(ApiResponse.success("비회원 등록이 완료되었습니다.", UserRes.from(guest)));
        }

        /**
         * 3-1. 로그인 정보 전송 위함
         */
        @GetMapping("/me")
        public ResponseEntity<ApiResponse<Long>> getCurrentUser(Authentication authentication) {
                UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

                Long userId = principal.id();

                return ResponseEntity.ok(ApiResponse.<Long>success(userId));
        }

        /**
         * 3-2. 회원 프로필 조회 (마이페이지)
         */
        @GetMapping("/{userId}")
        public ResponseEntity<ApiResponse<UserRes>> findUser(@PathVariable(name = "userId") Long userId) {
                UserRes userRes = userService.getUserProfile(userId);

                return ResponseEntity.ok(ApiResponse.success("회원 정보 조회를 완료했습니다.", userRes));
        }

        /**
         * 4. 입실 비밀번호 검증 (키오스크 / 출입문 단말기용)
         */
        @PostMapping("/entry-password/verify")
        public ResponseEntity<ApiResponse<UserRes>> verifyEntryPassword(
                        @Valid @RequestBody PasswordVerifyReq req) {

                User user = userService.verifyPassword(req);

                return ResponseEntity.ok(ApiResponse.success("입실 비밀번호 검증에 성공했습니다 .", UserRes.from(user)));
        }

        /**
         * 5. 입실 비밀번호 변경
         *
         * JWT에서 인증된 사용자 ID를 사용합니다.
         */
        @PatchMapping("/me/entry-password")
        public ResponseEntity<ApiResponse<Void>> changePassword(
                        @AuthenticationPrincipal UserPrincipal principal,
                        @Valid @RequestBody PasswordUpdateReq req) {

                userService.changePassword(principal.id(), req);

                return ResponseEntity.ok(
                                ApiResponse.success("입실 비밀번호 변경이 완료되었습니다."));
        }
}