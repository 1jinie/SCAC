import {
  PAYMENT_PRODUCT_STATUS_MAP,
  PAYMENT_PRODUCT_STATUS_LABELS,
} from '../../../constants/payment';

// 결제 상품의 통합 이용 상태 반환
export const getPaymentProductStatus = (payment) => {
  if (!payment) {
    return null;
  }

  if (payment.status === 'CANCELED') {
    return 'CANCELED';
  }

  const sourceStatus = payment.reservationId
    ? payment.reservationStatus
    : payment.usageStatus;

  return PAYMENT_PRODUCT_STATUS_MAP[sourceStatus] ?? sourceStatus;
};

// UI 표시용 이용 상태명
export const getPaymentProductStatusLabel = (payment) => {
  const status = getPaymentProductStatus(payment);

  return PAYMENT_PRODUCT_STATUS_LABELS[status] ?? '-';
};

// 결제 취소 가능 여부
export const canCancelPayment = (payment) => {
  if (!payment) {
    return false;
  }

  if (payment.status !== 'PAID') {
    return false;
  }

  if (payment.usageStatus !== 'READY') {
    return false;
  }

  if (payment.reservationId && payment.reservationStatus !== 'CONFIRMED') {
    return false;
  }

  return true;
};

// 결제취소 불가 사유
export const getPaymentCancelUnavailableReason = (payment) => {
  if (!payment) {
    return '결제 정보가 없습니다.';
  }

  if (payment.status !== 'PAID') {
    return '결제 완료 상태의 결제만 취소할 수 있습니다.';
  }

  if (payment.usageStatus === 'USING') {
    return '이미 이용 중인 상품은 취소할 수 없습니다.';
  }

  if (payment.usageStatus === 'EXPIRED') {
    return '이미 이용이 완료된 상품은 취소할 수 없습니다.';
  }

  if (payment.usageStatus === 'CANCELED') {
    return '이미 취소된 상품입니다.';
  }

  if (payment.reservationId && payment.reservationStatus !== 'CONFIRMED') {
    return '이용 전 상태의 스터디룸 예약만 취소할 수 있습니다.';
  }

  return '';
};
