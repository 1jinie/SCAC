package com.scac.device.dto;

import com.scac.device.enums.CardReaderStatus;
import com.scac.device.enums.DeviceNetworkStatus;
import com.scac.device.enums.DoorStatus;
import com.scac.device.enums.PrinterStatus;

import jakarta.validation.constraints.NotNull;

public record DeviceHealthRequest(
    Long kioskId,
    String kioskName,
    @NotNull(message = "네트워크 상태는 필수입니다.") DeviceNetworkStatus status,
    @NotNull(message = "도어 상태는 필수입니다.") DoorStatus door,
    @NotNull(message = "카드 리더기 상태는 필수입니다.") CardReaderStatus cardReader,
    @NotNull(message = "프린터 상태는 필수입니다.") PrinterStatus printer) {
}
