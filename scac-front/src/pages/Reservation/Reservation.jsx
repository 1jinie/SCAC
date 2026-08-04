import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, addOneHour } from '../../utils/date';
import { reservationApi } from '../../api/reservationApi';
import { roomStore } from '../../store/roomStore';
import { reservationStore } from '../../store/reservationStore';
import { useTicketStore } from '../../store/ticketStore';
import {
  getSelectionRange,
  hasUnavailableTime,
  isTimeSelected,
} from '../../utils/reservationUtils';
import '../../styles/reservation.css';

const Reservation = () => {
  const userId = reservationStore((state) => state.reservation.userId);
  const roomId = reservationStore((state) => state.reservation.roomId);
  const setReservation = reservationStore((state) => state.setReservation);
  const rooms = roomStore((state) => state.rooms);
  const room = rooms.find((room) => room.id === roomId);
  const setPurchaseType = useTicketStore((state) => state.setPurchaseType);

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const navigate = useNavigate();

  // 예약 날짜 생성 (오늘부터 14일)
  const createDates = () => {
    const result = [];

    for (let i = 0; i < 14; i++) {
      const date = new Date();

      date.setDate(date.getDate() + i);

      result.push(date.toISOString().split('T')[0]);
    }

    return result;
  };

  // 날짜 목록 생성
  useEffect(() => {
    const dateList = createDates();

    setDates(dateList);
    setSelectedDate(dateList[0]);
  }, []);

  // 현재 선택 날짜의 예약 가능 시간 조회
  useEffect(() => {
    if (!roomId || !selectedDate) return;

    const fetchAvailableTime = async () => {
      try {
        const response = await reservationApi.getAvailableTime(
          roomId,
          selectedDate,
        );

        const times = response.data.data.map((item) => ({
          time: `${String(item.startHour).padStart(2, '0')}:00`,
          available: item.available,
        }));

        setSelectedTimes(times);
      } catch (error) {
        console.error('예약 가능 시간 조회 실패', error);
      }
    };

    fetchAvailableTime();

    // 날짜 변경 시 기존 선택 초기화
    setStartTime(null);
    setEndTime(null);
  }, [roomId, selectedDate]);

  // 날짜 클릭 이벤트
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setStartTime(null);
    setEndTime(null);
  };

  // 시간 클릭 이벤트
  const handleTimeClick = (time) => {
    if (!time.available) return;

    // 처음 선택
    if (!startTime) {
      setStartTime(time.time);
      return;
    }

    // 범위 선택 완료 상태에서 재클릭
    if (endTime) {
      setStartTime(time.time);
      setEndTime(null);
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
      userId,
      roomId,
      date: selectedDate,
      startTime,
      endTime: finalEndTime,
    });

    console.log(reservationStore.getState().reservation);

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
          <img src={room?.image} alt="" />
        </div>
        <div className="room_badge">
          ROOM {room?.name} 👥 {room?.capacity}인실
        </div>
      </div>
      <button className="confirm_button" onClick={handleConfirm}>
        선택완료
      </button>
    </div>
  );
};

export default Reservation;
