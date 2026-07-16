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
    // 입력값 변경 시 해당 필드 에러 초기화
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 인증번호 관련 핵심 상태 (재사용 및 이식 용이)
  const [isVerificationSent, setIsVerificationSent] = useState(false); // 인증번호 발송 여부
  const [verificationCode, setVerificationCode] = useState(''); // 입력된 인증번호
  const [isVerified, setIsVerified] = useState(false); // 인증 완료 여부
  const [timer, setTimer] = useState(180); // 타이머 (3분 = 180초)

  // 타이머 카운트다운 로직
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

  // 타이머 초단위를 MM:SS 형식으로 변환
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 🎯 [기능] 인증번호 발송 버튼 클릭
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

    // 에러 초기화 및 가상 발송 처리
    setErrors((prev) => ({ ...prev, phone: '', verification: '' }));
    setIsVerificationSent(true);
    setTimer(180); // 타이머 3분 초기화
    alert('인증번호 6자리가 발송되었습니다. (테스트용: 123456)');
  };

  // 🎯 [기능] 인증확인 버튼 클릭
  const handleConfirmVerification = () => {
    // 프론트엔드 모의 검증 (테스트 번호: 123456)
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

  // 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};

    // 공백 검사
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

    // 유효성 검사 실행
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
          className="header_back_button"
          onClick={() => navigate(-1)}
        >
          ←
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

          <div className="form_group">
            <label className="form_label" htmlFor="phone">
              전화번호
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={`form_input ${errors.phone ? 'input_error' : ''}`}
              placeholder="01012345678"
              disabled={isVerified} // 인증 완동 시 번호 수정 불가 처리
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

            {errors.phone && <span className="error_text">{errors.phone}</span>}

          </div>

          {/* 🎯 인증번호 입력창 (발송 버튼 클릭 시에만 노출 / 피그마 시안 완벽 대응) */}
          {isVerificationSent && (
            <div className="form_group verify_group">
              <label className="form_label" htmlFor="verificationCode">인증번호 입력</label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                className="input_field"
                placeholder="인증번호 6자리 입력"
                disabled={isVerified}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              
              {/* 인증 전에는 타이머와 확인 버튼 노출, 인증 후에는 완료 안내문 처리 */}
              {!isVerified ? (
                <div style={{ position: 'absolute', right: '24px', bottom: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ color: '#ff4444', fontSize: '24px', fontWeight: 'bold' }}>{formatTime(timer)}</span>
                  <button 
                    type="button" 
                    className="btn_inner_verify" 
                    style={{ position: 'static', height: '80px' }}
                    onClick={handleConfirmVerification}
                  >
                    인증확인
                  </button>
                </div>
              ) : (
                <span className="success_text" style={{ color: '#4b9da9', fontSize: '24px', fontWeight: '700', marginTop: '8px', paddingLeft: '12px' }}>
                  ✓ 인증이 확인되었습니다.
                </span>
              )}
              {errors.verification && <span className="error_text">{errors.verification}</span>}
            </div>
          )}

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

          <div className="form_group">
            <label className="form_label" htmlFor="confirmPassword">
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`form_input ${
                errors.confirmPassword ? 'input_error' : ''
              }`}
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
