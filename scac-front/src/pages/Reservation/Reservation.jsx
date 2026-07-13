import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { reservations } from '../../data/Reservations';
import { formatDate } from '../../utils/date';
import { reservationStore } from '../../store/reservationStore';
import { rooms } from '../../data/RoomInfo';
import '../../styles/reservation.css';

export default () => {
  const roomId = reservationStore((state) => state.roomId);
  const room = rooms[roomId];
  const roomReservations = reservations[roomId];
  const dates = Object.keys(roomReservations);

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const navigate = useNavigate();

  // 현재 선택 날짜의 시간 목록
  const selectedTimes = roomReservations[selectedDate];

  // 날짜 클릭 이벤트
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setStartTime(null);
    setEndTime(null);
  };

  // 시간 클릭 이벤트
  const handleTimeClick = (time) => {
    if (!time.available) return;

    if (!startTime) {
      setStartTime(time.time);
      return;
    }

    if (!endTime) {
      const startIndex = selectedTimes.findIndex((t) => t.time === startTime);
      const currentIndex = selectedTimes.findIndex((t) => t.time === time.time);

      let newStartIndex = startIndex;
      let newEndIndex = currentIndex;

      // 거꾸로 선택한 경우
      if (currentIndex < startIndex) {
        newStartIndex = currentIndex;
        newEndIndex = startIndex;
      }

      // 사이에 예약 불가 시간이 있는지 확인
      const hasUnavailable = selectedTimes
        .slice(newStartIndex + 1, newEndIndex + 1)
        .some((t) => !t.available);

      if (hasUnavailable) {
        // 선택 해제
        setStartTime(null);
        setEndTime(null);
        return;
      }

      setStartTime(selectedTimes[newStartIndex].time);
      setEndTime(selectedTimes[newEndIndex].time);
      return;
    }

    setStartTime(time.time);
    setEndTime(null);
  };

  const isSelected = (time) => {
    if (!startTime) return false;

    if (!endTime) {
      return time === startTime;
    }

    const startIndex = selectedTimes.findIndex((t) => t.time === startTime);
    const endIndex = selectedTimes.findIndex((t) => t.time === endTime);
    const currentIndex = selectedTimes.findIndex((t) => t.time === time);

    return currentIndex >= startIndex && currentIndex <= endIndex;
  };

  return (
    <div className="reservation_page">
      <div className="reservation_header">
        <div className="back_btn" onClick={() => navigate('/Room')}>
          뒤로가기
        </div>
        <h1 className="reservation_title">스터디룸 예약</h1>
        <span className="header_time">오전 11:41</span>
      </div>

      <div className="date_container">
        <div className="date_selector">
          {dates.map((date, index) => {
            const { day, date: displayDate } = formatDate(date);
            return (
              <button
                key={date}
                className={`date_btn ${selectedDate === date ? 'active' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                <span className="date_day">{day}</span>
                <span className="date_number">{displayDate}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="time_selector">
        {selectedTimes.map((item) => (
          <button
            key={item.time}
            onClick={() => handleTimeClick(item)}
            className={`time_btn 
                ${isSelected(item.time) ? 'active' : ''}
                ${!item.available ? 'disabled' : ''}`}
          >
            {item.time}
          </button>
        ))}
      </div>
      <div className="room_info">
        <div className="preview_img">
          <img src={room.image} alt="" />
        </div>
        <div className="room_badge">
          ROOM {room.name} 👥 {room.capacity}인실
        </div>
      </div>
      <button className="confirm_button" onClick={() => navigate('/payment')}>
        선택완료
      </button>
    </div>
  );
};
