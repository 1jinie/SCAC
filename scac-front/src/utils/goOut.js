import { users } from '../data/User';
import { checkIns } from '../data/CheckIn';

export function goOut(phone, password, checkIns) {
  const user = users.find(
    (user) => user.phone === phone && user.password === password,
  );

  if (!user) {
    return {
      success: false,
      message: '정보가 일치하지 않습니다.',
    };
  }

  const activeCheckIn = checkIns.find(
    (checkIn) => checkIn.userId === user.id && checkIn.checkOutTime === null,
  );

  if (!activeCheckIn) {
    return {
      success: false,
      message: '입실 정보가 없습니다',
    };
  }

  if (activeCheckIn.status === 'away') {
    return {
      success: false,
      message: '이미 외출 중입니다',
    };
  }

  return {
    success: true,
    message: '외출 처리 되었습니다. 3시간 안에 들어오지 않으면 퇴실처리 됩니다',
    user,
    checkIn: activeCheckIn,
  };
}
