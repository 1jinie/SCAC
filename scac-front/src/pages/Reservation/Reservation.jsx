import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservations } from '../../data/Reservations';
import { formatDate, addOneHour } from '../../utils/date';
import {
  getSelectionRange,
  hasUnavailableTime,
  isTimeSelected,
} from '../../utils/reservationUtils';
import { reservationStore } from '../../store/reservationStore';
import { rooms } from '../../data/RoomInfo';
import '../../styles/reservation.css';
import { useTicketStore } from '../../store/ticketStore';

const Reservation = () => {
  const roomId = reservationStore((state) => state.reservation.roomId);
  const setReservation = reservationStore((state) => state.setReservation);
  const room = rooms[roomId];
  const roomReservations = reservations[roomId];
  const dates = Object.keys(roomReservations);
  const setPurchaseType = useTicketStore((state) => state.setPurchaseType);

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

    const { startIndex, endIndex } = getSelectionRange(
      selectedTimes,
      startTime,
      time.time,
    );

    if (hasUnavailableTime(selectedTimes, startIndex, endIndex)) {
      // 선택 해제
      setStartTime(null);
      setEndTime(null);
      return;
    }
    setStartTime(selectedTimes[startIndex].time);
    setEndTime(selectedTimes[endIndex].time);
  };

  // 예약 시간 선택 버튼에 스타일 적용 위한 함수
  const isSelected = (time) =>
    isTimeSelected(selectedTimes, startTime, endTime, time);

  // 선택완료 버튼 이벤트
  const handleConfirm = () => {
    if (!startTime) {
      alert('시간을 선택해주세요');
      return;
    }

    const finalEndTime = addOneHour(endTime ?? startTime);

    setReservation({
      roomId,
      date: selectedDate,
      startTime,
      endTime: finalEndTime,
    });

    setPurchaseType('MEETING_ROOM');

    navigate('/payment');
  };

  return (
    <div className="reservation_page">
      <div className="reservation_header">
        <div className="back_btn" onClick={() => navigate('/Room')}>
          <img
            src="/icons/common/next_black.svg"
            alt="뒤로가기"
            className="back_icon"
          />
          뒤로가기
        </div>
        <h1 className="reservation_title">스터디룸 예약</h1>
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
      <button className="confirm_button" onClick={handleConfirm}>
        선택완료
      </button>
    </div>
  );
};

export default Reservation;
