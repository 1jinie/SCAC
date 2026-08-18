package com.scac.device.dto;

import com.scac.global.enums.DeviceType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 장치 추가용 DTO
@Getter
@NoArgsConstructor
public class DeviceCreateDTO {

  @NotBlank(message = "장치명은 필수입니다.")
  @Size(max = 50, message = "장치명은 50자 이하로 입력해 주세요.")
  private String deviceName;

  @NotNull(message = "장치 유형은 필수입니다.")
  private DeviceType deviceType;

  @Size(max = 100)
  private String location;

  @Size(max = 45)
  private String ipAddress;

  @Size(max = 100)
  private String serialNumber;
}