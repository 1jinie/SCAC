package com.scac.global.enums;

public enum TicketUsageStatus {
    READY,  // 이용권 결제 후 대기상태
    ACTIVE,     // 사용을 시작했으며 아직 이용 가능
    CANCELED,   // 결제 취소
    EXPIRED,    // 시간 소진 또는 기간 만료
}
