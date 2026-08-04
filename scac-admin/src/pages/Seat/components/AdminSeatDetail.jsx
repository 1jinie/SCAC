import AdminSeatStatusButtons from "./AdminSeatStatusButtons";
import AdminSeatUserInfo from "./AdminSeatUserInfo";

const STATUS_LABELS = {
  AVB: "이용 가능",
  USR: "사용 중",
  BRK: "점검 중",
};

export default function AdminSeatDetail({ selectedSeat, onSeatChange }) {
  if (!selectedSeat) {
    return (
      <aside className="admin_seat_detail is_empty">
        <p>좌석을 선택하면 상세 정보가 표시됩니다.</p>
      </aside>
    );
  }

  return (
    <aside className="admin_seat_detail">
      <div className="admin_section_header">
        <div>
          <p className="admin_section_eyebrow">SEAT INFORMATION</p>
          <h2>{selectedSeat.seatNumber} 좌석</h2>
        </div>

        <span className={`admin_seat_status status_${selectedSeat.status}`}>
          {STATUS_LABELS[selectedSeat.status]}
        </span>
      </div>

      <dl className="admin_seat_info_list">
        <div>
          <dt>좌석 번호</dt>
          <dd>{selectedSeat.seatNumber}</dd>
        </div>

        <div>
          <dt>현재 상태</dt>
          <dd>{STATUS_LABELS[selectedSeat.status]}</dd>
        </div>
      </dl>

      {selectedSeat.status === "USR" && selectedSeat.user && (
        <AdminSeatUserInfo user={selectedSeat.user} />
      )}

      <AdminSeatStatusButtons
        selectedSeat={selectedSeat}
        onSeatChange={onSeatChange}
      />
    </aside>
  );
}
