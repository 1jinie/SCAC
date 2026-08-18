package com.scac.device.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.device.dto.DeviceActiveDTO;
import com.scac.device.dto.DeviceCreateDTO;
import com.scac.device.dto.DeviceLogCreateDTO;
import com.scac.device.dto.DeviceLogResDTO;
import com.scac.device.dto.DeviceResDTO;
import com.scac.device.dto.DeviceStatusDTO;
import com.scac.device.dto.DeviceUpdateDTO;
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

  // 시리얼번호와 device_id 중복확인
  private void validateSerialNumber(String serialNumber, Long deviceId) {
    String normalizedSerialNumber = normalize(serialNumber);
    if (normalizedSerialNumber == null) {
      return;
    }
    boolean duplicated;
    if (deviceId == null) {
      duplicated = deviceRepository.existsBySerialNumber(normalizedSerialNumber);
    } else {
      duplicated = deviceRepository.existsBySerialNumberAndDeviceIdNot(normalizedSerialNumber, deviceId);
    }

    if (duplicated) {
      throw new IllegalArgumentException("이미 등록된 시리얼 번호입니다.");
    }
  }

  // 글자 입력받을때 빈칸 확인
  private String normalize(String value) {
    if (value == null || value.isBlank()) {
      return null;
    }
    return value.trim();
  }

  // Device 엔터티 조회
  private Device findDevice(Long deviceId) {
    return deviceRepository.findById(deviceId)
      .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 장치입니다."));
  }

  // 현재 운영중인 장치 현재 상태 조회
  public List<DeviceResDTO> findAllCurrentStatus() {
    return deviceRepository.findAllByIsActiveTrueOrderByDeviceIdAsc().stream().map(DeviceResDTO::from)
      .toList();

  }

  // 비활성 장치 포함 모든 장치 조회
  public List<DeviceResDTO> findAllCurrentStatus(boolean includeInactive) {

    List<Device> devices = includeInactive ? deviceRepository.findAllByOrderByDeviceIdAsc()
      : deviceRepository.findAllByIsActiveTrueOrderByDeviceIdAsc();

    return devices.stream().map(DeviceResDTO::from).toList();
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

    if (!Boolean.TRUE.equals(device.getIsActive())) {
      throw new IllegalStateException("비활성화된 장치(device id :" + form.getDeviceId() + ")의 이벤트는 처리할 수 없습니다.");
    }

    // 장치의 현재 상태 갱신
    device.updateStatus(form.getStatus());

    // 마지막 통신 시간 갱신
    device.updateLastConnectedAt(LocalDateTime.now());

    // 이력 저장
    DeviceLog log = DeviceLog.create(device, form.getEventType(), form.getStatus(), form.getMessage());

    DeviceLog savedLog = deviceLogRepository.save(log);

    return DeviceLogResDTO.from(savedLog);
  }

  // 관리자 장치 등록
  @Transactional
  public DeviceResDTO create(DeviceCreateDTO form) {

    validateSerialNumber(form.getSerialNumber(), null);

    Device device = Device.create(form.getDeviceName(), form.getDeviceType(), form.getLocation(),
      form.getIpAddress(), normalize(form.getSerialNumber()));

    Device savedDevice = deviceRepository.save(device);

    return DeviceResDTO.from(savedDevice);
  }

  // 관리자 장치 정보 수정
  @Transactional
  public DeviceResDTO update(Long deviceId, DeviceUpdateDTO form) {

    Device device = findDevice(deviceId);

    validateSerialNumber(form.getSerialNumber(), deviceId);

    device.update(form.getDeviceName(), form.getDeviceType(), form.getLocation(), form.getIpAddress(),
      normalize(form.getSerialNumber()));

    return DeviceResDTO.from(device);
  }

  // 관리자 장치 삭제
  @Transactional
  public void delete(Long deviceId) {

    Device device = findDevice(deviceId);

    if (deviceLogRepository.existsByDeviceDeviceId(deviceId)) {
      throw new IllegalStateException("장치 로그가 존재하는 장치는 삭제할 수 없습니다.");
    }

    deviceRepository.delete(device);
  }

  // 관리자 장치 활성화 비활성화
  @Transactional
  public DeviceResDTO updateActive(Long deviceId, DeviceActiveDTO form) {
    Device device = findDevice(deviceId);
    if (Boolean.TRUE.equals(form.getIsActive())) {
      device.activate();
    } else {
      device.deactivate();
    }
    return DeviceResDTO.from(device);
  }

}