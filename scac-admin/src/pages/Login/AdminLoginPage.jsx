import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import HeaderTime from '../../components/HeaderTime';
import './css/Admin_Login.css';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const adminLogin = useAuthStore((state) => state.adminLogin);

  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminIdChange = (e) => {
    setAdminId(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!adminId.trim() || !password.trim()) {
      setErrorMessage('관리자 아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    // 백엔드 POST /api/admin/auth/login 연동[cite: 92]
    const result = await adminLogin(adminId, password);
    if (result.success) {
      // 💡 /admin 경로 대신 어드민 루트 경로인 "/"로 이동    
      navigate('/', { replace: true });
    } else {
      setErrorMessage(result.message || '로그인에 실패했습니다.');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="admin_login_page">
      <header className="admin_login_header">
        <button
          type="button"
          className="admin_login_home_button"
          onClick={handleHome}
          aria-label="키오스크 메인으로 이동"
        >
          홈
        </button>

        <HeaderTime />
      </header>

      <main className="admin_login_main">
        <section className="admin_login_card">
          <div className="admin_login_title_wrap">
            <p className="admin_login_eyebrow">SCAC ADMIN</p>
            <h1>ADMIN LOGIN</h1>
            <p>관리자 계정으로 로그인해 주세요.</p>
          </div>

          <form className="admin_login_form" onSubmit={handleLoginSubmit}>
            <label htmlFor="admin_id">관리자 ID</label>
            <input
              id="admin_id"
              name="adminId"
              type="text"
              value={adminId}
              onChange={handleAdminIdChange}
              placeholder="관리자 ID를 입력해 주세요"
              autoComplete="username"
            />

            <label htmlFor="admin_password">비밀번호</label>
            <input
              id="admin_password"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력해 주세요"
              autoComplete="current-password"
            />

            {errorMessage && (
              <p className="admin_login_error" role="alert">
                {errorMessage}
              </p>
            )}

            <button type="submit" className="admin_login_submit_button">
              로그인
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
