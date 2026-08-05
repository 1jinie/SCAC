package com.scac.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.admin.dto.request.AdminMemoCreateDTO;
import com.scac.admin.dto.request.AdminMemoUpdateDTO;
import com.scac.admin.dto.response.AdminMemoResDTO;
import com.scac.admin.entity.AdminMemo;
import com.scac.admin.repository.AdminMemoRepository;
import com.scac.global.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminMemoService {

  private final AdminMemoRepository adminMemoRepository;

  // 메모 전체 조회
  public List<AdminMemoResDTO> findAll() {
    return adminMemoRepository.findAllByOrderByCreatedAtDesc().stream().map(AdminMemoResDTO::from).toList();
  }

  // 메모 등록
  @Transactional
  public AdminMemoResDTO create(Long adminId, AdminMemoCreateDTO dto) {
    AdminMemo memo = AdminMemo.create(adminId, dto.getContent());

    adminMemoRepository.save(memo);

    return AdminMemoResDTO.from(memo);
  }

  // 메모 수정
  @Transactional
  public AdminMemoResDTO update(Long memoId, AdminMemoUpdateDTO dto) {
    AdminMemo memo = findMemo(memoId);

    memo.update(dto.getContent());

    return AdminMemoResDTO.from(memo);
  }

  // 메모 삭제
  @Transactional
  public void delete(Long memoId) {
    AdminMemo memo = findMemo(memoId);

    adminMemoRepository.delete(memo);
  }

  private AdminMemo findMemo(Long memoId) {
    return adminMemoRepository.findById(memoId)
      .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 메모입니다."));
  }
}