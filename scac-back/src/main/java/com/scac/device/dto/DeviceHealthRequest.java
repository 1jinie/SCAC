package com.scac.device.dto;

import com.scac.device.enums.CardReaderStatus;
import com.scac.device.enums.DeviceNetworkStatus;
import com.scac.device.enums.DoorStatus;
import com.scac.device.enums.PrinterStatus;

public record DeviceHealthRequest(
    Long kioskId,
    String kioskName,
    DeviceNetworkStatus status,
    DoorStatus door,
    CardReaderStatus cardReader,
    PrinterStatus printer) {
}
