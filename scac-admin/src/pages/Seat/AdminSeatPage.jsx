import { useEffect, useState } from 'react';
import SeatList from '../../components/seat/SeatList';
import { seatStore } from '../../store/seatStore';
import { roomStore } from '../../store/roomStore';
import { adminSeatApi } from '../../api/seatApi'; // 💡 adminSeatApi 추가
import AdminSeatDetail from './components/AdminSeatDetail';
import AdminSeatLogList from './components/AdminSeatLogList';
import './css/AdminSeatPage.css';

export default function AdminSeatPage() {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [logs, setLogs] = useState([]);
  const seats = seatStore((state) => state.seats);
  const fetchSeats = seatStore((state) => state.fetchSeats);
  const rooms = roomStore((state) => state.rooms);
  const fetchRooms = roomStore((state) => state.fetchRooms);
  const selected = seatStore((state) => state.selectedSeat);
  const selectSeat = seatStore((state) => state.selectSeat);
  const resetSeat = seatStore((state) => state.clearSelected);
  const updateSeatStatus = seatStore((state) => state.updateSeatStatus);
  const mode = 'seat';

  const TO_ADMIN_STATUS = {
    available: 'AVB',
    using: 'USR',
    repair: 'BRK',
  };

  const TO_SEAT_STATUS = {
    AVB: 'available',
    USR: 'using',
    BRK: 'repair',
  };

  const handleClick = async (seat) => {
    if (seat.type !== 'seat') return;

    selectSeat(seat.id);

    let user = null;

    if (seat.status === 'using') {
      try {
        const response = await adminSeatApi.getSeatUser(seat.id);

        user = response.data.data;
      } catch (error) {
        console.error('현재 이용자 조회 실패', error);
      }
    }

    setSelectedSeat({
      seatId: seat.id,
      seatNumber: seat.name,
      status: TO_ADMIN_STATUS[seat.status],
      user,
    });

    try {
      const response = await adminSeatApi.getSeatLogs(seat.id);

      setLogs(response.data);
    } catch (error) {
      console.error('좌석 로그 조회 실패', error);
      setLogs([]);
    }
  };

  useEffect(() => {
    fetchSeats();
    fetchRooms();
    resetSeat();

    const fetchLogs = async () => {
      try {
        const response = await adminSeatApi.getAllSeatLogs();
        setLogs(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogs();
  }, [fetchSeats, fetchRooms, resetSeat]);

  const handleReset = async () => {
    resetSeat();
    setSelectedSeat(null);

    try {
      const response = await adminSeatApi.getAllSeatLogs();

      setLogs(response.data.data);
    } catch (error) {
      console.error('전체 좌석 로그 조회 실패', error);
      setLogs([]);
    }
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
            <button className="admin_seat_map_all" onClick={handleReset}>
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
                    <span className="legend_text">사용중</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AdminSeatDetail
          selectedSeat={selectedSeat}
          onSeatChange={handleSeatStatusChange}
        />
      </section>
      <AdminSeatLogList logs={logs} selectedSeat={selected} />
    </div>
  );
}
