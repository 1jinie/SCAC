package com.scac.global.enums;

public enum NotificationStatus {
  PENDING, // 알림 발송 대기
  SUCCESS, // 알림 발송 성공
  FAILED, // 알림 발송 실패
  RETRY_EXHAUSTED // 알림 발송 실패 횟수 초과로 더 이상 재시도하지 않음

}
