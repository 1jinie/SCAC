package com.scac.device.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.device.entity.Device;
import com.scac.global.enums.DeviceType;

public interface DeviceRepository extends JpaRepository<Device, Long> {

  // 시리얼 넘버 중복 확인
  boolean existsBySerialNumber(String serialNumber);

  // 시리얼넘버와 Device_id가 없는지 확인
  boolean existsBySerialNumberAndDeviceIdNot(String serialNumber, Long deviceId);

  // is_active = true (현재 운영중)장치 조회
  List<Device> findAllByIsActiveTrueOrderByDeviceIdAsc();

  // is_active = true + false (비활성 포함 모든)장치 조회
  List<Device> findAllByOrderByDeviceIdAsc();

  // Health Check용 (장치 타입별 기기는 1대만 있는 걸로 가정)
  Optional<Device> findFirstByDeviceTypeAndIsActiveTrueOrderByDeviceIdAsc(DeviceType deviceType);

}
