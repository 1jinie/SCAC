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

// 장치 상태별 정렬 우선순위 (오류/이상 장비 최상단 노출용: 숫자가 작을수록 우선순위 높음)
export const DEVICE_STATUS_PRIORITY = {
  ERROR: 1,
  OFFLINE: 2,
  WARNING: 3,
  NORMAL: 4,
};

// 장애/이상 발생 장비 최상단 정렬 헬퍼 함수
export const sortDevicesByAbnormalFirst = (devices = []) => {
  return [...devices].sort((a, b) => {
    const priorityA = DEVICE_STATUS_PRIORITY[a.status] ?? 99;
    const priorityB = DEVICE_STATUS_PRIORITY[b.status] ?? 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // 동일 상태일 경우 장치 ID 오름차순 정렬
    return (a.deviceId ?? 0) - (b.deviceId ?? 0);
  });
};
