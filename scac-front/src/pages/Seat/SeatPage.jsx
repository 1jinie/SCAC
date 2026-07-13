import React, { useState } from 'react';
import { seats } from '../../data/Seats';
import { useNavigate } from 'react-router-dom';
import { reservationStore } from '../../store/reservationStore';
import SeatItem from './SeatItem';
import CheckInModal from '../../components/modal/CheckInModal';
import '../../styles/seat.css';

function SeatPage({ mode }) {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const setRoomId = reservationStore((state) => state.setRoomId);
  const navigate = useNavigate();

  // 좌석 / 룸 선택 이벤트 정의
  const handleClick = (seat) => {
    // 좌석 페이지
    if (mode === 'seat') {
      if (seat.type !== 'seat' || seat.status !== 'available') return;
    }

    // 스터디룸 페이지
    if (mode === 'room') {
      if (seat.type !== 'room' || seat.status !== 'available') return;
    }

    setSelected((prev) => (prev === seat.id ? null : seat.id));
  };

  const handleConfirm = () => {
    if (!selected) {
      alert(
        mode === 'seat' ? '좌석을 선택해주세요' : '스터디룸을 선택해주세요',
      );
      return;
    }

    if (mode === 'room') {
      setRoomId(selected);
      navigate('/room/reservation');
      return;
    }

    setShowModal(true);
  };

  const handleCheckIn = (data) => {
    console.log('입실 정보:', data);
    console.log('선택 좌석:', selected);

    setShowModal(false);
  };

  return (
    <div className="seat_page">
      <div className="seat_header">
        <div className="back_btn" onClick={() => navigate('/')}>
          뒤로가기
        </div>
        <h1 className="header_title">
          {mode === 'seat' ? '좌석 선택' : '스터디룸 선택'}
        </h1>
      </div>

      <div className="seat_grid_wrapper">
        <div className="seat_grid">
          {seats.map((seat) => (
            <SeatItem
              key={seat.id}
              seat={seat}
              isSelected={selected === seat.id}
              onClick={() => handleClick(seat)}
              mode={mode}
            />
          ))}
        </div>
      </div>

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
            {mode === 'seat' ? '사용중' : '예약됨'}
          </span>
        </div>
      </div>

      <button className="confirm_button" onClick={handleConfirm}>
        선택완료
      </button>
      {showModal && (
        <CheckInModal
          onClose={() => setShowModal(false)}
          onConfirm={handleCheckIn}
        />
      )}
    </div>
  );
}

export default SeatPage;
