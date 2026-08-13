package com.scac.device.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.device.entity.DeviceCommand;

public interface DeviceCommandRepository extends JpaRepository<DeviceCommand, Long>{

    
}
