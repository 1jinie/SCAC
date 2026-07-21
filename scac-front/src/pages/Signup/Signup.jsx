import React, { useState, useEffect } from 'react';
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

  // 🎯 인증번호 관련 독립 상태 추가
  const [isVerificationSent, setIsVerificationSent] = useState(false); // 인증번호 발송 여부
  const [verificationCode, setVerificationCode] = useState(''); // 사용자가 입력한 인증번호
  const [isVerified, setIsVerified] = useState(false); // 인증 완료 여부
  const [timer, setTimer] = useState(180); // 3분 타이머 (180초)

  // 🎯 타이머 카운트다운 로직
  useEffect(() => {
    let interval = null;
    if (isVerificationSent && timer > 0 && !isVerified) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setErrorMessage('인증 시간이 만료되었습니다. 다시 발송해주세요.');
    }
    return () => clearInterval(interval);
  }, [isVerificationSent, timer, isVerified]);

  // 초단위를 MM:SS 형식으로 변환
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 🎯 [기능] 인증번호 발송 클릭 핸들러
  const handleSendVerification = () => {
    setErrorMessage('');

    if (!phoneNumber.trim()) {
      setErrorMessage('전화번호를 입력해주세요.');
      return;
    }
    // 휴대폰 번호 정규식 체크 (숫자만 10~11자리)
    if (!/^01\d{8,9}$/.test(phoneNumber.replace(/-/g, ''))) {
      setErrorMessage('전화번호 형식이 올바르지 않습니다.');
      return;
    }

    setIsVerificationSent(true);
    setTimer(180); // 타이머 초기화
    alert('인증번호 6자리가 발송되었습니다. (테스트용: 123456)');
  };

  // 🎯 [기능] 인증번호 확인 클릭 핸들러
  const handleConfirmVerification = () => {
    setErrorMessage('');

    // 테스트용 하드코딩 인증번호 (추후 API 연동 시 백엔드 요청으로 변경 가능)
    if (verificationCode === '123456') {
      setIsVerified(true);
      alert('인증이 완료되었습니다.');
    } else {
      setErrorMessage('인증번호가 일치하지 않습니다.');
    }
  };

  /* 회원가입 폼 제출(Submit) 핸들러 */
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // 빈 값 체크
    if (!phoneNumber || !password || !confirmPassword) {
      setErrorMessage('모든 항목을 입력해 주세요.');
      return;
    }

    // 🎯 전화번호 인증 완료 체크 추가
    if (!isVerified) {
      setErrorMessage('전화번호 인증을 완료해주세요.');
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
        '회원가입이 성공적으로 완료되었습니다! 로그인 홈페이지로 이동합니다.',
      );
      navigate('/login');
    } else {
      setErrorMessage(
        result.errorMessage ||
          '회원가입에 실패했습니다. 이미 등록된 번호인지 확인해 주세요.',
      );
    }
  };

  return (
    <div className="signup_container">
      <div className="signup_box">
        <h2 className="signup_title">회원가입</h2>
        <header className="auth_header">
          <button
            type="button"
            className="btn_home"
            onClick={() => navigate('/')}
          >
            <img
              src="/icons/common/home.svg"
              alt="홈"
              style={{ width: '90px', height: '150px' }}
            />
          </button>
        </header>

        <form id="signup_form" onSubmit={handleSignUpSubmit}>
          {/* 1. 전화번호 입력 그룹 (FHD 시안 맞춤형 절대 위치 배치 반영) */}
          <div className="input_group">
            <label htmlFor="reg_phone" className="input_guide_label">
              전화번호
            </label>
            <input
              id="reg_phone"
              /* 🎯 중요: 일반 input_field 외에 우측 여백 확보용 input_field_with_btn 클래스 추가 */
              className={`input_field ${!isVerified ? 'input_field_with_btn' : ''}`}
              type="text"
              placeholder="01012345678 (숫자만 입력)"
              disabled={isVerified} // 인증 완료 시 수정 불가
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {!isVerified && (
              <button
                type="button"
                className="btn_inner_verify1"
                onClick={handleSendVerification}
              >
                {isVerificationSent ? '재발송' : '인증번호 발송'}
              </button>
            )}
          </div>

          {/* 🎯 2. 인증번호 입력 그룹 (발송 완료 시에만 조건부 노출) */}
          {isVerificationSent && (
            <div className="input_group">
              <label htmlFor="verification_code">인증번호 입력</label>
              <div className="input_field_wrapper">
                <input
                  id="verification_code"
                  className={`input_field ${!isVerified ? 'input_field_with_btn' : ''}`}
                  type="text"
                  placeholder="인증번호 6자리 입력"
                  disabled={isVerified} // 인증 완료 시 수정 불가
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />

                {!isVerified ? (
                  <>
                    <span className="verification_timer">
                      {formatTime(timer)}
                    </span>
                    <button
                      type="button"
                      className="btn_inner_verify"
                      onClick={handleConfirmVerification}
                    >
                      인증확인
                    </button>
                  </>
                ) : null}
              </div>

              {isVerified && (
                <span
                  className="success_text"
                  style={{
                    color: 'var(--color-important)',
                    fontSize: '24px',
                    fontWeight: '700',
                    marginTop: '8px',
                    paddingLeft: '12px',
                  }}
                >
                  ✓ 인증이 확인되었습니다.
                </span>
              )}
            </div>
          )}

          {/* 3. 입실 비밀번호 입력 그룹 */}
          <div className="input_group">
            <label htmlFor="reg_password">입실 비밀번호</label>
            <input
              id="reg_password"
              className="input_field"
              type="password"
              placeholder="숫자 6자리"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 4. 비밀번호 확인 입력 그룹 */}
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
