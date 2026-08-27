import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderTime from '../components/HeaderTime';
import { useIdleTimer } from '../hooks/useIdleTimer';

export default function KioskLayout() {
  // 3분 동안 화면 무입력 시 자동 전체 초기화 및 홈 화면 복귀
  useIdleTimer();

  return (
    <div className="kiosk_viewport">
      <div className="kiosk_wrap">
        <header>
          <HeaderTime />
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

