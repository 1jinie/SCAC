package com.scac.device.dto;

import com.scac.device.enums.CardReaderStatus;
import com.scac.device.enums.DeviceNetworkStatus;
import com.scac.device.enums.DoorStatus;
import com.scac.device.enums.PrinterStatus;
import jakarta.validation.constraints.NotBlank;

public record DeviceHealthRequest(
    Long kioskId,
    String kioskName,
    @NotBlank(message = "네트워크 상태는 필수입니다.") DeviceNetworkStatus status,
    @NotBlank(message = "도어 상태는 필수입니다.") DoorStatus door,
    @NotBlank(message = "카드 리더기 상태는 필수입니다.") CardReaderStatus cardReader,
    @NotBlank(message = "프린터 상태는 필수입니다.") PrinterStatus printer) {
}
