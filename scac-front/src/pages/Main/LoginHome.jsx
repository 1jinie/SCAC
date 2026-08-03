import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { seatStore } from '../../store/seatStore';
import { checkInStore } from '../../store/checkInStore';
import { getCurrentUser } from '../../api/userApi';
import InOutModal from '../../components/modal/InOutModal';
import '../../styles/LoginHome.css';
import { reservationStore } from '../../store/reservationStore';

function LoginHomePage() {
  const navigate = useNavigate();
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const prepareMemberCheckIn = checkInStore(
    (state) => state.prepareMemberCheckIn,
  );
  const checkOutSeat = seatStore((state) => state.checkOutSeat);
  const updateCheckOut = checkInStore((state) => state.updateCheckOut);
  const seats = seatStore((state) => state.seats);
  const fetchSeats = seatStore((state) => state.fetchSeats);
  const setReservation = reservationStore((state) => state.setReservation);
  const logout = useAuthStore((state) => state.logout);
  const clearUserData = useUserStore((state) => state.clearUserData);

  const availableSeats = seats.filter(
    (seat) => seat.type === 'seat' && seat.status === 'available',
  ).length;

  const totalSeats = seats.filter((seat) => seat.type === 'seat').length;

  const handleMemberCheckIn = async () => {
    const result = await prepareMemberCheckIn();

    if (!result.success) {
      alert(result.message);
      return;
    }

    navigate('/seat');
  };

  const handleCheckOut = (data) => {
    updateCheckOut(data.checkInId);
    checkOutSeat(data.seatId);
    setShowCheckOutModal(false);
  };

  const handleRoom = async () => {
    try {
      const result = await getCurrentUser();

      if (!result.success) {
        alert(result.message);
        return;
      }

      setReservation({
        userId: result.data,
      });

      navigate('/room');
    } catch (error) {
      alert('사용자 정보를 가져오는데 실패했습니다');
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  // 로그아웃 공통 로직 처리
  const handleLogoutClick = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      clearUserData();
      logout();
      alert('안전하게 로그아웃되었습니다.');
      navigate('/');
    }
  };

  return (
    <div className="kiosk_container">
      {/* 상단 헤더 / 로고 영역 */}
      <header className="kiosk_header">
        <div className="logo_box">
          <div className="logo_icon">
            <img src="/logo/logo.png" alt="로고 아이콘" className="logo_img" />
          </div>
        </div>
      </header>

      {/* 실시간 좌석 현황 대시보드 */}
      <div className="seat_status_bar">
        <span className="chair_icon">
          <img
            src="/icons/common/chair.svg"
            alt="의자"
            style={{ width: '32px', height: '32px' }}
          />
        </span>
        <span className="status_text">
          좌석 수 {availableSeats}/{totalSeats}
        </span>
      </div>

      {/* 메인 메뉴 그리드 영역 */}
      <main className="menu_grid">
        {/* 상단 강조 메뉴 (동일 레이아웃 유지) */}
        <div className="highlight_menu_row">
          <button
            type="button"
            className="menu_btn btn_orange"
            onClick={handleMemberCheckIn}
          >
            <div className="btn_icon">
              <img
                src="/icons/common/open_door.svg"
                alt="입실"
                style={{ width: '32px', height: '32px' }}
              />
            </div>
            <span className="btn_label">입실</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_orange"
            onClick={() => navigate('/')}
          >
            <div className="btn_icon">
              <img
                src="/icons/common/open_door.svg"
                alt="외출"
                style={{ width: '32px', height: '32px' }}
              />
            </div>
            <span className="btn_label">외출</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_orange"
            onClick={() => setShowCheckOutModal(true)}
          >
            <div className="btn_icon">
              <img
                src="/icons/common/close_door.svg"
                alt="퇴실"
                style={{ width: '32px', height: '32px' }}
              />
            </div>
            <span className="btn_label">퇴실</span>
          </button>
        </div>

        {/* 하단 기본 메뉴 (버튼 전환 스위칭 적용) */}
        <div className="standard_menu_grid">
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('/ticket')}
          >
            <div className="btn_icon">
              <img
                src="/icons/common/ticket.svg"
                alt="이용권 결제"
                style={{ width: '80px', height: '45px' }}
              />
            </div>
            <span className="btn_label">이용권 결제</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={handleRoom}
          >
            <div className="btn_icon">
              <img
                src="/icons/reservation/reserv.svg"
                alt="스터디룸 예약"
                style={{ width: '60px', height: '60px' }}
              />
            </div>
            <span className="btn_label">스터디룸 예약</span>
          </button>

          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('/mypage')}
          >
            <div className="btn_icon">
              <img
                src="/icons/common/login.svg"
                alt="내정보"
                style={{ width: '80px', height: '65px' }}
              />
            </div>
            <span className="btn_label">내 정보</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={handleLogoutClick}
          >
            <div className="btn_icon">
              <img
                src="/icons/common/logout.svg"
                alt="로그아웃"
                style={{ width: '80px', height: '65px' }}
              />
            </div>
            <span className="btn_label">로그아웃</span>
          </button>
        </div>
      </main>

      {/* 하단 풋터 (관리자 안내 영역) */}
      <footer className="kiosk_footer">
        <div className="headset_icon">
          <img
            src="/icons/common/headphone.svg"
            alt="관리자 정보"
            style={{ width: '80px', height: '45px' }}
          />
        </div>
        <span className="footer_text">관리자 번호: 010-0000-0000</span>
      </footer>

      {showCheckOutModal && (
        <InOutModal
          title="퇴실"
          onClose={() => setShowCheckOutModal(false)}
          onConfirm={handleCheckOut}
        />
      )}
    </div>
  );
}

export default LoginHomePage;
