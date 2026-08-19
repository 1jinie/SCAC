package com.scac.device.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.device.entity.Device;
import com.scac.device.repository.DeviceRepository;
import com.scac.global.exception.ResourceNotFoundException;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceRepository deviceRepository;

    public DeviceController(DeviceRepository deviceRepository){
        this.deviceRepository = deviceRepository;
    }

    // 장치의 현재 상태 조회
    @GetMapping("/{deviceId}/status")
    public Map<String, Object> getDeviceStatus(@PathVariable Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new ResourceNotFoundException("장치를 찾을 수 없습니다"));
        
        return Map.of(
            "deviceId", device.getDeviceId(),
            "status", device.getStatus()
        );
    }
    
}
