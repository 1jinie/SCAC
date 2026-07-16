const STATUS_LABELS = {
  AVB: '이용 가능',
  USR: '이용 중',
  BRK: '점검 중',
};

export default function AdminRoomDetail({ selectedRoom }) {
  if (!selectedRoom) {
    return (
      <aside className="admin_room_detail is_empty">
        <div>
          <strong>스터디룸을 선택해 주세요.</strong>
          <p>스터디룸을 선택하면 현재 상태와 이용 정보가 표시됩니다.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="admin_room_detail">
      <div className="admin_section_header">
        <div>
          <p className="admin_section_eyebrow">ROOM INFORMATION</p>
          <h2>{selectedRoom.roomNumber}</h2>
          <p>{selectedRoom.roomName}</p>
        </div>

        <span
          className={`admin_room_status status_${selectedRoom.status.toLowerCase()}`}
        >
          {STATUS_LABELS[selectedRoom.status]}
        </span>
      </div>

      <dl className="admin_room_info_list">
        <div>
          <dt>룸 번호</dt>
          <dd>{selectedRoom.roomNumber}</dd>
        </div>

        <div>
          <dt>수용 인원</dt>
          <dd>{selectedRoom.capacity}인실</dd>
        </div>

        <div>
          <dt>현재 상태</dt>
          <dd>{STATUS_LABELS[selectedRoom.status]}</dd>
        </div>
      </dl>

      {selectedRoom.status === 'USR' && selectedRoom.currentUsage && (
        <section className="admin_room_current_usage">
          <h3>현재 이용 정보</h3>

          <dl className="admin_room_info_list">
            <div>
              <dt>사용자</dt>
              <dd>{selectedRoom.currentUsage.phoneNumber}</dd>
            </div>

            <div>
              <dt>이용 시작</dt>
              <dd>{selectedRoom.currentUsage.startAt}</dd>
            </div>

            <div>
              <dt>이용 종료 예정</dt>
              <dd>{selectedRoom.currentUsage.endAt}</dd>
            </div>
          </dl>
        </section>
      )}
    </aside>
  );
}
