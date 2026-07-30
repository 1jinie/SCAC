package com.scac.device.entity;

import java.time.LocalDateTime;

import com.scac.global.enums.DeviceStatus;
import com.scac.global.enums.DeviceType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "device")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Device {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "device_id")
  private Long deviceId;

  @Column(name = "device_name", nullable = false, length = 50)
  private String deviceName;

  @Enumerated(EnumType.STRING)
  @Column(name = "device_type", nullable = false, length = 30)
  private DeviceType deviceType;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 20)
  private DeviceStatus status;

  @Column(name = "location", length = 100)
  private String location;

  @Column(name = "ip_address", length = 45)
  private String ipAddress;

  @Column(name = "last_connected_at")
  private LocalDateTime lastConnectedAt;

  @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
  private LocalDateTime createdAt;

  @Column(name = "serial_number", unique = true, length = 100)
  private String serialNumber;

  private Device(String deviceName, DeviceType deviceType, String location, String ipAddress,
    String serialNumber) {
    this.deviceName = deviceName;
    this.deviceType = deviceType;
    this.status = DeviceStatus.NORMAL;
    this.location = location;
    this.ipAddress = ipAddress;
    this.serialNumber = serialNumber;
  }

  public static Device create(String deviceName, DeviceType deviceType, String location, String ipAddress,
    String serialNumber) {
    return new Device(deviceName, deviceType, location, ipAddress, serialNumber);
  }

  public void update(String deviceName, DeviceType deviceType, String location, String ipAddress,
    String serialNumber) {
    this.deviceName = deviceName;
    this.deviceType = deviceType;
    this.location = location;
    this.ipAddress = ipAddress;
    this.serialNumber = serialNumber;
  }

  public void updateStatus(DeviceStatus status) {
    this.status = status;
  }

  public void updateLastConnectedAt(LocalDateTime lastConnectedAt) {
    this.lastConnectedAt = lastConnectedAt;
  }
}