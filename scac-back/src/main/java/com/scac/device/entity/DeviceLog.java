package com.scac.device.entity;

import java.time.LocalDateTime;

import com.scac.global.enums.DeviceStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "device_log")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DeviceLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "log_id")
  private Long logId;

  @Column(name = "device_name", nullable = false, length = 50)
  private String deviceName;

  @Column(name = "event_type", nullable = false, length = 50)
  private String eventType;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 20)
  private DeviceStatus status;

  @Column(name = "message", length = 255)
  private String message;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  private DeviceLog(String deviceName, String eventType, DeviceStatus status, String message) {
    this.deviceName = deviceName;
    this.eventType = eventType;
    this.status = status;
    this.message = message;
  }

  public static DeviceLog create(String deviceName, String eventType, DeviceStatus status, String message) {
    return new DeviceLog(deviceName, eventType, status, message);
  }

  @PrePersist
  void setCreatedAt() {
    this.createdAt = LocalDateTime.now();
  }
}