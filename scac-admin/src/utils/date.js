// 날짜, 시간 관련 함수

// 사용할 페이지에선
// {포멧함수(변환할 데이터)} ex. import { formatClock } from '../utils/date.js'; + <div>{formatClock(data)}</div>
// 이런식으로 사용하시면 됩니다.

// 00:00 형태
// 받는 데이터는 Date 객체로 변환 후 사용하셔야 합니다.
// ex. const date = new Date('2023-01-01T00:00:00'); + formatClock(date);
export const formatClock = (time) => {
  if (!(time instanceof Date)) return "";
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// 000 시간 00 분 형태
export const formatfullClock = (time) => {
  if (!(time instanceof Date)) return "";
  const hours = time.getHours().toString().padStart(3, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  return `${hours} 시간 ${minutes} 분`;
};

// 스터디룸에서 화 7/27 형식으로 출력
export const formatDate = (fullDate) => {
  const date = new Date(fullDate);

  return {
    day: date.toLocaleDateString("ko-KR", {
      weekday: "short",
    }),
    date: `${date.getMonth() + 1}/${date.getDate()}`,
  };
};

// 스터디룸 두번째 클릭 시 한시간 추가됨
export const addOneHour = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date(2000, 0, 1, hour, minute);

  date.setHours(date.getHours() + 1);

  return date.toTimeString().slice(0, 5);
};

// 2023-01-01 형태
export const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// 메모장 날짜 형식 2026-07-21 10:42
export function formatAdminMemoDate(date) {
  if (!date) return "";

  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
}
