package com.scac.global.enums;

public enum TicketUsageStatus {
    READY,  // 이용권 결제 후 대기상태
    USING,  // 사용중
    AWAY,   // 외출중
    EXPIRED,    // 만기
}
