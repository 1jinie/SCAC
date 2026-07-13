import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Home.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="kiosk_container">
      {/* 상단 헤더 / 로고 영역 */}
      <header className="kiosk_header">
        <div className="logo_box">
          <h1 className="logo_title">STUDY CAFE</h1>
        </div>
      </header>

      {/* 실시간 좌석 현황 대시보드 */}
      <div className="seat_status_bar">
        <span className="chair_icon">🪑</span>
        <span className="status_text">좌석 수 00/100</span>
      </div>

      {/* 메인 메뉴 그리드 영역 */}
      <main className="menu_grid">
        {/* 상단 강조 메뉴 (주황색 버튼 라인) */}
        <div className="highlight_menu_row">
          <button
            type="button"
            className="menu_btn btn_orange"
            onClick={() => navigate('seat')} // 입실 경로 설정
          >
            <span className="btn_icon">🚪➡️</span>
            <span className="btn_label">입실</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_orange"
            onClick={() => navigate('/')}
          >
            <span className="btn_icon">🚪⬅️</span>
            <span className="btn_label">외출</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_orange"
            onClick={() => navigate('/')}
          >
            <span className="btn_icon">🚪🔒</span>
            <span className="btn_label">퇴실</span>
          </button>
        </div>

        {/* 하단 기본 메뉴 (회색 버튼 라인) */}
        <div className="standard_menu_grid">
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('ticket')}
          >
            <span className="btn_icon">💳</span>
            <span className="btn_label">이용권 결제</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('studyroom_reservation')}
          >
            <span className="btn_icon">📅</span>
            <span className="btn_label">스터디룸 예약</span>
          </button>

          {/* 로그인 전용 버튼 세트 */}
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('/login')}
          >
            <span className="btn_icon">👤</span>
            <span className="btn_label">로그인</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('/signup')}
          >
            <span className="btn_icon">👥</span>
            <span className="btn_label">회원가입</span>
          </button>
        </div>
      </main>

      {/* 하단 풋터 (관리자 안내 영역) */}
      <footer className="kiosk_footer">
        <span className="headset_icon">🎧</span>
        <span className="footer_text">관리자 번호: 010-0000-0000</span>
      </footer>
    </div>
  );
}

export default HomePage;
