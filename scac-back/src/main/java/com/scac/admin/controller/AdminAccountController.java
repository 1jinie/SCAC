package com.scac.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.admin.dto.request.AdminAccountCreateReq;
import com.scac.admin.dto.request.AdminAccountUpdateReq;
import com.scac.admin.dto.response.AdminAccountRes;
import com.scac.admin.service.AdminAccountService;
import com.scac.global.response.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
public class AdminAccountController {

    private final AdminAccountService adminAccountService;

    /**
     * 1. 관리자 계정 생성
     */
    @PostMapping
    public ResponseEntity<ApiResponse<AdminAccountRes>> createAdminAccount(
            @Valid @RequestBody AdminAccountCreateReq req
    ) {
        AdminAccountRes created = adminAccountService.createAdminAccount(req);
        return ResponseEntity.ok(
                ApiResponse.success("관리자 계정 생성이 완료되었습니다.", created)
        );
    }

    /**
     * 2. 전체 관리자 계정 목록 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminAccountRes>>> getAllAdminAccounts() {
        List<AdminAccountRes> accounts = adminAccountService.getAllAdminAccounts();
        return ResponseEntity.ok(
                ApiResponse.success("관리자 계정 목록 조회를 완료했습니다.", accounts)
        );
    }

    /**
     * 3. 특정 관리자 계정 상세 조회
     */
    @GetMapping("/{adminId}")
    public ResponseEntity<ApiResponse<AdminAccountRes>> getAdminAccount(
            @PathVariable Long adminId
    ) {
        AdminAccountRes account = adminAccountService.getAdminAccount(adminId);
        return ResponseEntity.ok(
                ApiResponse.success("관리자 계정 조회를 완료했습니다.", account)
        );
    }

    /**
     * 4. 관리자 권한 / 비밀번호 수정
     */
    @PatchMapping("/{adminId}")
    public ResponseEntity<ApiResponse<Void>> updateAdminAccount(
            @PathVariable Long adminId,
            @RequestBody AdminAccountUpdateReq req
    ) {
        adminAccountService.updateAdminAccount(adminId, req);
        return ResponseEntity.ok(
                ApiResponse.success("관리자 계정 정보 변경이 완료되었습니다.")
        );
    }

    /**
     * 5. 관리자 계정 삭제
     */
    @DeleteMapping("/{adminId}")
    public ResponseEntity<ApiResponse<Void>> deleteAdminAccount(
            @PathVariable Long adminId
    ) {
        adminAccountService.deleteAdminAccount(adminId);
        return ResponseEntity.ok(
                ApiResponse.success("관리자 계정이 삭제되었습니다.")
        );
    }
}