import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import '../../styles/Auth.css';

function LoginPage() {
  // 전역 스토어에서 로그인 액션 함수 가져오기
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // 입력 필드를 제어하기 위한 로컬 상태 (useState)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /* 로그인 폼 제출(Submit) 핸들러 */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // 간단한 유효성 검사 (공백 체크)
    if (!phoneNumber || !password) {
      setErrorMessage('전화번호와 비밀번호를 모두 입력해 주세요.');
      return;
    }

    // authStore에 정의된 login 액션 호출
    const result = await login(phoneNumber, password);

    if (result.success) {
      alert('로그인이 성공적으로 완료되었습니다!');

      if (result.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/loginhome'); // 요구 사항: /loginhome 경로 이동
      }
    } else {
      // 로그인 실패 시 에러 핸들링
      setErrorMessage('전화번호 또는 입실 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="login_container">
      <div className="login_box">
        <h2 className="login_title">스터디카페 로그인</h2>
        <header className="auth_header">
          <button
            type="button"
            className="btn_home"
            onClick={() => navigate('/')}
          >
            <img
              src="/icons/common/home.svg"
              alt="홈"
              style={{ width: '60px', height: '70px' }}
            />
          </button>
        </header>

        <form id="login_form" onSubmit={handleLoginSubmit}>
          <div className="input_group">
            <label htmlFor="user_phone">전화번호</label>
            <input
              id="user_phone"
              className="input_field"
              type="text"
              placeholder="01012345678 (숫자만 입력)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="input_group">
            <label htmlFor="user_password">입실 비밀번호</label>
            <input
              id="user_password"
              className="input_field"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && <p className="error_text">{errorMessage}</p>}

          <button type="submit" className="btn_submit">
            로그인하기
          </button>
        </form>

        <div className="login_footer">
          <button
            type="button"
            className="btn_link"
            onClick={() => navigate('/signup')}
          >
            아직 회원이 아니신가요? 회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
