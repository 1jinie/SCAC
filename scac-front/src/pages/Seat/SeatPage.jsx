import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { seatStore } from '../../store/seatStore';
import { reservationStore } from '../../store/reservationStore';
import SeatList from '../../components/seat/SeatList';
import '../../styles/seat.css';
import { checkInStore } from '../../store/checkInStore';

function SeatPage({ mode }) {
  const seats = seatStore((state) => state.seats);
  const fetchSeats = seatStore((state) => state.fetchSeats);
  const selected = seatStore((state) => state.selectedSeat);
  const user = checkInStore((state) => state.currentUser);
  const addCheckIn = checkInStore((state) => state.addCheckIn);
  const checkInSeat = seatStore((state) => state.checkInSeat);
  const setReservation = reservationStore((state) => state.setReservation);
  const selectSeat = seatStore((state) => state.selectSeat);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

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

    checkInSeat(selected);

    addCheckIn({
      userId: user.id,
      seatId: selected,
      status: 'using',
      checkInTime: new Date(),
      checkOutTime: null,
    });

    navigate('/');
    alert('입실되었습니다');
  };

  // mode 변경시 선택 초기화
  const clearSelected = seatStore((state) => state.clearSelected);
  useEffect(() => {
    clearSelected();
  }, [mode, clearSelected]);

  return (
    <div className="seat_page">
      <div className="seat_header">
        <div className="back_btn" onClick={() => navigate(-1)}>
          <img
            src="/icons/common/next_black.svg"
            alt="뒤로가기"
            className="back_icon"
          />
          <span>뒤로가기</span>
        </div>
        <img src="/logo/logo.png" alt="로고" className="logo_image" />
      </div>

      <SeatList
        seats={seats}
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
            {mode === 'seat' ? '사용중' : '예약됨'}
          </span>
        </div>
      </div>

      <button className="confirm_button" onClick={handleConfirm}>
        선택완료
      </button>
    </div>
  );
}

export default SeatPage;
