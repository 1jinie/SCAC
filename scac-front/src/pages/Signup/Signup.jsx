import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import '../../styles/Auth.css';

function SignUpPage() {
  // 전역 스토어에서 회원가입 액션 가져오기
  const signUp = useAuthStore((state) => state.signUp);
  const navigate = useNavigate();

  // 입력 필드 제어용 로컬 상태 (useState)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /* 회원가입 폼 제출(Submit) 핸들러 */
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // 빈 값 체크
    if (!phoneNumber || !password || !confirmPassword) {
      setErrorMessage('모든 항목을 입력해 주세요.');
      return;
    }

    // 비밀번호와 비밀번호 확인 일치 검사
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
      return;
    }

    const userData = {
      phoneNumber: phoneNumber,
      password: password,
    };

    // authStore의 signUp 액션 호출
    const result = await signUp(userData);

    if (result.success) {
      alert(
        '회원가입이 성공적으로 완료되었습니다! 로그인 페이지로 이동합니다.',
      );
      navigate('/'); // 가입 성공 시 메인 페이지로 복귀
    } else {
      setErrorMessage(
        '회원가입에 실패했습니다. 이미 등록된 번호인지 확인해 주세요.',
      );
    }
  };

  return (
    <div className="signup_container">
      <div className="signup_box">
        <h2 className="signup_title">스터디카페 회원가입</h2>

        <form id="signup_form" onSubmit={handleSignUpSubmit}>
          <div className="input_group">
            <label htmlFor="reg_phone">전화번호</label>
            <input
              id="reg_phone"
              className="input_field"
              type="text"
              placeholder="01012345678 (숫자만 입력)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="input_group">
            <label htmlFor="reg_password">비밀번호</label>
            <input
              id="reg_password"
              className="input_field"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input_group">
            <label htmlFor="reg_confirm_password">비밀번호 확인</label>
            <input
              id="reg_confirm_password"
              className="input_field"
              type="password"
              placeholder="비밀번호를 한 번 더 입력하세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {errorMessage && <p className="error_text">{errorMessage}</p>}

          <button type="submit" className="btn_submit">
            가입하기
          </button>
        </form>

        <div className="signup_footer">
          <button
            type="button"
            className="btn_link"
            onClick={() => navigate('/login')}
          >
            이미 계정이 있으신가요? 로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
