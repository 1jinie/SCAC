import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { seatStore } from '../../store/seatStore';
import { checkInStore } from '../../store/checkInStore';
import CheckOutModal from '../../components/modal/CheckOutModal';
import '../../styles/Home.css';

function HomePage() {
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showGoOutModal, setShowGoOutModal] = useState(false);
  const goOut = checkInStore((state) => state.goOut);
  const checkOutSeat = seatStore((state) => state.checkOutSeat);
  const updateCheckOut = checkInStore((state) => state.updateCheckOut);
  const seats = seatStore((state) => state.seats);
  const navigate = useNavigate();

  const availableSeats = seats.filter(
    (seat) => seat.type === 'seat' && seat.status === 'available',
  ).length;

  const totalSeats = seats.filter((seat) => seat.type === 'seat').length;

  const handleGoOut = (data) => {
    goOut(data.userId);
    setShowGoOutModal(false);
  };

  const handleCheckOut = (data) => {
    updateCheckOut(data.checkInId);
    checkOutSeat(data.seatId);
    setShowCheckOutModal(false);
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
        <span className="chair_icon">🪑</span>
        <span className="status_text">
          좌석 수 {availableSeats}/{totalSeats}
        </span>
      </div>

      {/* 메인 메뉴 그리드 영역 */}
      <main className="menu_grid">
        {/* 상단 강조 메뉴 (주황색 버튼 라인) */}
        <div className="highlight_menu_row">
          <button
            type="button"
            className="menu_btn btn_orange"
            onClick={() => navigate('/seat')} //임시 경로
          >
            <div className="btn_icon">🚪➡️</div>
            <span className="btn_label">입실</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_orange"
            onClick={() => setShowGoOutModal(true)}
          >
            <div className="btn_icon">🚪⬅️</div>
            <span className="btn_label">외출</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_orange"
            onClick={() => setShowCheckOutModal(true)}
          >
            <div className="btn_icon">🚪🔒</div>
            <span className="btn_label">퇴실</span>
          </button>
        </div>

        {/* 하단 기본 메뉴 (회색 버튼 라인) */}
        <div className="standard_menu_grid">
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('nonmember-signup')} // 비회원 회원가입 경로 설정
          >
            <div className="btn_icon">💳</div>
            <span className="btn_label">이용권 결제</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('/room')}
          >
            <div className="btn_icon">📅</div>
            <span className="btn_label">스터디룸 예약</span>
          </button>

          {/* 로그인 전용 버튼 세트 */}
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('/login')}
          >
            <div className="btn_icon">👤</div>
            <span className="btn_label">로그인</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('/signup')}
          >
            <div className="btn_icon">👥</div>
            <span className="btn_label">회원가입</span>
          </button>
        </div>
      </main>

      {/* 하단 풋터 (관리자 안내 영역) */}
      <footer className="kiosk_footer">
        <div className="headset_icon">🎧</div>
        <span className="footer_text">관리자 번호: 010-0000-0000</span>
      </footer>

      {showCheckOutModal && (
        <CheckOutModal
          onClose={() => setShowCheckOutModal(false)}
          onConfirm={handleCheckOut}
        />
      )}
      {showGoOutModal && (
        <CheckOutModal
          mode="goOut"
          onClose={() => setShowGoOutModal(false)}
          onConfirm={handleGoOut}
        />
      )}
    </div>
  );
}

export default HomePage;
