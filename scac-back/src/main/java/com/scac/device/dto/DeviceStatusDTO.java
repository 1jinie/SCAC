package com.scac.device.dto;

import com.scac.global.enums.DeviceStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DeviceStatusDTO {

  @NotNull(message = "장치 상태는 필수입니다.")
  private DeviceStatus status;

  @Size(max = 255, message = "상태 메시지는 255자 이하로 입력해주세요.")
  private String message;
}