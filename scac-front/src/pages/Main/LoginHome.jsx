import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import '../../styles/LoginHome.css';

function LoginHomePage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const clearUserData = useUserStore((state) => state.clearUserData);

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
        <span className="time_text">오전 11:41</span>
        <div className="logo_box">
          <div className="logo_icon">📚☕</div>
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
        {/* 상단 강조 메뉴 (동일 레이아웃 유지) */}
        <div className="highlight_menu_row">
          <button
            type="button"
            className="menu_btn btn_orange"
            onClick={() => navigate('/seat')}
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

        {/* 하단 기본 메뉴 (버튼 전환 스위칭 적용) */}
        <div className="standard_menu_grid">
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('/')}
          >
            <span className="btn_icon">💳</span>
            <span className="btn_label">이용권 결제</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('/')}
          >
            <span className="btn_icon">📅</span>
            <span className="btn_label">스터디룸 예약</span>
          </button>

          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('/mypage')}
          >
            <span className="btn_icon">🔍👤</span>
            <span className="btn_label">내 정보</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={handleLogoutClick}
          >
            <span className="btn_icon">↪️</span>
            <span className="btn_label">로그아웃</span>
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

export default LoginHomePage;
