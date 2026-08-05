package com.scac.admin.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminMemoCreateDTO {

  @NotBlank(message = "메모 내용을 입력해 주세요.")
  private String content;
}
