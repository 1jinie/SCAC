package com.scac.device.dto;

import jakarta.validation.constraints.NotBlank;

public record DeviceHealthRequest(Long kioskId, String kioskName,
    @NotBlank(message = "장치 상태는 필수입니다.") String status, @NotBlank(message = "도어 상태는 필수입니다.") String door,
    @NotBlank(message = "카드 리더기 상태는 필수입니다.") String cardReader,
    @NotBlank(message = "프린터 상태는 필수입니다.") String printer) {
}
