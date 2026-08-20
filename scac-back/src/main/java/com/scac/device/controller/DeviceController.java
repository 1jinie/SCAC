package com.scac.device.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.device.dto.DeviceResDTO;
import com.scac.device.entity.Device;
import com.scac.device.repository.DeviceRepository;
import com.scac.device.service.DeviceService;
import com.scac.global.enums.DeviceStatus;
import com.scac.global.exception.ResourceNotFoundException;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceService deviceService;
    private final DeviceRepository deviceRepository;

    public DeviceController(DeviceRepository deviceRepository, DeviceService deviceService){
        this.deviceRepository = deviceRepository;
        this.deviceService = deviceService;
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

    // -------------- 시연용 --------------
    // 장치 상태 변경
    @PatchMapping("/{deviceId}/status")
    public DeviceResDTO updateDeviceStatus(@PathVariable Long deviceId, @RequestBody Map<String, String> request){
        DeviceStatus status = DeviceStatus.valueOf(request.get("status"));

        return deviceService.updateDemoStatus(deviceId, status);
    }
    
}
