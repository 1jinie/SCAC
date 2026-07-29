// seat 관련 상수

// 사용법 예시
// import { SEAT_STATUS_LABELS } from "../constants/seat";
// SEAT_STATUS_LABELS[seat.status] 로 사용 가능

// 좌석 상태
export const SEAT_STATUS_LABELS = {
  AVB: '이용 가능',
  USR: '사용 중',
  BRK: '점검 중',
  UNA: '비활성',
};

export const SEAT_STATUS_TO_UI = {
  AVB: 'available',
  USR: 'using',
  BRK: 'repair',
  UNA: 'unavailable',
};
