package com.scac.device.dto;

import com.scac.global.enums.DeviceStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

/*
RTOS에서 받을 데이터 DTO
*/
@Getter
@NoArgsConstructor
public class DeviceLogCreateDTO {

  private Long deviceId;

  @NotBlank(message = "이벤트 유형은 필수입니다.")
  @Size(max = 50)
  private String eventType;

  @NotNull(message = "장치 상태는 필수입니다.")
  private DeviceStatus status;

  @Size(max = 255)
  private String message;
}