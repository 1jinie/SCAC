package com.scac.device.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.device.dto.DeviceLogCreateDTO;
import com.scac.device.dto.DeviceLogResDTO;
import com.scac.device.dto.DeviceResDTO;
import com.scac.device.dto.DeviceStatusDTO;
import com.scac.device.service.DeviceService;
import com.scac.global.response.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/devices")
public class DeviceController {

  private final DeviceService deviceService;

  // 장치별 현재 상태 조회
  @GetMapping
  public ResponseEntity<ApiResponse<List<DeviceResDTO>>> findAll() {

    List<DeviceResDTO> devices = deviceService.findAllCurrentStatus();

    return ResponseEntity.ok(ApiResponse.success("장치 상태 조회를 완료했습니다.", devices));
  }

  // 특정 장치 현재 상태 조회
  @GetMapping("/{deviceId}")
  public ResponseEntity<ApiResponse<DeviceResDTO>> findByDeviceId(@PathVariable("deviceId") Long deviceId) {

    DeviceResDTO device = deviceService.findCurrentStatus(deviceId);

    return ResponseEntity.ok(ApiResponse.success("장치 상태 조회를 완료했습니다.", device));
  }

  // 특정 장치 로그 조회
  @GetMapping("/{deviceId}/logs")
  public ResponseEntity<ApiResponse<List<DeviceLogResDTO>>> findLogs(
    @PathVariable("deviceId") Long deviceId) {

    List<DeviceLogResDTO> logs = deviceService.findLogs(deviceId);

    return ResponseEntity.ok(ApiResponse.success("장치 로그 조회를 완료했습니다.", logs));
  }

  // 관리자 장치 상태 변경
  @PatchMapping("/{deviceId}/status")
  public ResponseEntity<ApiResponse<DeviceResDTO>> updateStatus(@PathVariable("deviceId") Long deviceId,
    @Valid @RequestBody DeviceStatusDTO form) {

    DeviceResDTO device = deviceService.updateStatus(deviceId, form);

    return ResponseEntity.ok(ApiResponse.success("장치 상태 변경을 완료했습니다.", device));
  }

  // RTOS 이벤트 수신
  @PostMapping("/events")
  public ResponseEntity<ApiResponse<DeviceLogResDTO>> handleDeviceEvent(
    @Valid @RequestBody DeviceLogCreateDTO form) {
    DeviceLogResDTO log = deviceService.handleDeviceEvent(form);

    return ResponseEntity.ok(ApiResponse.success("장치 이벤트 처리를 완료했습니다.", log));
  }

}