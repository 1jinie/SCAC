export function getSeatStyle(seat) {
  // 그리드 동적 병합
  let gridRow = seat.y;
  let gridColumn = seat.x;

  if (seat.type === 'room') {
    gridRow = `${seat.y} / span 5`;
    gridColumn = seat.id === 103 ? `${seat.x} / span 4` : `${seat.x} / span 3`;
  }

  // s6~s25 좌석들은 x좌표에 비례한 추가 margin으로 간격 확보
  // s1~s2 사이 간격(gap 포함 약 104px)의 절반 수준으로 띄움
  const isSmallSeat = seat.id >= 6 && seat.id <= 25;

  return {
    gridRow,
    gridColumn,
    ...(isSmallSeat
      ? {
          marginLeft: `${(seat.x - 1) * 40}px`,
        }
      : {}),
  };
}
