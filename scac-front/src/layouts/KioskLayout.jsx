import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import HeaderTime from '../components/HeaderTime';

export default function KioskLayout() {
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
