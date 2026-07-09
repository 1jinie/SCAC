import React, { useState } from 'react';
import SeatItem from './SeatItem';
import '../../styles/seat.css';

function Seat() {
  const [selectedSeat, setSelectedSeat] = useState(null);

  const seats = [
    { id: 1, name: 's1', x: 1, y: 1, status: 'available' },
    { id: 2, name: 's2', x: 3, y: 1, status: 'available' },
    { id: 3, name: 's3', x: 5, y: 1, status: 'using' },
    { id: 4, name: 's4', x: 7, y: 1, status: 'available' },
    { id: 5, name: 's5', x: 9, y: 1, status: 'available' },
    { id: 6, name: 's6', x: 1, y: 3, status: 'available' },
    { id: 7, name: 's7', x: 2, y: 3, status: 'available' },
    { id: 8, name: 's8', x: 3, y: 3, status: 'using' },
    { id: 9, name: 's9', x: 4, y: 3, status: 'available' },
    { id: 10, name: 's10', x: 5, y: 3, status: 'available' },
    { id: 11, name: 's11', x: 1, y: 4, status: 'available' },
    { id: 12, name: 's12', x: 2, y: 4, status: 'available' },
    { id: 13, name: 's13', x: 3, y: 4, status: 'using' },
    { id: 14, name: 's14', x: 4, y: 4, status: 'available' },
    { id: 15, name: 's15', x: 5, y: 4, status: 'using' },
    { id: 16, name: 's16', x: 1, y: 6, status: 'available' },
    { id: 17, name: 's17', x: 2, y: 6, status: 'unavailable' },
    { id: 18, name: 's18', x: 3, y: 6, status: 'available' },
    { id: 19, name: 's19', x: 4, y: 6, status: 'available' },
    { id: 20, name: 's20', x: 5, y: 6, status: 'using' },
    { id: 21, name: 's21', x: 1, y: 7, status: 'available' },
    { id: 22, name: 's22', x: 2, y: 7, status: 'available' },
    { id: 23, name: 's23', x: 3, y: 7, status: 'using' },
    { id: 24, name: 's24', x: 4, y: 7, status: 'available' },
    { id: 25, name: 's25', x: 5, y: 7, status: 'available' },
    { id: 101, name: 'r1', x: 1, y: 10, status: 'unavailable' },
    { id: 102, name: 'r2', x: 4, y: 10, status: 'unavailable' },
    { id: 103, name: 'r3', x: 7, y: 10, status: 'unavailable' },
  ];

  const handleSeatClick = (seat) => {
    if (seat.status !== 'available') return;
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
          {seats.map((seat) => (
            <SeatItem
              key={seat.id}
              seat={seat}
              isSelected={selectedSeat === seat.id}
              onClick={() => handleSeatClick(seat)}
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
          <span className="legend_text">사용중</span>
        </div>
      </div>

      <button className="confirm_button">선택완료</button>
    </div>
  );
}

export default Seat;
