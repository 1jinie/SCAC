import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { seatStore } from '../../store/seatStore';
import { reservationStore } from '../../store/reservationStore';
import SeatItem from './SeatItem';
import CheckInModal from '../../components/modal/CheckInModal';
import '../../styles/seat.css';

function SeatPage({ mode }) {
  const seats = seatStore((state) => state.seats);
  const selected = seatStore((state) => state.selectedSeat);
  const [showModal, setShowModal] = useState(false);
  const setReservation = reservationStore((state) => state.setReservation);
  const selectSeat = seatStore((state) => state.selectSeat);
  const checkInSeat = seatStore((state) => state.checkInSeat);
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

    selectSeat(seat.id);
  };

  const handleConfirm = () => {
    if (!selected) {
      alert(
        mode === 'seat' ? '좌석을 선택해주세요' : '스터디룸을 선택해주세요',
      );
      return;
    }

    if (mode === 'room') {
      setReservation({
        roomId: selected,
      });
      navigate('/room/reservation');
      return;
    }

    setShowModal(true);
  };

  const handleCheckIn = (data) => {
    const checkIn = {
      seatId: selected,
      phone: data.phone,
      password: data.password,
    };

    checkInSeat();
    setShowModal(false);
  };

  // mode 변경시 선택 초기화
  const clearSelected = seatStore((state) => state.clearSelected);
  useEffect(() => {
    clearSelected();
  }, [mode, clearSelected]);

  return (
    <div className="seat_page">
      <div className="seat_header">
        <div className="back_btn" onClick={() => navigate('/')}>
          <img src="/icons/common/next_black.svg" alt="뒤로가기" className='back_icon'/>
          <span>뒤로가기</span>
        </div>
        <img src="/logo/logo.png" alt="로고" className='logo_image'/>
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
          seatId={selected}
          onClose={() => setShowModal(false)}
          onConfirm={handleCheckIn}
        />
      )}
    </div>
  );
}

export default SeatPage;
