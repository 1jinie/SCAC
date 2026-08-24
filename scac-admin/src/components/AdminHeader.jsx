import { useLocation, useNavigate } from 'react-router-dom';
import HeaderTime from './HeaderTime';
import { useAuthStore } from '../store/authStore';
import { adminApi } from '../api/adminApi';
import { useEffect } from 'react';
import { ADMIN_ROLE_LABELS } from '../constants/admin';

const ADMIN_PAGE_TITLES = {
  '/': '관리자 메인',
  '/log': '로그 확인',
  '/reservation': '예약 승인',
  '/device': '장치 관리',
  '/ticket': '이용권 관리',
  '/payment': '결제 관리',
  '/user': '회원 관리',
  '/account': '관리자 계정 관리',
  '/memo': '관리자 메모',
  '/seat': '좌석 관리',
};

export default function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const pageTitle =
    ADMIN_PAGE_TITLES[location.pathname] ||
    (location.pathname.startsWith('/log/') ? '로그 상세' : '관리자 페이지');

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="admin_header">
      <div className="admin_header_left">
        {location.pathname !== '/' && (
          <button
            type="button"
            className="admin_back_button"
            onClick={handleBack}
            aria-label="이전 페이지로 이동"
          >
            ←
          </button>
        )}

        <div>
          <p className="admin_header_category">SCAC ADMIN</p>
          <h1 className="admin_header_title">{pageTitle}</h1>
        </div>
      </div>

      <div className="admin_header_right">
        <HeaderTime />

        <div className="admin_user_info">
          <span className="admin_user_role">
<<<<<<< HEAD
            {user?.role === 'SUPER_ADMIN'
              ? '최고 관리자'
              : user?.role === 'STAFF'
                ? '매니저'
                : '관리자'}
          </span>
          <span className="admin_user_name">
            {user?.loginId || (user?.adminId ? `Admin #${user.adminId}` : '관리자')}
          </span>
=======
            {ADMIN_ROLE_LABELS[user?.role] ?? '관리자'}
          </span>
          <span className="admin_user_name">{user?.name ?? '-'}</span>
>>>>>>> 8a6b7f9ff6688f42902ec23456ef7543c80dce35
        </div>

        <button
          type="button"
          className="admin_logout_button"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
