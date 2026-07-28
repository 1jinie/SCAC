import { getSeatStyle } from '../../../utils/getSeatStyle';

function SeatItem({ seat, isSelected, onClick, mode }) {
  const room = seat.type === 'room' ? seat : null;
  let effectiveStatus = seat.status;

  // 좌석 모드일 경우 스터디룸 비활성화
  if (mode === 'seat' && seat.type === 'room') {
    effectiveStatus = 'unavailable';
  }

  // 스터디룸 모드일 경우 좌석 비활성화
  if (mode === 'room' && seat.type === 'seat') {
    effectiveStatus = 'unavailable';
  }

  const classNames = ['seat', effectiveStatus];

  if (seat.type === 'room') classNames.push('room');
  if (isSelected) classNames.push('selected');

  // 상태에 따른 아이콘 변경
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

  // 스터디룸 최대인원에 따른 아이콘 변경
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
