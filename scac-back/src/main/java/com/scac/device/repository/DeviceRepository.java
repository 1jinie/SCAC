package com.scac.device.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.device.entity.Device;

public interface DeviceRepository extends JpaRepository<Device, Long> {

}
