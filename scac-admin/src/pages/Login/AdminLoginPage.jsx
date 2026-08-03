import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderTime from "../../components/HeaderTime";
import "./css/Admin_Login.css";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAdminIdChange = (e) => {
    setAdminId(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (!adminId.trim() || !password.trim()) {
      setErrorMessage("관리자 번호와 비밀번호를 입력해 주세요.");
      return;
    }

    setErrorMessage("");

    // 추후 관리자 로그인 API 연결
    // 성공 시 관리자 메인으로 이동
    navigate("/admin", { replace: true });
  };

  const handleHome = () => {
    navigate("/");
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
