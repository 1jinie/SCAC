import { useMemo, useState } from "react";
import AdminRoomDetail from "./components/AdminRoomDetail";
import ReservationDateSlider from "./components/ReservationDateSlider";
import RoomDailySchedule from "./components/RoomDailySchedule";
import RecentReservationList from "./components/RecentReservationList";
import SeatList from "../../components/seat/SeatList";
import { seatStore } from "../../store/seatStore";
import { toDateString } from "../../utils/date";

import "./css/AdminReservationPage.css";

const ROOM_DUMMY = [
  {
    roomId: 101,
    roomNumber: "R1",
    roomName: "스터디룸 R1",
    capacity: 4,
  },
  {
    roomId: 102,
    roomNumber: "R2",
    roomName: "스터디룸 R2",
    capacity: 4,
  },
  {
    roomId: 103,
    roomNumber: "R3",
    roomName: "스터디룸 R3",
    capacity: 6,
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
    roomId: 101,
    roomNumber: "R1",
    phoneNumber: "010-1111-2222",
    reservationDate: "2026-07-20",
    startTime: "09:00",
    endTime: "11:00",
    status: "RESERVED",
    createdAt: "2026-07-19 18:30:00",
  },
  {
    reservationId: 2,
    roomId: 101,
    roomNumber: "R1",
    phoneNumber: "010-3333-4444",
    reservationDate: "2026-07-20",
    startTime: "13:00",
    endTime: "15:00",
    status: "IN_USE",
    createdAt: "2026-07-19 19:20:00",
  },
  {
    reservationId: 3,
    roomId: 102,
    roomNumber: "R2",
    phoneNumber: "010-5555-6666",
    reservationDate: "2026-07-21",
    startTime: "16:00",
    endTime: "18:00",
    status: "RESERVED",
    createdAt: "2026-07-20 09:10:00",
  },
];

const TO_ADMIN_STATUS = {
  available: "AVB",
  using: "USR",
  repair: "BRK",
};

export default function AdminReservationPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(toDateString(new Date()));
  const [reservations, setReservations] = useState(RESERVATION_DUMMY);

  const seats = seatStore((state) => state.seats);
  const selected = seatStore((state) => state.selectedSeat);
  const selectSeat = seatStore((state) => state.selectSeat);
  const resetSeat = seatStore((state) => state.clearSelected);

  const mode = "room";

  // 스터디룸 배치도 클릭
  const handleClick = (seat) => {
    // 일반 좌석은 선택 불가
    if (seat.type !== "room") {
      return;
    }

    selectSeat(seat.id);

    const roomInfo = ROOM_DUMMY.find((room) => room.roomId === seat.id);

    if (!roomInfo) {
      return;
    }

    setSelectedRoom({
      ...roomInfo,

      // SeatList의 상태를 관리자 상태값으로 변환
      status: TO_ADMIN_STATUS[seat.status] ?? "AVB",

      // 사용 중인 방의 임시 이용 정보
      currentUsage:
        seat.status === "using"
          ? {
              phoneNumber: "010-1234-5678",
              startAt: "2026-07-20 13:00",
              endAt: "2026-07-20 15:00",
            }
          : null,
    });
  };

  // 선택한 방 + 선택한 날짜의 예약만 조회
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

  // 관리자 예약 취소
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

  // 전체 현황 보기
  const handleReset = () => {
    resetSeat();
    setSelectedRoom(null);
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
              onClick={handleReset}
            >
              전체 현황 보기
            </button>
          </div>

          <div className="admin_seat_map">
            <div className="admin_map_viewport">
              <div className="admin_map_scale">
                <SeatList
                  seats={seats}
                  selected={selected}
                  mode={mode}
                  onClick={handleClick}
                />

                <div className="seat_legend">
                  <div className="legend_item">
                    <span className="legend_color select" />
                    <span className="legend_text">선택</span>
                  </div>

                  <div className="legend_item">
                    <span className="legend_color available" />
                    <span className="legend_text">선택가능</span>
                  </div>

                  <div className="legend_item">
                    <span className="legend_color unavailable">
                      <span className="legend_diagonal" />
                    </span>

                    <span className="legend_text">불가능</span>
                  </div>

                  <div className="legend_item">
                    <span className="legend_color using" />
                    <span className="legend_text">예약됨</span>
                  </div>
                </div>
              </div>
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
