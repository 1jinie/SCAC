package com.scac.device.dto;

import java.time.LocalDateTime;

import com.scac.device.entity.DeviceLog;
import com.scac.global.enums.DeviceStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DeviceResDTO {
  // 장치ID는 추후 테이블이 생기면 추가
  private final String deviceName;

  private final String eventType;

  private final DeviceStatus status;

  private final String message;

  private final LocalDateTime lastCheckedAt;

  // 여기도 나중에 테이블이 따로 생기면 장치ID 추가
  public static DeviceResDTO from(DeviceLog deviceLog) {
    return new DeviceResDTO(deviceLog.getDeviceName(), deviceLog.getEventType(), deviceLog.getStatus(),
      deviceLog.getMessage(), deviceLog.getCreatedAt());
  }
}