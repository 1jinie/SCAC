import React, { useState } from 'react';
import { seats } from '../../data/Seats';
import SeatItem from './SeatItem';
import '../../styles/seat.css';

function Seat() {
  const [selectedSeat, setSelectedSeat] = useState(null);

  const handleSeatClick = (seat) => {
    if (seat.status !== 'available' || seat.type === 'room') return;
    setSelectedSeat((prevSelected) =>
      prevSelected === seat.id ? null : seat.id,
    );
  };

  return (
    <div className="seat_page">
      <div className="seat_header">
        <div className="back_btn">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="back_arrow"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          뒤로가기
        </div>
        <span className="header_time">오후 5:45</span>
      </div>

      <div className="seat_grid_wrapper">
        <div className="seat_grid">
          {seats.map((seat) => {
            const displaySeat = seat.type === 'room'
              ? { ...seat, status: 'unavailable' }
              : seat;
            return (
              <SeatItem
                key={seat.id}
                seat={displaySeat}
                isSelected={selectedSeat === seat.id}
                onClick={() => handleSeatClick(seat)}
              />
            );
          })}
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
          <span className="legend_text">사용중</span>
        </div>
      </div>

      <button className="confirm_button">선택완료</button>
    </div>
  );
}

export default Seat;
