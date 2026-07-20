import { useMemo, useState } from "react";
import AdminRoomDetail from "./components/AdminRoomDetail";
import ReservationDateSlider from "./components/ReservationDateSlider";
import RoomDailySchedule from "./components/RoomDailySchedule";
import RecentReservationList from "./components/RecentReservationList";
import "./css/AdminReservationPage.css";

const ROOM_DUMMY = [
  {
    roomId: 1,
    roomNumber: "R1",
    roomName: "스터디룸 A",
    capacity: 4,
    status: "AVB",
  },
  {
    roomId: 2,
    roomNumber: "R2",
    roomName: "스터디룸 B",
    capacity: 4,
    status: "USR",
    currentUsage: {
      phoneNumber: "010-1234-5678",
      startAt: "2026-07-16 13:00",
      endAt: "2026-07-16 15:00",
    },
  },
  {
    roomId: 3,
    roomNumber: "R3",
    roomName: "스터디룸 C",
    capacity: 6,
    status: "AVB",
  },
];

const RESERVATION_DUMMY = [
  {
    reservationId: 1,
    roomId: 1,
    roomNumber: "R1",
    phoneNumber: "010-1111-2222",
    reservationDate: "2026-07-16",
    startTime: "09:00",
    endTime: "11:00",
    status: "RESERVED",
    createdAt: "2026-07-15 18:30:00",
  },
  {
    reservationId: 2,
    roomId: 1,
    roomNumber: "R1",
    phoneNumber: "010-3333-4444",
    reservationDate: "2026-07-16",
    startTime: "13:00",
    endTime: "15:00",
    status: "IN_USE",
    createdAt: "2026-07-15 19:20:00",
  },
  {
    reservationId: 3,
    roomId: 2,
    roomNumber: "R2",
    phoneNumber: "010-5555-6666",
    reservationDate: "2026-07-17",
    startTime: "16:00",
    endTime: "18:00",
    status: "RESERVED",
    createdAt: "2026-07-16 09:10:00",
  },
];

const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function AdminReservationPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(toDateString(new Date()));
  const [reservations, setReservations] = useState(RESERVATION_DUMMY);

  const selectedRoomReservations = useMemo(() => {
    if (!selectedRoom) {
      return [];
    }

    return reservations
      .filter(
        (reservation) =>
          reservation.roomId === selectedRoom.roomId &&
          reservation.reservationDate === selectedDate,
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [reservations, selectedRoom, selectedDate]);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleAdminCancel = (reservationId) => {
    const confirmed = window.confirm(
      "선택한 예약을 관리자 취소 처리하시겠습니까?",
    );

    if (!confirmed) {
      return;
    }

    setReservations((previousReservations) =>
      previousReservations.map((reservation) =>
        reservation.reservationId === reservationId
          ? {
              ...reservation,
              status: "ADMIN_CANCELED",
            }
          : reservation,
      ),
    );
  };

  return (
    <div className="admin_reservation_page">
      <div className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">STUDY ROOM MANAGEMENT</p>
          <h2>스터디룸 현황</h2>
          <p>스터디룸의 현재 상태와 날짜별 예약 내역을 확인합니다.</p>
        </div>
      </div>

      <section className="admin_room_workspace">
        <div className="admin_room_map_section">
          <div className="admin_section_header">
            <div>
              <h2>스터디룸 배치도</h2>
              <p>확인할 스터디룸을 선택해 주세요.</p>
            </div>

            <button
              type="button"
              className="admin_room_map_all"
              onClick={() => setSelectedRoom(null)}
            >
              전체 현황 보기
            </button>
          </div>

          <div className="admin_room_map_placeholder">
            {/* 추후 전달받은 배치도 컴포넌트 연결 */}
            {/* 
            <StudyRoomMap
              rooms={ROOM_DUMMY}
              selectedRoomId={selectedRoom?.roomId}
              onRoomSelect={handleRoomSelect}
            />
            */}

            <div className="admin_room_dummy_buttons">
              {ROOM_DUMMY.map((room) => (
                <button
                  key={room.roomId}
                  type="button"
                  onClick={() => handleRoomSelect(room)}
                >
                  {room.roomNumber} 선택
                </button>
              ))}
            </div>
          </div>
        </div>

        <AdminRoomDetail selectedRoom={selectedRoom} />
      </section>

      <section className="admin_panel admin_room_schedule_panel">
        <div className="admin_panel_header">
          <div>
            <h3>날짜별 예약 현황</h3>
            <p>오늘부터 최대 14일까지의 예약을 확인할 수 있습니다.</p>
          </div>
        </div>

        <ReservationDateSlider
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <RoomDailySchedule
          selectedRoom={selectedRoom}
          selectedDate={selectedDate}
          reservations={selectedRoomReservations}
          onAdminCancel={handleAdminCancel}
        />
      </section>

      <RecentReservationList
        reservations={reservations}
        onAdminCancel={handleAdminCancel}
      />
    </div>
  );
}
