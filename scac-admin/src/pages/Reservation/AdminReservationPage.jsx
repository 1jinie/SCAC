import { useCallback, useEffect, useMemo, useState } from "react";
import SeatList from "../../components/seat/SeatList";
import { seatStore } from "../../store/seatStore";
import { roomStore } from "../../store/roomStore";
import { reservationApi } from "../../api/reservationApi"; // 💡 reservationApi 추가
import { toDateString } from "../../utils/date";
import AdminRoomDetail from "./components/AdminRoomDetail";
import RecentReservationList from "./components/RecentReservationList";
import ReservationDateSlider from "./components/ReservationDateSlider";
import RoomDailySchedule from "./components/RoomDailySchedule";

import "./css/AdminReservationPage.css";

const TO_ADMIN_STATUS = {
  available: "AVB",
  using: "USR",
  repair: "BRK",
};

export default function AdminReservationPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(toDateString(new Date()));
  const [reservations, setReservations] = useState([]); // 💡 더미 데이터 제거 및 빈 배열 초기화
  const [isLoading, setIsLoading] = useState(false);

  // 스토어 상태 추출
  const seats = seatStore((state) => state.seats);
  const fetchSeats = seatStore((state) => state.fetchSeats);
  const selected = seatStore((state) => state.selectedSeat);
  const selectSeat = seatStore((state) => state.selectSeat);
  const clearSelected = seatStore((state) => state.clearSelected);

  const rooms = roomStore((state) => state.rooms);
  const fetchRooms = roomStore((state) => state.fetchRooms);

  const mode = "room";

  // 1. 전체 스터디룸 정보 조회
  useEffect(() => {
    fetchSeats();
    fetchRooms();
    clearSelected();
  }, [fetchRooms, clearSelected]);

  // 2. 백엔드 실시간 스터디룸 예약 목록 조회
  const fetchReservations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await reservationApi.getAdminReservationList();
      setReservations(response.data?.data ?? []);
    } catch (error) {
      console.error("예약 목록 조회 실패:", error);
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // 스터디룸 배치도 클릭
  const handleClick = (seat) => {
    if (seat.type !== "room") {
      return;
    }

    selectSeat(seat.id);

    // roomStore에서 방 정보 찾기
    const roomInfo = rooms.find((room) => room.id === seat.id);

    if (!roomInfo) {
      return;
    }

    setSelectedRoom({
      roomId: roomInfo.id,
      roomNumber: roomInfo.name,
      roomName: roomInfo.name,
      capacity: roomInfo.capacity,
      status: TO_ADMIN_STATUS[seat.status] ?? "AVB",
    });
  };

  // 선택한 방 + 선택한 날짜의 예약만 필터링
  const selectedRoomReservations = useMemo(() => {
    if (!selectedRoom) {
      return [];
    }

    return reservations
      .filter(
        (reservation) =>
          Number(reservation.roomId) === Number(selectedRoom.roomId) &&
          reservation.reservationDate === selectedDate,
      )
      .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
  }, [reservations, selectedRoom, selectedDate]);

  // 3. 백엔드 예약 취소 API 연동
  const handleAdminCancel = async (reservationId) => {
    const confirmed = window.confirm(
      "선택한 예약을 관리자 취소 처리하시겠습니까?",
    );

    if (!confirmed) {
      return;
    }

    try {
      // 백엔드 PATCH /api/meeting-rooms/reservations/{id}/cancel 호출
      await reservationApi.cancelReservation(reservationId);
      window.alert("예약 취소가 완료되었습니다.");

      // 취소 후 최신 목록 재조회
      await fetchReservations();
    } catch (error) {
      console.error("관리자 예약 취소 실패:", error);
      window.alert("예약 취소 처리에 실패했습니다.");
    }
  };

  // 전체 현황 보기
  const handleReset = () => {
    clearSelected();
    setSelectedRoom(null);
  };

  const items = [...seats, ...rooms];

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
                  seats={items}
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
