import React, { useState } from 'react';
import { seats } from '../../data/Seats';
import SeatItem from './SeatItem';
import '../../styles/seat.css';

function SeatPage({ mode }) {
  const [selected, setSelected] = useState(null);

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

  return (
    <div className="seat_page">
      <div className="seat_header">
        <div className="back_btn">뒤로가기</div>
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

      <button className="confirm_button" text>
        선택완료
      </button>
    </div>
  );
}

export default SeatPage;
