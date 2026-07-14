import { users } from '../data/User';
import { checkInStore } from '../store/checkInStore';

export function checkOut(phone, password) {
  // 사용자 확인
  const user = users.find(
    (user) => user.phone === phone && user.password === password,
  );

  if (!user) {
    return {
      success: false,
      message: '정보가 일치하지 않습니다',
    };
  }

  const activeCheckIn = checkInStore
    .getState()
    .checkIns.find(
      (checkIn) => checkIn.userId === user.id && checkIn.checkOutTime === null,
    );

  if (!activeCheckIn) {
    return {
      success: false,
      message: '입실 기록이 없습니다',
    };
  }

  return {
    success: true,
    message: '퇴실되었습니다',
    user,
    checkIn: activeCheckIn,
  };
}
