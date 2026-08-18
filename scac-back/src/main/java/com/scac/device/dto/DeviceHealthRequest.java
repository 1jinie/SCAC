package com.scac.device.dto;

public record DeviceHealthRequest(
    String deviceId,
    String status,
    String door,
    String cardReader,
    String printer) {
}
