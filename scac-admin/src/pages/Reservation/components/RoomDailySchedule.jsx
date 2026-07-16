const STATUS_LABELS = {
  RESERVED: '예약 완료',
  IN_USE: '이용 중',
  COMPLETED: '이용 완료',
  USER_CANCELED: '사용자 취소',
  ADMIN_CANCELED: '관리자 취소',
};

const canAdminCancel = (reservation) => reservation.status === 'RESERVED';

export default function RoomDailySchedule({
  selectedRoom,
  selectedDate,
  reservations,
  onAdminCancel,
}) {
  if (!selectedRoom) {
    return (
      <div className="admin_room_schedule_empty">
        스터디룸을 선택하면 날짜별 예약 정보가 표시됩니다.
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="admin_room_schedule_empty">
        <strong>
          {selectedRoom.roomNumber} · {selectedDate}
        </strong>
        <p>해당 날짜에 등록된 예약이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="admin_room_schedule_list">
      {reservations.map((reservation) => (
        <article
          key={reservation.reservationId}
          className="admin_room_schedule_item"
        >
          <div className="admin_room_schedule_time">
            <strong>{reservation.startTime}</strong>
            <span>~ {reservation.endTime}</span>
          </div>

          <div className="admin_room_schedule_info">
            <strong>{reservation.phoneNumber}</strong>
            <span>예약번호 #{reservation.reservationId}</span>
          </div>

          <span
            className={`admin_status_badge reservation_${reservation.status.toLowerCase()}`}
          >
            {STATUS_LABELS[reservation.status]}
          </span>

          {canAdminCancel(reservation) && (
            <button
              type="button"
              className="admin_reservation_cancel_button"
              onClick={() => onAdminCancel(reservation.reservationId)}
            >
              예약 취소
            </button>
          )}
        </article>
      ))}
    </div>
  );
}
