package com.scac.device.repository;

import java.util.List;
import java.util.Optional;

// import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
// import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.device.entity.DeviceLog;

public interface DeviceLogRepository extends JpaRepository<DeviceLog, Long> {

  // 전체 로그 최신순 조회
  List<DeviceLog> findAllByOrderByCreatedAtDescLogIdDesc();

  // 특정 장치 로그 최신순 조회
  List<DeviceLog> findByDeviceNameOrderByCreatedAtDescLogIdDesc(String deviceName);

  // 특정 장치의 가장 최신 상태
  Optional<DeviceLog> findFirstByDeviceNameOrderByCreatedAtDescLogIdDesc(String deviceName);

  // Page<DeviceLog> findByDeviceNameOrderByCreatedAtDescLogIdDesc(String
  // deviceName, Pageable pageable);

  boolean existsByDeviceName(String deviceName);

}
