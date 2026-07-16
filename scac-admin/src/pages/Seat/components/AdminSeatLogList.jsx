import userSeatLog from '../../../data/admin_log.json';

export default function AdminSeatLogList({ selectedSeat }) {
  if (!selectedSeat) {
    return null;
  }

  return (
    <section className="admin_seat_logs">
      <div className="admin_section_header">
        <div>
          <h2>좌석 이용 로그</h2>
          <p>{selectedSeat.seatNumber}번 좌석의 최근 기록입니다.</p>
        </div>
      </div>

      <div className="admin_log_empty">
        현재는 더미 로그를 연결할 예정입니다.
      </div>
    </section>
  );
}
