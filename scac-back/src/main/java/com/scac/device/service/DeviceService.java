package com.scac.device.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.device.dto.DeviceLogCreateDTO;
import com.scac.device.dto.DeviceLogResDTO;
import com.scac.device.dto.DeviceResDTO;
import com.scac.device.dto.DeviceStatusDTO;
import com.scac.device.entity.DeviceLog;
import com.scac.device.repository.DeviceLogRepository;
import com.scac.global.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DeviceService {
  private final DeviceLogRepository deviceLogRepository;

  // 장치별 현재 상태 조회
  public List<DeviceResDTO> findAllCurrentStatus() {

    List<DeviceLog> logs = deviceLogRepository.findAllByOrderByCreatedAtDescLogIdDesc();

    Map<String, DeviceLog> latestDevices = new LinkedHashMap<>();

    for (DeviceLog log : logs) {
      latestDevices.putIfAbsent(log.getDeviceName(), log);
    }

    return latestDevices.values().stream().map(DeviceResDTO::from).toList();
  }

  // 특정 장치 현재 상태 조회
  public DeviceResDTO findCurrentStatus(String deviceName) {
    return DeviceResDTO.from(findLatestLog(deviceName));
  }

  // 특정 장치 로그 전체 조회
  public List<DeviceLogResDTO> findLogs(String deviceName) {

    List<DeviceLog> logs = deviceLogRepository.findByDeviceNameOrderByCreatedAtDescLogIdDesc(deviceName);

    if (logs.isEmpty()) {
      throw new ResourceNotFoundException("존재하지 않는 장치입니다.");
    }

    return logs.stream().map(DeviceLogResDTO::from).toList();
  }

  // 관리자 장치 상태 변경
  @Transactional
  public DeviceResDTO updateStatus(String deviceName, DeviceStatusDTO form) {

    if (!deviceLogRepository.existsByDeviceName(deviceName)) {
      throw new ResourceNotFoundException("존재하지 않는 장치입니다.");
    }

    DeviceLog deviceLog = DeviceLog.create(deviceName, "STATUS_CHANGE", form.getStatus(), form.getMessage());

    return DeviceResDTO.from(deviceLogRepository.save(deviceLog));
  }

  private DeviceLog findLatestLog(String deviceName) {
    return deviceLogRepository.findFirstByDeviceNameOrderByCreatedAtDescLogIdDesc(deviceName)
      .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 장치입니다."));
  }

  // RTOS에서 데이터 받으면 로그 생성
  @Transactional
  public DeviceLogResDTO createLog(DeviceLogCreateDTO form) {
    DeviceLog log = DeviceLog.create(form.getDeviceName(), form.getEventType(), form.getStatus(),
      form.getMessage());
    return DeviceLogResDTO.from(log);
  }

}
