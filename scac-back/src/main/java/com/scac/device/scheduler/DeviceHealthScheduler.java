package com.scac.device.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.scac.device.service.DeviceService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DeviceHealthScheduler {

  private final DeviceService deviceService;

  // 5초마다 Health Check 마지막 수신 시간 확인
  @Scheduled(fixedDelay = 5000)
  public void checkDeviceHealth() {
    deviceService.checkOfflineDevices();
  }
}