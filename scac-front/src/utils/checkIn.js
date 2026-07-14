import { users } from '../data/User';

export function checkIn(phone, password) {
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

  return {
    success: true,
    message: '문이 열렸습니다',
    user,
  };
}
