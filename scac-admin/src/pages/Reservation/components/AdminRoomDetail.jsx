import { useEffect, useState } from "react";
import { reservationApi } from "../../../api/reservationApi";
import { formatPhoneNumber } from "../../../utils/formatter";

const STATUS_LABELS = {
  AVB: "이용 가능",
  USR: "이용 중",
  BRK: "점검 중",
};

export default function AdminRoomDetail({ selectedRoom }) {
  const [currentUsage, setCurrentUsage] = useState(null);

  useEffect(() => {
    if (!selectedRoom || selectedRoom.status !== "USR") {
      setCurrentUsage(null);
      return;
    }

    const fetchCurrentUsage = async () => {
      try {
        const response = await reservationApi.getAdminReservationList();
        const reservation = response.data.data.find(
          (item) =>
            item.roomId === selectedRoom.roomId && item.status === "IN_USE",
        );

        setCurrentUsage(reservation ?? null);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentUsage();
  }, [selectedRoom]);

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

      {selectedRoom.status === "USR" && currentUsage && (
        <section className="admin_room_current_usage">
          <h3>현재 이용 정보</h3>

          <dl className="admin_room_info_list">
            <div>
              <dt>사용자</dt>
              <dd>{formatPhoneNumber(currentUsage.phoneNumber)}</dd>
            </div>

            <div>
              <dt>이용 시작</dt>
              <dd>{currentUsage.getStartTime ?? currentUsage.startTime}</dd>
            </div>

            <div>
              <dt>이용 종료 예정</dt>
              <dd>{currentUsage.getEndTime ?? currentUsage.endTime}</dd>
            </div>
          </dl>
        </section>
      )}
    </aside>
  );
}
