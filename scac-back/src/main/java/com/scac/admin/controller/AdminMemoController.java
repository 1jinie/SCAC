package com.scac.admin.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.admin.dto.request.AdminMemoCreateDTO;
import com.scac.admin.dto.request.AdminMemoUpdateDTO;
import com.scac.admin.dto.response.AdminMemoResDTO;
import com.scac.admin.service.AdminMemoService;
import com.scac.auth.jwt.UserPrincipal;
import com.scac.global.response.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/memos")
public class AdminMemoController {

  private final AdminMemoService adminMemoService;

  // 관리자 메모 전체 조회
  @GetMapping
  public ResponseEntity<ApiResponse<List<AdminMemoResDTO>>> findAll() {
    List<AdminMemoResDTO> memos = adminMemoService.findAll();

    return ResponseEntity.ok(ApiResponse.success("관리자 메모 목록 조회를 완료했습니다.", memos));
  }

  // 관리자 메모 등록
  @PostMapping
  public ResponseEntity<ApiResponse<AdminMemoResDTO>> create(@Valid @RequestBody AdminMemoCreateDTO form,
    @AuthenticationPrincipal UserPrincipal currentAdmin) {

    AdminMemoResDTO memo = adminMemoService.create(currentAdmin.id(), form);

    return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("관리자 메모 등록을 완료했습니다.", memo));
  }

  // 관리자 메모 수정
  @PutMapping("/{memoId}")
  public ResponseEntity<ApiResponse<AdminMemoResDTO>> update(@PathVariable("memoId") Long memoId,
    @Valid @RequestBody AdminMemoUpdateDTO form, @AuthenticationPrincipal UserPrincipal currentAdmin) {
    AdminMemoResDTO memo = adminMemoService.update(memoId, form);

    return ResponseEntity.ok(ApiResponse.success("관리자 메모 수정을 완료했습니다.", memo));
  }

  // 관리자 메모 삭제
  @DeleteMapping("/{memoId}")
  public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("memoId") Long memoId) {
    adminMemoService.delete(memoId);

    return ResponseEntity.ok(ApiResponse.success("관리자 메모 삭제를 완료했습니다."));
  }
}