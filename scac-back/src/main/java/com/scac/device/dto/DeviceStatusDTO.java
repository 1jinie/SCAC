package com.scac.device.dto;

import com.scac.global.enums.DeviceStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DeviceStatusDTO {

  @NotNull(message = "장치 상태는 필수입니다.")
  private final DeviceStatus status;

  @Size(max = 255, message = "상태 메시지는 255자 이하로 입력해주세요.")
  private final String message;
}