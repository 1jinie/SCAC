import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/NonSignup.css';

function NonmemberSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(180);

  useEffect(() => {
    let interval = null;
    if (isVerificationSent && timer > 0 && !isVerified) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setErrors((prev) => ({
        ...prev,
        verification: '인증 시간이 만료되었습니다. 다시 발송해주세요.',
      }));
    }
    return () => clearInterval(interval);
  }, [isVerificationSent, timer, isVerified]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendVerification = () => {
    if (!formData.phone.trim()) {
      setErrors((prev) => ({ ...prev, phone: '전화번호를 입력해주세요.' }));
      return;
    }
    if (!/^01\d{8,9}$/.test(formData.phone.replace(/-/g, ''))) {
      setErrors((prev) => ({
        ...prev,
        phone: '전화번호 형식이 올바르지 않습니다.',
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, phone: '', verification: '' }));
    setIsVerificationSent(true);
    setTimer(180);
    alert('인증번호 6자리가 발송되었습니다. (테스트용: 123456)');
  };

  const handleConfirmVerification = () => {
    if (verificationCode === '123456') {
      setIsVerified(true);
      setErrors((prev) => ({ ...prev, verification: '' }));
    } else {
      setErrors((prev) => ({
        ...prev,
        verification: '인증번호가 일치하지 않습니다.',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^01\d{8,9}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '전화번호 형식이 올바르지 않습니다.';
    }

    if (!isVerified) {
      newErrors.verification = '전화번호 인증을 완료해주세요.';
    }

    if (!formData.password.trim()) {
      newErrors.password = '입실 비밀번호를 입력해주세요.';
    } else if (!/^\d{6}$/.test(formData.password)) {
      newErrors.password = '비밀번호는 숫자 6자리여야 합니다.';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) return;

    console.log('✅ 유효한 데이터:', formData);
    setSuccessMessage('입실 준비가 완료되었습니다!');

    setTimeout(() => {
      navigate('/ticket');
    }, 1500);
  };

  return (
    <div className="nonmember_signup_page">
      <header className="nonmember_signup_header">
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
        <span className="header_time" />
      </header>

      <section className="signup_card">
        <h1 className="signup_title">사용자 정보 입력</h1>

        <div className="signup_tab_group">
          <button type="button" className="signup_tab">
            비회원입실
          </button>
        </div>

        {successMessage && (
          <div className="success_message">{successMessage}</div>
        )}

        <form className="signup_form" onSubmit={handleSubmit}>
          {/* 이름 입력 */}
          <div className="form_group">
            <label className="form_label" htmlFor="name">
              이름
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`form_input ${errors.name ? 'input_error' : ''}`}
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error_text">{errors.name}</span>}
          </div>

          {/* 전화번호 입력 (인증번호 발송 포함) */}
          <div className="form_group">
            <label className="form_label" htmlFor="phone">
              전화번호
            </label>
            {/* 🎯 absolute 기준점을 만들어주는 wrapper 추가 */}
            <div className="input_wrapper">
              <input
                id="phone"
                name="phone"
                type="tel"
                /* 💡 버튼 영역을 침범하지 않게 'with_btn' 클래스 유동 추가 */
                className={`form_input ${errors.phone ? 'input_error' : ''} ${!isVerified ? 'with_btn' : ''}`}
                placeholder="01012345678"
                disabled={isVerified}
                value={formData.phone}
                onChange={handleChange}
              />

              {!isVerified && (
                <button
                  type="button"
                  className="btn_inner_verify"
                  onClick={handleSendVerification}
                >
                  {isVerificationSent ? '재발송' : '인증번호 발송'}
                </button>
              )}
            </div>
            {errors.phone && <span className="error_text">{errors.phone}</span>}
          </div>

          {/* 인증번호 입력 (발송 완료 시 노출) */}
          {isVerificationSent && (
            <div className="form_group">
              <label className="form_label" htmlFor="verificationCode">
                인증번호 입력
              </label>

              <div className="input_wrapper">
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  className={`form_input ${errors.verification ? 'input_error' : ''} with_btn`}
                  placeholder="인증번호 6자리 입력"
                  disabled={isVerified}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />

                {!isVerified ? (
                  /* 🎯 타이머와 인증확인 버튼 레이아웃 맞춤형 정렬 */
                  <div className="verify_action_container">
                    <span className="verify_timer">{formatTime(timer)}</span>
                    <button
                      type="button"
                      className="btn_inner_verify static_btn"
                      onClick={handleConfirmVerification}
                    >
                      인증확인
                    </button>
                  </div>
                ) : (
                  <span className="inner_success_badge">✓ 인증 확인됨</span>
                )}
              </div>
              {errors.verification && (
                <span className="error_text">{errors.verification}</span>
              )}
            </div>
          )}

          {/* 입실 비밀번호 */}
          <div className="form_group">
            <label className="form_label" htmlFor="password">
              입실 비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={`form_input ${errors.password ? 'input_error' : ''}`}
              placeholder="숫자 6자리"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="error_text">{errors.password}</span>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="form_group">
            <label className="form_label" htmlFor="confirmPassword">
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`form_input ${errors.confirmPassword ? 'input_error' : ''}`}
              placeholder="비밀번호 재입력"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <span className="error_text">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="submit_button">
            입력 완료
          </button>
        </form>
      </section>
    </div>
  );
}

export default NonmemberSignup;
