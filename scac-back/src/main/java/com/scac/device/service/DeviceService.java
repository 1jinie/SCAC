package com.scac.device.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.device.dto.DeviceActiveDTO;
import com.scac.device.dto.DeviceCreateDTO;
import com.scac.device.dto.DeviceHealthRequest;
import com.scac.device.dto.DeviceLogCreateDTO;
import com.scac.device.dto.DeviceLogResDTO;
import com.scac.device.dto.DeviceResDTO;
import com.scac.device.dto.DeviceStatusDTO;
import com.scac.device.dto.DeviceUpdateDTO;
import com.scac.device.entity.Device;
import com.scac.device.entity.DeviceLog;
import com.scac.device.repository.DeviceLogRepository;
import com.scac.device.repository.DeviceRepository;
import com.scac.global.enums.DeviceStatus;
import com.scac.global.enums.DeviceType;
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
    if (serialNumber == null) {
      return;
    }
    boolean duplicated = deviceId == null ? deviceRepository.existsBySerialNumber(serialNumber)
      : deviceRepository.existsBySerialNumberAndDeviceIdNot(serialNumber, deviceId);
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

  /*
   * -------------------------------------------------------------------
   * --------------------- 관리자 장치관리 페이지 -------------------------
   * -------------------------------------------------------------------
   */

  // 현재 운영중인 장치 현재 상태 조회(기존에 이 메서드를 사용중인 곳이 있어서 유지)
  public List<DeviceResDTO> findAllCurrentStatus() {
    return deviceRepository.findAllByIsActiveTrueOrderByDeviceIdAsc().stream().map(DeviceResDTO::from)
      .toList();

  }

  // includeInactive = false : 현재운영중 장치,
  // includeInactive = true : 비활성화된 장치 포함 모든 장치 조회
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

  // 관리자 장치 등록
  @Transactional
  public DeviceResDTO create(DeviceCreateDTO form) {

    String serialNumber = normalize(form.getSerialNumber());

    validateSerialNumber(serialNumber, null);

    Device device = Device.create(form.getDeviceName().trim(), form.getDeviceType(),
      normalize(form.getLocation()), normalize(form.getIpAddress()), serialNumber);

    return DeviceResDTO.from(deviceRepository.save(device));
  }

  // 관리자 장치 수정
  @Transactional
  public DeviceResDTO update(Long deviceId, DeviceUpdateDTO form) {

    Device device = findDevice(deviceId);

    String serialNumber = normalize(form.getSerialNumber());

    validateSerialNumber(serialNumber, deviceId);

    device.update(form.getDeviceName().trim(), form.getDeviceType(), normalize(form.getLocation()),
      normalize(form.getIpAddress()), serialNumber);

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

  /*
   * -------------------------------------------------------------------
   * ---------------------------- RTOS ---------------------------------
   * -------------------------------------------------------------------
   */

  // RTOS 장치 이벤트 수신 (비활성화된 장치 이벤트는 처리 안받음)
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

  // 장치의 LastConnectedAt와 Status 업데이트
  private void updateHealth(DeviceType deviceType, DeviceStatus newStatus, LocalDateTime connectedAt) {
    // 현재는 키오스크 1대 및 장치 타입별 1대 기준으로 처리
    deviceRepository.findFirstByDeviceTypeAndIsActiveTrueOrderByDeviceIdAsc(deviceType).ifPresent(device -> {
      device.updateLastConnectedAt(connectedAt);
      if (device.getStatus() != newStatus) {
        device.updateStatus(newStatus);
      }
    });
  }

  // Health Check 받은 데이터를 DeviceStatus로 변환 (공통)
  private DeviceStatus convertNetworkStatus(String status) {
    if ("ONLINE".equalsIgnoreCase(status)) {
      return DeviceStatus.NORMAL;
    }
    if ("OFFLINE".equalsIgnoreCase(status)) {
      return DeviceStatus.OFFLINE;
    }
    return DeviceStatus.ERROR;
  }

  // Health Check - Door
  private DeviceStatus convertDoorStatus(String status) {
    if ("OPEN".equalsIgnoreCase(status) || "CLOSE".equalsIgnoreCase(status)
      || "CLOSED".equalsIgnoreCase(status)) {
      return DeviceStatus.NORMAL;
    }
    if ("OFFLINE".equalsIgnoreCase(status)) {
      return DeviceStatus.OFFLINE;
    }
    return DeviceStatus.ERROR;
  }

  // Health Check - Card Reader
  private DeviceStatus convertCardReaderStatus(String status) {
    if ("WAITING".equalsIgnoreCase(status) || "READY".equalsIgnoreCase(status)) {
      return DeviceStatus.NORMAL;
    }
    if ("OFFLINE".equalsIgnoreCase(status)) {
      return DeviceStatus.OFFLINE;
    }
    return DeviceStatus.ERROR;
  }

  // Health Check - Printer
  private DeviceStatus convertPrinterStatus(String status) {
    if ("READY".equalsIgnoreCase(status)) {
      return DeviceStatus.NORMAL;
    }
    if ("OFFLINE".equalsIgnoreCase(status)) {
      return DeviceStatus.OFFLINE;
    }
    return DeviceStatus.ERROR;
  }

  // DeviceHealthRequest 데이터 받아서 HealthCheck하는 통합 메서드
  @Transactional
  public void handleHealthCheck(DeviceHealthRequest request) {
    LocalDateTime now = LocalDateTime.now();
    updateHealth(DeviceType.NETWORK, convertNetworkStatus(request.status()), now);
    updateHealth(DeviceType.DOOR, convertDoorStatus(request.door()), now);
    updateHealth(DeviceType.CARD_READER, convertCardReaderStatus(request.cardReader()), now);
    updateHealth(DeviceType.PRINTER, convertPrinterStatus(request.printer()), now);
  }

}