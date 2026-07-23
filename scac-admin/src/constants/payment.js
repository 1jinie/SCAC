// Payment 관련 상수

// 사용법 예시
// import { PAYMENT_STATUS_LABELS } from "../constants/payment";
// PAYMENT_STATUS_LABELS[payment.status] 로 사용 가능

// 결제 상태
export const PAYMENT_STATUS_LABELS = {
  COMPLETED: '결제 완료',
  CANCELED: '결제 취소',
  FAILED: '결제 실패',
};

// 결제 수단
export const PAYMENT_METHOD_LABELS = {
  CARD: '카드',
  EASY_PAY: '간편 결제',
};

// 결제 상품 유형
export const PAYMENT_PRODUCT_TYPE_LABELS = {
  TICKET: '이용권',
  MEETING_ROOM: '스터디룸',
};
