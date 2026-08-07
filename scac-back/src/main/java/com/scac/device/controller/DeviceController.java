package com.scac.device.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.device.dto.DeviceLogCreateDTO;
import com.scac.device.dto.DeviceLogResDTO;
import com.scac.device.service.DeviceService;
import com.scac.global.response.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/devices")
public class DeviceController {

  private final DeviceService deviceService;

  // RTOS 이벤트 수신
  @PostMapping("/events")
  public ResponseEntity<ApiResponse<DeviceLogResDTO>> handleDeviceEvent(
      @Valid @RequestBody DeviceLogCreateDTO form) {
    DeviceLogResDTO log = deviceService.handleDeviceEvent(form);

    return ResponseEntity.ok(ApiResponse.success("장치 이벤트 처리를 완료했습니다.", log));
  }

}