function SeatItem({ seat, isSelected, onClick }) {
  const classNames = ['seat', seat.status, seat.name];

  if (isSelected) {
    classNames.push('selected');
  }

  // Determine grid span dynamically
  let gridRow = seat.y;
  let gridColumn = seat.x;
  const isRoom = seat.name.startsWith('r');

  if (seat.name === 'r1' || seat.name === 'r2') {
    gridRow = `${seat.y} / span 5`;
    gridColumn = `${seat.x} / span 3`;
  } else if (seat.name === 'r3') {
    gridRow = `${seat.y} / span 5`;
    gridColumn = `${seat.x} / span 4`;
  }

  // s6~s25 좌석들은 x좌표에 비례한 추가 margin으로 간격 확보
  // s1~s2 사이 간격(gap 포함 약 104px)의 절반 수준으로 띄움
  const isSmallSeat = seat.id >= 6 && seat.id <= 25;
  const extraMarginLeft = isSmallSeat ? (seat.x - 1) * 40 : 0;

  // Show empty label for unavailable seats as shown in the mockup
  const label = seat.status === 'unavailable' ? '' : seat.name;

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
      {isRoom ? (
        <div className="room_door" />
      ) : (
        <div className="seat_inner">{label}</div>
      )}
    </div>
  );
}

export default SeatItem;
