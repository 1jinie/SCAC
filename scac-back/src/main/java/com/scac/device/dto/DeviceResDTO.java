package com.scac.device.dto;

import java.time.LocalDateTime;

import com.scac.device.entity.Device;
import com.scac.global.enums.DeviceStatus;
import com.scac.global.enums.DeviceType;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DeviceResDTO {

  private final Long deviceId;
  private final String deviceName;
  private final DeviceType deviceType;
  private final DeviceStatus status;
  private final String location;
  private final String ipAddress;
  private final LocalDateTime lastConnectedAt;
  private final LocalDateTime createdAt;
  private final String serialNumber;

  public static DeviceResDTO from(Device device) {
    return new DeviceResDTO(device.getDeviceId(), device.getDeviceName(), device.getDeviceType(),
      device.getStatus(), device.getLocation(), device.getIpAddress(), device.getLastConnectedAt(),
      device.getCreatedAt(), device.getSerialNumber());
  }
}