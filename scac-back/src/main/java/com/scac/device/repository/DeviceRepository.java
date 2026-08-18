package com.scac.device.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.device.entity.Device;

public interface DeviceRepository extends JpaRepository<Device, Long> {

  // 시리얼 넘버 중복 확인
  boolean existsBySerialNumber(String serialNumber);

  // 시리얼넘버와 Device_id가 없는지 확인
  boolean existsBySerialNumberAndDeviceIdNot(String serialNumber, Long deviceId);

}
