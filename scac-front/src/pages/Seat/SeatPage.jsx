import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { seatStore } from '../../store/seatStore';
import { roomStore } from '../../store/roomStore';
import { reservationStore } from '../../store/reservationStore';
import { checkInStore } from '../../store/checkInStore';
import { openDoor } from '../../api/deviceApi';
import KioskAlertModal from '../../components/modal/KioskAlertModal';
import SeatList from './components/SeatList';
import '../../styles/seat.css';

function SeatPage({ mode }) {
  const [alertModal, setAlertModal] = useState(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const seats = seatStore((state) => state.seats);
  const fetchSeats = seatStore((state) => state.fetchSeats);
  const selected = seatStore((state) => state.selectedSeat);
  const selectSeat = seatStore((state) => state.selectSeat);
  const checkInSeat = seatStore((state) => state.checkInSeat);
  const rooms = roomStore((state) => state.rooms);
  const fetchRooms = roomStore((state) => state.fetchRooms);
  const checkIn = checkInStore((state) => state.checkIn);
  const setReservation = reservationStore((state) => state.setReservation);
  const reservations = reservationStore((state) => state.reservations);
  const fetchReservations = reservationStore(
    (state) => state.fetchReservations,
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeats();
    fetchRooms();
    fetchReservations();
  }, [fetchSeats, fetchRooms, fetchReservations]);

  // 좌석 / 룸 선택 이벤트 정의
  const handleClick = (seat) => {
    // 좌석 페이지
    if (mode === 'seat') {
      if (seat.type !== 'seat' || seat.status !== 'available') return;
    }

    // 스터디룸 페이지
    if (mode === 'room') {
      // 스터디룸 사용 중에도 다른 시간을 예약할 수 있으니 선택가능
      if (seat.type !== 'room') return;
    }

    selectSeat(seat.id);
  };

  const handleConfirm = async () => {
    if (!selected) {
      setAlertModal({
        title: '알림',
        message:
          mode === 'seat' ? '좌석을 선택해주세요' : '스터디룸을 선택해주세요',
        onClose: () => setAlertModal(null),
      });
      return;
    }

    // 스터디룸 예약
    if (mode === 'room') {
      setReservation({
        roomId: selected,
      });
      navigate(`/room/reservation/${selected}`);
      return;
    }

    // 좌석 입실 처리
    const result = await checkIn(selected);

    if (!result.success) {
      setAlertModal({
        title: '입실 실패',
        message: result.message,
        onClose: () => setAlertModal(null),
      });
      return;
    }

    // 입실 성공
    checkInSeat(selected);
    try {
      await openDoor();
    } catch (error) {
      console.error('문 열기 명령 전송 실패: ', error);
    }

    if(isAuthenticated){
      await logout();
    }

    setAlertModal({
      title: '입실 완료',
      message: isAuthenticated ? '입실되었습니다\n\n자동 로그아웃됩니다' : "입실되었습니다",
      onClose: () => {
        setAlertModal(null);
        navigate('/');
      },
    });
  };

  // mode 변경시 선택 초기화
  const clearSelected = seatStore((state) => state.clearSelected);
  useEffect(() => {
    clearSelected();
  }, [mode, clearSelected]);

  const items = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const currentHour = now.getHours();
    const updatedRooms = rooms.map((room) => {
      const isUsing = reservations.some((reservation) => {
        // 해당 방이 아니면 제외
        if (Number(reservation.roomId) !== Number(room.id)) return false;
        // 취소 예약 제외
        if (reservation.status === 'CANCELED') return false;
        // 오늘 예약 아니면 제외
        if (reservation.reservationDate !== today) return false;
        // 예약시간 없으면 제외
        if (!reservation.startHour || !reservation.endHour) return false;

        return (
          currentHour >= reservation.startHour &&
          currentHour < reservation.endHour
        );
      });

      return {
        ...room,
        status: isUsing ? 'using' : 'available',
      };
    });

    return [...seats, ...updatedRooms];
  }, [seats, rooms, reservations]);

  return (
    <div className="seat_page">
      <div className="seat_header">
        <div
          className="back_btn"
          onClick={() => navigate(mode === 'seat' ? '/' : '/loginhome')}
        >
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
        seats={items}
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
          <span className="legend_text">사용중</span>
        </div>
      </div>

      <button className="confirm_button" onClick={handleConfirm}>
        선택완료
      </button>

      {alertModal && (
        <KioskAlertModal
          title={alertModal.title}
          message={alertModal.message}
          onClose={alertModal.onClose}
        />
      )}
    </div>
  );
}

export default SeatPage;
