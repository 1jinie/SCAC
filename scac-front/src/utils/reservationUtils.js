// 선택 범위 계산 함수
export function getSelectionRange(selectedTimes, startTime, currentTime) {
  const startIndex = selectedTimes.findIndex((t) => t.time === startTime);
  const currentIndex = selectedTimes.findIndex((t) => t.time === currentTime);

  return {
    startIndex: Math.min(startIndex, currentIndex),
    endIndex: Math.max(startIndex, currentIndex),
  };
}

// 예약 가능 여부 검사 함수
export function hasUnavailableTime(selectedTimes, startIndex, endIndex) {
  return selectedTimes
    .slice(startIndex + 1, endIndex + 1)
    .some((t) => !t.available);
}

// 버튼 선택 여부 함수
export function isTimeSelected(selectedTimes, startTime, endTime, currentTime) {
  if (!startTime) return false;

  if (!endTime) {
    return currentTime === startTime;
  }

  const startIndex = selectedTimes.findIndex((t) => t.time === startTime);
  const endIndex = selectedTimes.findIndex((t) => t.time === endTime);
  const currentIndex = selectedTimes.findIndex((t) => t.time === currentTime);

  return currentIndex >= startIndex && currentIndex <= endIndex;
}
