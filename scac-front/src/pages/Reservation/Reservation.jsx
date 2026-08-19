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
import { formatHour } from '../../utils/formatter';
import KioskAlertModal from '../../components/modal/KioskAlertModal'
import '../../styles/reservation.css';

const Reservation = () => {
  const userId = reservationStore((state) => state.reservation.userId);
  const roomId = reservationStore((state) => state.reservation.roomId);
  const setReservation = reservationStore((state) => state.setReservation);
  const rooms = roomStore((state) => state.rooms);
  const room = rooms.find((room) => room.id === roomId);
  const setPurchaseType = useTicketStore((state) => state.setPurchaseType);

  const [alertModal, setAlertModal] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isCreatingReservation, setIsCreatingReservation] = useState(false);
  const [reservationError, setReservationError] = useState('');

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

  // 현재 시간 이전인지 판단
  const isPastTime = (time) => {
    if(!selectedDate) return false;

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // 오늘 아니면 과거 시간 제한 x
    if(selectedDate !== today) return false;

    const selectedHour = Number(time.split(':')[0]);
    const currentHour = now.getHours();

    return selectedHour <= currentHour;
  }

  // 시간 클릭 이벤트
  const handleTimeClick = (time) => {
    if (!time.available) return;

    // 지난 시간 선택 시
    if(isPastTime(time.time)){
      setAlertModal({
        title: '예약 불가',
        message: '현재 시간 이후의 시간만 예약할 수 있습니다',
        onClose: () => setAlertModal(null)
      });

      return;
    }

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

      setAlertModal({
        title: '예약 불가',
        message: '선택한 시간에 예약 불가 시간이 포함되어 있습니다',
        onClose: () => setAlertModal(null)
      });

      return;
    }
    setStartTime(selectedTimes[startIndex].time);
    setEndTime(selectedTimes[endIndex].time);
  };

  // 예약 시간 선택 버튼에 스타일 적용 위한 함수
  const isSelected = (time) =>
    isTimeSelected(selectedTimes, startTime, endTime, time);

  // 선택완료 버튼 이벤트
  const handleConfirm = async () => {
    if (!startTime || isCreatingReservation) {
      if (!startTime) {
        alert('시간을 선택해주세요.');
      }
      return;
    }

    const finalEndTime = addOneHour(endTime ?? startTime);

    const requestData = {
      roomId,
      reservationDate: selectedDate,
      startHour: formatHour(startTime),
      endHour: formatHour(finalEndTime),
    };

    try {
      setIsCreatingReservation(true);
      setReservationError('');

      const response = await reservationApi.createReservation(requestData);

      const createdReservation = response.data.data;

      setReservation({
        reservationId: createdReservation.reservationId,
        roomId: createdReservation.roomId,
        reservationDate: createdReservation.reservationDate,
        startHour: createdReservation.startHour,
        endHour: createdReservation.endHour,
      });

      setPurchaseType('MEETING_ROOM');

      navigate('/payment');
    } catch (error) {
      setReservationError(
        error.response?.data?.message ??
          '예약을 생성하지 못했습니다. 다시 시도해주세요.',
      );
    } finally {
      setIsCreatingReservation(false);
    }
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
        {selectedTimes.map((item) => {
          const past = isPastTime(item.time);
          const disabled = !item.available || past;
          
          return (
            <button
              key={item.time}
              disabled={disabled}
              onClick={() => handleTimeClick(item)}
              className={`time_btn 
                  ${isSelected(item.time) ? 'active' : ''}
                  ${disabled ? 'disabled' : ''}`}
            >
              {item.time}
            </button>
          );
        })}
      </div>
      <div className="room_info">
        <div className="preview_img">
          <img src={room?.image} alt="" />
        </div>
        <div className="room_badge">
          ROOM {room?.name} 👥 {room?.capacity}인실
        </div>
      </div>
      <button
        className="confirm_button"
        onClick={handleConfirm}
        disabled={isCreatingReservation}
      >
        {isCreatingReservation ? '예약 확인 중...' : '선택완료'}
      </button>
      {reservationError && (
        <KioskAlertModal
          title='예약 실패'
          message={reservationError}
          onClose={() => setReservationError('')}
        />
      )}
      {alertModal && (
        <KioskAlertModal
          title={alertModal.title}
          message={alertModal.message}
          onClose={alertModal.onClose}
        />
      )}
    </div>
  );
};

export default Reservation;
