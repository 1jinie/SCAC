import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/NonSignup.css';

function NonmemberSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    visitDate: '',
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

  // 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};

    // 공백 검사
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '휴대폰 번호를 입력해주세요.';
    } else if (!/^01\d{8,9}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '휴대폰 번호 형식이 올바르지 않습니다.';
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
    if (!validateForm()) {
      return;
    }

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
        <span className="header_time">10:14</span>
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
              휴대폰 번호
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={`form_input ${errors.phone ? 'input_error' : ''}`}
              placeholder="01012345678"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error_text">{errors.phone}</span>}
          </div>

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
              placeholder="비밀번호를 다시 입력하세요"
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
