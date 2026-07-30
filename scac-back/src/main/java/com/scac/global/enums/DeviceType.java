package com.scac.global.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DeviceType {

    PRINTER("영수증 프린터"),

    CARD_READER("카드 단말기"),

    DOOR("출입문"),

    NETWORK("네트워크");

    private final String description;
}
