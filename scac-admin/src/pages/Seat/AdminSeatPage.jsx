import { useEffect, useMemo, useState } from 'react';
import AdminSeatDetail from './components/AdminSeatDetail';
import AdminSeatLogList from './components/AdminSeatLogList';
import stylesheet from './css/AdminSeatPage.css';

// import './css/AdminSeatPage.css';

export default function AdminSeatPage() {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/admin_seat_log_dummy.csv')
      .then((response) => response.text())
      .then((csvText) => {
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        const parsedData = rows.slice(1).map((row) => {
          const values = row.split(',');
          // 헤더와 값을 매핑하여 객체로 변환
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {});
        });
        setData(parsedData);
      });
  }, []);

  const filteredLogs = useMemo(() => {
    if (!selectedSeat) {
      return data;
    }

    return data.filter(
      (log) => Number(log.seat_id) === Number(selectedSeat.seatId),
    );
  }, [data, selectedSeat]);

  const handleSeatSelect = (seat) => {
    setSelectedSeat(seat);
  };
  const handleReset = () => {
    setSelectedSeat(null);
  };

  return (
    <div className="admin_seat_page">
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

          <div className="admin_seat_map_placeholder">
            {/* 담당자에게 받을 좌석 배치 컴포넌트 */}
            {/* <SeatMap onSeatSelect={handleSeatSelect} /> */}

            <button
              type="button"
              onClick={() =>
                handleSeatSelect({
                  seatId: '14',
                  seatNumber: 14,
                  status: 'USR',
                  zoneType: 'QUIET',
                  user: {
                    phoneNumber: '010-1234-5678',
                    ticketName: '4시간권',
                    ticketType: 'TIME',
                    remainingTime: 95,
                  },
                })
              }
            >
              임시 14번 좌석 선택
            </button>
          </div>
        </div>

        <AdminSeatDetail
          selectedSeat={selectedSeat}
          onSeatChange={setSelectedSeat}
        />
      </section>

      <AdminSeatLogList logs={filteredLogs} selectedSeat={selectedSeat} />
    </div>
  );
}
