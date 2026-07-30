package com.scac.global.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DeviceStatus {

    NORMAL("정상"),

    ERROR("장애"),

    OFFLINE("오프라인");

    private final String description;
}
