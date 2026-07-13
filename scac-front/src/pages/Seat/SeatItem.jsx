function SeatItem({ seat, isSelected, onClick, mode }) {
  let effectiveStatus = seat.status;

  if (mode === 'seat' && seat.type === 'room') {
    effectiveStatus = 'unavailable';
  }

  if (mode === 'room' && seat.type === 'seat') {
    effectiveStatus = 'unavailable';
  }

  const classNames = ['seat', effectiveStatus, seat.name];

  if (isSelected) {
    classNames.push('selected');
  }

  if (seat.type === 'room') {
    classNames.push('room');
  }

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
  const extraMarginLeft = isSmallSeat ? (seat.x - 1) * 40 : 0;

  // Show empty label for unavailable seats as shown in the mockup
  const label = effectiveStatus === 'unavailable' ? '' : seat.name;

  return (
    <div
      className={classNames.filter(Boolean).join(' ')}
      onClick={onClick}
      style={{
        gridRow,
        gridColumn,
        ...(extraMarginLeft > 0 ? { marginLeft: `${extraMarginLeft}px` } : {}),
      }}
    >
      {seat.type === 'room' ? (
        <>
          <div className="room_door" />
          <div className="room_name">{label}</div>
        </>
      ) : (
        <div className="seat_inner">{label}</div>
      )}
    </div>
  );
}

export default SeatItem;
