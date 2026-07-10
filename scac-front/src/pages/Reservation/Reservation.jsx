import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationDates } from '../../data/Dumdates';
import { formatDate } from '../../utils/date';
import '../../styles/reservation.css';

export default () => {
  const [selectedDate, setSelectedDate] = useState(reservationDates[0]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('startTime:', startTime);
    console.log('endTime:', endTime);
  }, [endTime]);

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
      const startIndex = selectedDate.times.findIndex(
        (t) => t.time === startTime,
      );
      const currentIndex = selectedDate.times.findIndex(
        (t) => t.time === time.time,
      );

      let newStartIndex = startIndex;
      let newEndIndex = currentIndex;

      // 거꾸로 선택한 경우
      if (currentIndex < startIndex) {
        newStartIndex = currentIndex;
        newEndIndex = startIndex;
      }

      // 사이에 예약 불가 시간이 있는지 확인
      const hasUnavailable = selectedDate.times
        .slice(newStartIndex + 1, newEndIndex + 1)
        .some((t) => !t.available);

      if (hasUnavailable) {
        // 선택 해제
        setStartTime(null);
        setEndTime(null);
        return;
      }

      setStartTime(selectedDate.times[newStartIndex].time);
      setEndTime(selectedDate.times[newEndIndex].time);
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

    const startIndex = selectedDate.times.findIndex(
      (t) => t.time === startTime,
    );
    const endIndex = selectedDate.times.findIndex((t) => t.time === endTime);
    const currentIndex = selectedDate.times.findIndex((t) => t.time === time);

    return currentIndex >= startIndex && currentIndex <= endIndex;
  };

  return (
    <div className="reservation_page">
      <div className="reservation_header">
        <div className="back_btn" onClick={() => navigate('/Seat')}>
          뒤로가기
        </div>
        <h1 className="reservation_title">스터디룸 예약</h1>
        <span className="header_time">오전 11:41</span>
      </div>
      <div className="date_container">
        <div className="date_selector">
          {reservationDates.map((item) => {
            const { day, date } = formatDate(item.fullDate);
            return (
              <button
                key={item.id}
                className={`date_btn ${selectedDate?.id === item.id ? 'active' : ''}`}
                onClick={() => handleDateClick(item)}
              >
                <span className="date_day">{day}</span>
                <span className="date_number">{date}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="time_selector">
        {selectedDate?.times?.map((item) => (
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
          <img src="/images/studyroom_6people_00.jpg" alt="" />
        </div>
        <div className="room_badge">ROOM R1 👥 6인실</div>
      </div>
      <button className="confirm_button">선택완료</button>
    </div>
  );
};
