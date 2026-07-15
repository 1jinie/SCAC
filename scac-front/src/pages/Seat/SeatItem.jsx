import { getSeatStyle } from '../../utils/getSeatStyle';
import { rooms } from '../../data/RoomInfo';

function SeatItem({ seat, isSelected, onClick, mode }) {
  const room = seat.type === 'room' ? rooms[seat.id] : null;
  let effectiveStatus = seat.status;

  if (mode === 'seat' && seat.type === 'room') {
    effectiveStatus = 'unavailable';
  }

  if (mode === 'room' && seat.type === 'seat') {
    effectiveStatus = 'unavailable';
  }

  const classNames = ['seat', effectiveStatus];

  if (seat.type === 'room') classNames.push('room');
  if (isSelected) classNames.push('selected');

  let seatIcon;
  switch (effectiveStatus) {
    case 'using':
      seatIcon = '/icons/common/person.svg';
      break;
    case 'repair':
      seatIcon = '/icons/common/wrench.svg';
      break;
    default:
      seatIcon = '/icons/common/chair.svg';
  }

  const roomIcon =
    room?.capacity === 4
      ? '/icons/common/4people_table_icon.svg'
      : '/icons/common/6people_table_icon.svg';

  return (
    <div
      className={classNames.join(' ')}
      onClick={onClick}
      style={getSeatStyle(seat)}
    >
      {seat.type === 'room' ? (
        <>
          <div className="room_header">STUDY ROOM</div>
          <div className="room_title">
            <span className="room_code">{room.name}</span>
            <span className="room_capacity">{room.capacity}인실</span>
          </div>
          <img src={roomIcon} alt="" className="room_icon" />
        </>
      ) : (
        <>
          <div className="seat_number">{seat.name}</div>
          {seatIcon && <img src={seatIcon} alt="" className="seat_icon" />}
          <div className="seat_status">
            {effectiveStatus === 'using'
              ? '사용중'
              : effectiveStatus === 'repair'
                ? '점검중'
                : ''}
          </div>
        </>
      )}
    </div>
  );
}

export default SeatItem;
