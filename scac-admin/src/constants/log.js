// log 관련 상수

// 사용법 예시
// import { LOG_TYPE_LABELS, LOG_LEVEL_LABELS } from '../constants/log';
// LOG_TYPE_LABELS[log.type] 로 사용 가능
// LOG_LEVEL_LABELS[log.level] 로 사용 가능

// 로그 유형
export const LOG_TYPE_LABELS = {
  AUTH: '인증',
  USER: '회원',
  SEAT: '좌석',
  TICKET: '이용권',
  PAYMENT: '결제',
  RESERVATION: '예약',
  DEVICE: '장치',
  NOTIFICATION: '알림',
  PENALTY: '제재',
  SYSTEM: '시스템',
};

// 로그 중요도
export const LOG_LEVEL_LABELS = {
  INFO: '안내',
  WARNING: '주의',
  ERROR: '오류',
};

// 로그 대상
export const LOG_TARGET_TYPE_LABELS = {
  USER: '회원',
  SEAT: '좌석',
  MEETING_ROOM: '스터디룸',
  TICKET: '이용권',
  PAYMENT: '결제',
  DEVICE: '장치',
  RESERVATION: '예약',
};

// 연관 데이터
export const LOG_REFERENCE_TYPE_LABELS = {
  USER: '회원',
  TICKET_USAGE: '이용 내역',
  PAYMENT: '결제',
  RESERVATION: '예약',
  PENALTY: '제재',
  DEVICE_LOG: '장치 로그',
  NOTIFICATION_LOG: '알림 로그',
};

// 로그 액션
export const LOG_ACTION_LABELS = {
  CHECK_IN: '입실',
  CHECK_OUT: '퇴실',
  AWAY: '외출',
  RETURN: '외출 복귀',

  PAYMENT_COMPLETED: '결제 완료',
  PAYMENT_CANCELED: '결제 취소',
  PAYMENT_FAILED: '결제 실패',

  RESERVATION_CREATED: '예약 등록',
  RESERVATION_CANCELED: '예약 취소',

  USER_STATUS_CHANGED: '회원 상태 변경',
  USER_ROLE_CHANGED: '회원 권한 변경',

  TICKET_STATUS_CHANGED: '이용권 상태 변경',

  DEVICE_ERROR: '장치 오류',

  PENALTY_CREATED: '제재 등록',
};
