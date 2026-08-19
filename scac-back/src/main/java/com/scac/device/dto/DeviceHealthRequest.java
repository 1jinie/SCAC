package com.scac.device.dto;

public record DeviceHealthRequest(
    Long kioskId,
    String kioskName,
    String status,
    String door,
    String cardReader,
    String printer) {
}
