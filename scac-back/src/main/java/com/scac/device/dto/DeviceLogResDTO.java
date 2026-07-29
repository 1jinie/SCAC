package com.scac.device.dto;

import java.time.LocalDateTime;

import com.scac.device.entity.DeviceLog;
import com.scac.global.enums.DeviceStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DeviceLogResDTO {

  private final Long logId;

  // 장치 테이블이 생긴다면 이건 deviceId가 될지도?
  private final String deviceName;

  private final String eventType;

  private final DeviceStatus status;

  private final String message;

  private final LocalDateTime createdAt;

  public static DeviceLogResDTO from(DeviceLog deviceLog) {
    return new DeviceLogResDTO(deviceLog.getLogId(), deviceLog.getDeviceName(), deviceLog.getEventType(),
      deviceLog.getStatus(), deviceLog.getMessage(), deviceLog.getCreatedAt());
  }
}