import { users } from '../data/User';
import { checkIns } from '../data/CheckIn';

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

  // 현재 입실 여부 확인
  const activeCheckIn = checkIns.find(
    (checkIn) => checkIn.userId === user.id && checkIn.checkOutTime === null,
  );

  if (activeCheckIn) {
    return {
      success: false,
      message: '이미 입실하셨습니다',
    };
  }

  return {
    success: true,
    message: '문이 열렸습니다',
    user,
    seatId,
  };
}
