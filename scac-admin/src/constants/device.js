// device 관련 상수

// 사용법 예시
// import { DEVICE_STATUS_LABELS } from "../constants/device";
// DEVICE_STATUS_LABELS[device.status] 로 사용 가능

// 장치 상태
export const DEVICE_STATUS_LABELS = {
  NORMAL: '정상',
  ERROR: '오류',
  OFFLINE: '오프라인',
};

// 장치 상태 색상
export const DEVICE_STATUS_COLORS = {
  NORMAL: 'mint',
  WARNING: 'orange',
  ERROR: 'red',
};

// 장치 유형
export const DEVICE_TYPE_LABELS = {
  PRINTER: '영수증 프린터',
  CARD_READER: '카드 단말기',
  DOOR: '출입문',
  NETWORK: '네트워크',
};
