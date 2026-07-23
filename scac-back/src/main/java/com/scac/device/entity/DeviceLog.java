package com.scac.device.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Device_Log")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DeviceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_log_id")
    private Long id;

    @Column(name = "device_name", nullable = false, length = 50)
    private String deviceName; // KIOSK, DOOR, PRINTER, CARD_READER 등

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType; // HEARTBEAT, PAPER_JAM, DISCONNECT, ENTRY_SUCCESS 등

    @Column(name = "status", nullable = false, length = 20)
    private String status; // NORMAL, ERROR

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    @Builder
    public DeviceLog(String deviceName, String eventType, String status, String message) {
        this.deviceName = deviceName;
        this.eventType = eventType;
        this.status = status;
        this.message = message;
    }
}