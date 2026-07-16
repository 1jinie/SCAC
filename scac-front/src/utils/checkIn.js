import { users } from '../data/User';
import { checkInStore } from '../store/checkInStore';

export function checkIn(phone, password, seatId) {
  const user = users.find(
    (user) => user.phone === phone && user.password === password,
  );

  if (!user) {
    return {
      success: false,
      message: '정보가 일치하지 않습니다',
    };
  }

  if (user.timeLeft <= 0) {
    return {
      success: false,
      message: '잔여 시간이 없습니다',
    };
  }

  // 현재 입실 기록 조회
  const activeCheckIn = checkInStore
    .getState()
    .checkIns.find(
      (checkIn) => checkIn.userId === user.id && checkIn.checkOutTime === null,
    );

  // 실제 사용중인 경우만 막기
  if (activeCheckIn) {
    if (activeCheckIn.status !== 'away') {
      return {
        success: false,
        message: '이미 입실하셨습니다',
      };
    }
  }

  // 외출 복귀
  if (activeCheckIn?.status === 'away') {
    return {
      success: true,
      message: '재입실하였습니다',
      user,
      activeCheckIn,
      comeback: true,
    };
  }

  return {
    success: true,
    message: '좌석을 선택해주세요',
    user,
    seatId,
  };
}
