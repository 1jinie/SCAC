import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { postSendCode, postVerifyCode } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';

import './css/NonSignup.css';

function NonmemberSignup() {
  const navigate = useNavigate();

  const guestSignUp = useAuthStore((state) => state.guestSignUp);
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(180);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 인증번호 타이머
  useEffect(() => {
    let interval = null;

    if (isVerificationSent && timer > 0 && !isVerified) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0 && !isVerified) {
      setErrors((prev) => ({
        ...prev,
        verification: '인증 시간이 만료되었습니다. 다시 발송해주세요.',
      }));
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isVerificationSent, timer, isVerified]);

  // 입력값 변경
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // 시간 표시
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  };

  // 인증번호 발송
  const handleSendVerification = async () => {
    const phone = formData.phone.trim().replace(/-/g, '');

    if (!phone) {
      setErrors((prev) => ({
        ...prev,
        phone: '전화번호를 입력해주세요.',
      }));
      return;
    }

    if (!/^01\d{8,9}$/.test(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: '전화번호 형식이 올바르지 않습니다.',
      }));
      return;
    }

    try {
      const res = await postSendCode(phone);

      if (res.isSuccess) {
        setErrors((prev) => ({
          ...prev,
          phone: '',
          verification: '',
        }));

        setIsVerificationSent(true);
        setIsVerified(false);
        setVerificationCode('');
        setTimer(180);

        alert(res.message || '인증번호가 발송되었습니다.');
      } else {
        setErrors((prev) => ({
          ...prev,
          phone: res.message || '인증번호 발송에 실패했습니다.',
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        phone: error.response?.data?.message || '인증번호 발송에 실패했습니다.',
      }));
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (timer === 0) {
      setErrors((prev) => ({
        ...prev,
        verification: '인증 시간이 만료되었습니다.',
      }));
      return;
    }

    if (!verificationCode.trim()) {
      setErrors((prev) => ({
        ...prev,
        verification: '인증번호를 입력해주세요.',
      }));
      return;
    }

    try {
      const phone = formData.phone.trim().replace(/-/g, '');

      const res = await postVerifyCode(phone, verificationCode);

      if (res.isSuccess) {
        setIsVerified(true);

        setErrors((prev) => ({
          ...prev,
          verification: '',
        }));

        alert('전화번호 인증이 완료되었습니다.');
      } else {
        setErrors((prev) => ({
          ...prev,
          verification: res.message || '인증번호가 일치하지 않습니다.',
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        verification:
          error.response?.data?.message || '인증번호가 일치하지 않습니다.',
      }));
    }
  };

  // 전체 입력 검증
  const validateForm = () => {
    const newErrors = {};

    const phone = formData.phone.trim().replace(/-/g, '');

    if (!phone) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^01\d{8,9}$/.test(phone)) {
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

  // 비회원 등록 → 자동 로그인 → 이용권 선택
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const phoneNumber = formData.phone.trim().replace(/-/g, '');

    try {
      setIsSubmitting(true);

      // 1. 비회원 계정 생성
      const signupResult = await guestSignUp({
        phoneNumber,
        password: formData.password,
      });

      if (!signupResult.success) {
        setErrors((prev) => ({
          ...prev,
          general: signupResult.errorMessage || '비회원 등록에 실패했습니다.',
        }));
        return;
      }

      // 2. 생성된 비회원 계정으로 자동 로그인
      const loginResult = await login(phoneNumber, formData.password);

      if (!loginResult.success) {
        setErrors((prev) => ({
          ...prev,
          general:
            loginResult.message ||
            '비회원 등록은 완료되었지만 로그인에 실패했습니다.',
        }));
        return;
      }

      // 3. 이용권 선택 페이지로 이동
      navigate('/ticket', {
        replace: true,
      });
    } catch (error) {
      console.error('비회원 등록 처리 오류:', error.response?.data ?? error);

      setErrors((prev) => ({
        ...prev,
        general:
          error.response?.data?.message ||
          '비회원 등록 처리 중 오류가 발생했습니다.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="nonmember_signup_page">
      <h2 className="signup_title">사용자 정보 입력</h2>

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
        <div className="signup_tab_group">
          <button type="button" className="signup_tab">
            비회원입실
          </button>
        </div>

        <form className="signup_form" onSubmit={handleSubmit}>
          {/* 전화번호 */}
          <div className="form_group">
            <label className="form_label" htmlFor="phone">
              전화번호
            </label>

            <div className="input_wrapper">
              <input
                id="phone"
                name="phone"
                type="tel"
                className={`form_input ${
                  errors.phone ? 'input_error' : ''
                } ${!isVerified ? 'with_btn' : ''}`}
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

          {/* 인증번호 */}
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
                  className={`form_input ${
                    errors.verification ? 'input_error' : ''
                  } with_btn`}
                  placeholder="인증번호 6자리 입력"
                  disabled={isVerified}
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                />

                {!isVerified ? (
                  <div className="verify_action_container">
                    <span className="verify_timer">{formatTime(timer)}</span>

                    <button
                      type="button"
                      className="btn_inner_verify static_btn"
                      onClick={handleVerifyCode}
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
              placeholder="숫자 6자리 입력"
              maxLength={6}
              inputMode="numeric"
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
              className={`form_input ${
                errors.confirmPassword ? 'input_error' : ''
              }`}
              placeholder="비밀번호 재입력"
              maxLength={6}
              inputMode="numeric"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {errors.confirmPassword && (
              <span className="error_text">{errors.confirmPassword}</span>
            )}
          </div>

          {errors.general && <p className="error_text">{errors.general}</p>}

          <button
            type="submit"
            className="submit_button"
            disabled={isSubmitting}
          >
            {isSubmitting ? '처리 중...' : '입력 완료'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default NonmemberSignup;
