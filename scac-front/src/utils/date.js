// 날짜, 시간 관련 함수

// 사용할 페이지에선
// {포멧함수(변환할 데이터)} ex. import { formatClock } from '../utils/date.js'; + <div>{formatClock(data)}</div>
// 이런식으로 사용하시면 됩니다.

// 00:00 형태
// 받는 데이터는 Date 객체로 변환 후 사용하셔야 합니다.
// ex. const date = new Date('2023-01-01T00:00:00'); + formatClock(date);
export const formatClock = (time) => {
  if (!(time instanceof Date)) return '';
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
