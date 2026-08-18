package com.scac.admin.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scac.device.dto.DeviceActiveDTO;
import com.scac.device.dto.DeviceCreateDTO;
import com.scac.device.dto.DeviceLogResDTO;
import com.scac.device.dto.DeviceResDTO;
import com.scac.device.dto.DeviceStatusDTO;
import com.scac.device.dto.DeviceUpdateDTO;
import com.scac.device.service.DeviceService;
import com.scac.global.log.annotation.AutoLog;
import com.scac.global.response.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/devices")
@RequiredArgsConstructor
public class AdminDeviceController {
  private final DeviceService deviceService;

  // 전체 장치 조회(기본값은 활성화된 장치만 조회)
  @GetMapping
  public ResponseEntity<ApiResponse<List<DeviceResDTO>>> findAll(
    @RequestParam(name = "includeInactive", defaultValue = "false") boolean includeInactive) {
    List<DeviceResDTO> devices = deviceService.findAllCurrentStatus(includeInactive);
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

  // 관리자 장치 등록
  @PostMapping
  public ResponseEntity<ApiResponse<DeviceResDTO>> create(@Valid @RequestBody DeviceCreateDTO form) {
    DeviceResDTO device = deviceService.create(form);
    return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("장치 등록을 완료했습니다.", device));
  }

  // 관리자 장치 정보 수정
  @PutMapping("/{deviceId}")
  public ResponseEntity<ApiResponse<DeviceResDTO>> update(@PathVariable("deviceId") Long deviceId,
    @Valid @RequestBody DeviceUpdateDTO form) {
    DeviceResDTO device = deviceService.update(deviceId, form);
    return ResponseEntity.ok(ApiResponse.success("장치 정보 수정을 완료했습니다.", device));
  }

  // 관리자 장치 삭제 (장치 로그가 존재하지 않는 장치만 삭제할 수 있습니다)
  @DeleteMapping("/{deviceId}")
  public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("deviceId") Long deviceId) {
    deviceService.delete(deviceId);
    return ResponseEntity.ok(ApiResponse.success("장치 삭제를 완료했습니다.", null));
  }

  // 관리자 장치 상태 변경
  @AutoLog(logType = "DEVICE", action = "UPDATE", targetType = "DEVICE", content = "관리자에 의한 장치 상태 수동 변경")
  @PatchMapping("/{deviceId}/status")
  public ResponseEntity<ApiResponse<DeviceResDTO>> updateStatus(@PathVariable("deviceId") Long deviceId,
    @Valid @RequestBody DeviceStatusDTO form) {
    DeviceResDTO device = deviceService.updateStatus(deviceId, form);
    return ResponseEntity.ok(ApiResponse.success("장치 상태 변경을 완료했습니다.", device));
  }

  // 관리자 장치 활성화 비활성화 변경
  @PatchMapping("/{deviceId}/active")
  public ResponseEntity<ApiResponse<DeviceResDTO>> updateActive(@PathVariable("deviceId") Long deviceId,
    @Valid @RequestBody DeviceActiveDTO form) {

    DeviceResDTO device = deviceService.updateActive(deviceId, form);
    String message = Boolean.TRUE.equals(device.getIsActive()) ? "장치를 활성화했습니다." : "장치를 비활성화했습니다.";
    return ResponseEntity.ok(ApiResponse.success(message, device));
  }
}
