import { useEffect, useMemo, useState } from "react";
import SeatList from "../../components/seat/SeatList";
import { seatStore } from "../../store/seatStore";
import { roomStore } from "../../store/roomStore";
import AdminSeatDetail from "./components/AdminSeatDetail";
import AdminSeatLogList from "./components/AdminSeatLogList";
import "./css/AdminSeatPage.css";

export default function AdminSeatPage() {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [data] = useState([]);
  const seats = seatStore((state) => state.seats);
  const fetchSeats = seatStore((state) => state.fetchSeats);
  const rooms = roomStore((state) => state.rooms);
  const fetchRooms = roomStore((state) => state.fetchRooms);
  const selected = seatStore((state) => state.selectedSeat);
  const selectSeat = seatStore((state) => state.selectSeat);
  const resetSeat = seatStore((state) => state.clearSelected);
  const mode = "seat";

  const updateSeatStatus = seatStore((state) => state.updateSeatStatus);

  const TO_ADMIN_STATUS = {
    available: "AVB",
    using: "USR",
    repair: "BRK",
  };

  const TO_SEAT_STATUS = {
    AVB: "available",
    USR: "using",
    BRK: "repair",
  };

  const handleClick = (seat) => {
    if (seat.type !== "seat") return;

    selectSeat(seat.id);

    setSelectedSeat({
      seatId: seat.id,
      seatNumber: seat.name,
      status: TO_ADMIN_STATUS[seat.status],

      user:
        seat.status === "using"
          ? {
              phoneNumber: "010-1234-5678",
              ticketName: "4시간권",
              ticketType: "TIME",
              remainingTime: 95,
            }
          : null,
    });
  };

  useEffect(() => {
    fetchSeats();
    fetchRooms();
  }, [fetchSeats, fetchRooms]);

  const filteredLogs = useMemo(() => {
    if (!selected) {
      return data;
    }

    return data.filter((log) => Number(log.seat_id) === Number(selected));
  }, [data, selected]);

  const handleReset = () => {
    resetSeat();
    setSelectedSeat(null);
  };

  const handleSeatStatusChange = (newStatus, isForceCheckout = false) => {
    setSelectedSeat((prevSeat) => ({
      ...prevSeat,
      status: newStatus,
      user: isForceCheckout ? null : prevSeat.user,
    }));

    updateSeatStatus(Number(selectedSeat.seatId), TO_SEAT_STATUS[newStatus]);
  };

  const items = [...seats, ...rooms];

  return (
    <div className="admin_seat_page">
      <div className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">SEAT MANAGEMENT</p>

          <h2>좌석 현황</h2>

          <p>좌석의 현재 상태와 이용 내역을 확인합니다.</p>
        </div>
      </div>
      <section className="admin_seat_workspace">
        <div className="admin_seat_map_section">
          <div className="admin_section_header">
            <div>
              <h2>좌석 배치도</h2>
              <p>관리할 좌석을 선택해 주세요.</p>
            </div>
            <button
              className="admin_seat_map_all"
              onClick={() => handleReset()}
            >
              좌석 전체 보기
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
                    <span className="legend_color select"></span>
                    <span className="legend_text">선택</span>
                  </div>
                  <div className="legend_item">
                    <span className="legend_color available"></span>
                    <span className="legend_text">선택가능</span>
                  </div>
                  <div className="legend_item">
                    <span className="legend_color unavailable">
                      <span className="legend_diagonal"></span>
                    </span>
                    <span className="legend_text">불가능</span>
                  </div>
                  <div className="legend_item">
                    <span className="legend_color using"></span>
                    <span className="legend_text">
                      {mode === "seat" ? "사용중" : "예약됨"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AdminSeatDetail
          // 샘플 데이터로 14번 좌석을 잠시 사용할 예정
          selectedSeat={selectedSeat}
          onSeatChange={handleSeatStatusChange}
        />
      </section>

      <AdminSeatLogList logs={filteredLogs} selectedSeat={selected} />
    </div>
  );
}
