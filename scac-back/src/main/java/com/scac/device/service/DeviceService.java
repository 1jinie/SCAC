package com.scac.device.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.device.dto.DeviceLogCreateDTO;
import com.scac.device.dto.DeviceLogResDTO;
import com.scac.device.dto.DeviceResDTO;
import com.scac.device.dto.DeviceStatusDTO;
import com.scac.device.entity.Device;
import com.scac.device.entity.DeviceLog;
import com.scac.device.repository.DeviceLogRepository;
import com.scac.device.repository.DeviceRepository;
import com.scac.global.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DeviceService {

  private final DeviceRepository deviceRepository;
  private final DeviceLogRepository deviceLogRepository;

  // Device 엔터티 조회
  private Device findDevice(Long deviceId) {
    return deviceRepository.findById(deviceId)
      .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 장치입니다."));
  }

  // 전체 장치 현재 상태 조회
  public List<DeviceResDTO> findAllCurrentStatus() {
    return deviceRepository.findAll(Sort.by(Sort.Direction.ASC, "deviceId")).stream().map(DeviceResDTO::from)
      .toList();
  }

  // 특정 장치 현재 상태 조회
  public DeviceResDTO findCurrentStatus(Long deviceId) {
    Device device = findDevice(deviceId);

    return DeviceResDTO.from(device);
  }

  // 특정 장치 로그 전체 조회
  public List<DeviceLogResDTO> findLogs(Long deviceId) {
    // 장치 자체가 존재하는지 먼저 확인
    findDevice(deviceId);

    return deviceLogRepository.findByDeviceDeviceIdOrderByCreatedAtDescLogIdDesc(deviceId).stream()
      .map(DeviceLogResDTO::from).toList();
  }

  // 관리자 장치 상태 변경
  @Transactional
  public DeviceResDTO updateStatus(Long deviceId, DeviceStatusDTO form) {
    Device device = findDevice(deviceId);

    device.updateStatus(form.getStatus());

    DeviceLog log = DeviceLog.create(device, "STATUS_CHANGE", form.getStatus(), form.getMessage());

    deviceLogRepository.save(log);

    return DeviceResDTO.from(device);
  }

  // RTOS 장치 이벤트 수신
  @Transactional
  public DeviceLogResDTO handleDeviceEvent(DeviceLogCreateDTO form) {
    Device device = findDevice(form.getDeviceId());

    // 장치의 현재 상태 갱신
    device.updateStatus(form.getStatus());

    // 마지막 통신 시간 갱신
    device.updateLastConnectedAt(LocalDateTime.now());

    // 이력 저장
    DeviceLog log = DeviceLog.create(device, form.getEventType(), form.getStatus(), form.getMessage());

    DeviceLog savedLog = deviceLogRepository.save(log);

    return DeviceLogResDTO.from(savedLog);
  }

}