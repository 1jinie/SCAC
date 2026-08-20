package com.scac.device.dto;

import jakarta.validation.constraints.NotBlank;

public record DeviceHealthRequest(Long kioskId, String kioskName, @NotBlank String status,
    @NotBlank String door, @NotBlank String cardReader, @NotBlank String printer) {
}
