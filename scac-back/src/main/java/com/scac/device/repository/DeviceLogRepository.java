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

  // Page<DeviceLog> findByDeviceNameOrderByCreatedAtDescLogIdDesc(String
  // deviceName, Pageable pageable);

  // 특정 장치 로그 최신순 조회
  List<DeviceLog> findByDeviceDeviceIdOrderByCreatedAtDescLogIdDesc(Long deviceId);

  // 특정 장치 로그 최신 한건
  Optional<DeviceLog> findFirstByDeviceDeviceIdOrderByCreatedAtDescLogIdDesc(Long deviceId);

  // Device_id 중복 확인
  boolean existsByDeviceDeviceId(Long deviceId);
}
