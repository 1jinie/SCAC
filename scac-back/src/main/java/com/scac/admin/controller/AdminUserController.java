package com.scac.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.admin.dto.request.AdminUserSearchReq;
import com.scac.admin.dto.request.UserPenaltyReq;
import com.scac.admin.dto.response.AdminUserRes;
import com.scac.global.log.annotation.AutoLog;
import com.scac.global.response.ApiResponse;
import com.scac.user.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    // 💡 AdminUserService 대신 통합된 UserService를 주입받아 사용!
    private final UserService userService;

    /**
     * 회원 목록 및 조건 검색
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminUserRes>>> getUsers(
            @ModelAttribute AdminUserSearchReq searchReq
    ) {
        List<AdminUserRes> users = userService.getUsersForAdmin(searchReq);
        return ResponseEntity.ok(
                ApiResponse.success("회원 목록 조회를 완료했습니다.", users)
        );
    }

    /**
     * 회원 상세 조회
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<AdminUserRes>> getUserDetail(
            @PathVariable Long userId
    ) {
        AdminUserRes userDetail = userService.getUserDetailForAdmin(userId);
        return ResponseEntity.ok(
                ApiResponse.success("회원 상세 조회를 완료했습니다.", userDetail)
        );
    }

        /**
         * 회원 제재 및 상태 변경 (정지/영구정지/정지해제)
         */
        @PatchMapping("/{userId}/penalty")
        @AutoLog(
        logType = "USER", 
        action = "PENALTY", 
        targetType = "USER", 
        content = "관리자에 의한 회원 제재 처리"
        )
        public ResponseEntity<ApiResponse<Void>> applyPenalty(
                @PathVariable Long userId,
                @Valid @RequestBody UserPenaltyReq req
        ) {
        userService.applyUserPenalty(userId, req);
        return ResponseEntity.ok(ApiResponse.success("회원 제재 처리가 완료되었습니다."));
        }
}