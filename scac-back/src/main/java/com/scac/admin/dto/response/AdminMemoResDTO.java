package com.scac.admin.dto.response;

import java.time.LocalDateTime;

import com.scac.admin.entity.AdminMemo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminMemoResDTO {

  private Long memoId;
  private Long adminId;
  private String content;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  public static AdminMemoResDTO from(AdminMemo memo) {
    return AdminMemoResDTO.builder().memoId(memo.getMemoId()).adminId(memo.getAdminId())
      .content(memo.getContent()).createdAt(memo.getCreatedAt()).updatedAt(memo.getUpdatedAt()).build();
  }
}
