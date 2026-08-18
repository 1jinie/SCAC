package com.scac.device.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 장치 활성화, 비활성화 데이터 받는 DTO
@Getter
@NoArgsConstructor
public class DeviceActiveDTO {

  @NotNull(message = "장치 활성 여부는 필수입니다.")
  private Boolean isActive;
}