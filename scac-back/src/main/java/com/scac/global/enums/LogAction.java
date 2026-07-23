package com.scac.global.enums;

// 로그에 표시할 행동
// 필요하시면 추가하세요
public enum LogAction {
  CHECK_IN, // 입실
  CHECK_OUT, // 퇴실
  AWAY, // 외출
  RETURN, // 재입실

  PAYMENT_COMPLETED, // 결제 완료
  PAYMENT_CANCELED, // 결제 취소
  PAYMENT_FAILED, // 결제 실패

  RESERVATION_CREATED,  // 스터디룸 예약 생성
  RESERVATION_CANCELED, // 스터디룸 예약 취소

  USER_STATUS_CHANGED, // 회원 상태 변경
  USER_ROLE_CHANGED, // 회원 역할 변경
  TICKET_STATUS_CHANGED, // 이용권 상태 변경

  DEVICE_ERROR,  // 장치 오류
  PENALTY_CREATED   // 패널티 생성
}
