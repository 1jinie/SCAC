import { getSeatStyle } from '../../utils/getSeatStyle';

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

  // 비활성화일 때 이름을 보이지 않음
  const label = effectiveStatus === 'unavailable' ? '' : seat.name;

  return (
    <div
      className={classNames.filter(Boolean).join(' ')}
      onClick={onClick}
      style={getSeatStyle(seat)}
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
