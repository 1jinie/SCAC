import { useState } from 'react';
import { adminApi } from '../../api/adminApi';
import './css/AdminAccountPage.css';

const INITIAL_FORM = {
  loginId: '',
  name: '',
  password: '',
  passwordConfirm: '',
};

export default function AdminAccountPage() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage('');
  };

  const validateForm = () => {
    if (!formData.loginId.trim()) {
      return '관리자 ID를 입력해 주세요.';
    }

    if (!formData.name.trim()) {
      return '관리자 이름을 입력해 주세요.';
    }

    if (!formData.password) {
      return '비밀번호를 입력해 주세요.';
    }

    if (!formData.passwordConfirm) {
      return '비밀번호 확인을 입력해 주세요.';
    }

    if (formData.password !== formData.passwordConfirm) {
      return '비밀번호가 일치하지 않습니다.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const requestData = {
        loginId: formData.loginId.trim(),
        name: formData.name.trim(),
        password: formData.password,
        role: formData.role,
      };

      const response = await adminApi.createAdminAccount(requestData);

      window.alert(response.message ?? '관리자 계정이 생성되었습니다.');

      setFormData(INITIAL_FORM);
    } catch (error) {
      console.error('관리자 계정 생성 실패:', error.response?.data ?? error);

      setErrorMessage(
        error.response?.data?.message ??
          '관리자 계정 생성 중 오류가 발생했습니다.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin_account_page">
      <div className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">ADMIN ACCOUNT</p>

          <h2>관리자 계정 등록</h2>

          <p>SCAC 관리자 페이지를 이용할 관리자 계정을 등록합니다.</p>
        </div>
      </div>

      <section className="admin_panel admin_account_panel">
        <div className="admin_panel_header">
          <div>
            <h3>계정 정보</h3>
            <p>새로운 관리자 정보를 입력해 주세요.</p>
          </div>
        </div>

        <form className="admin_account_form" onSubmit={handleSubmit}>
          <div className="admin_account_field">
            <label htmlFor="admin_login_id">관리자 ID</label>

            <input
              id="admin_login_id"
              name="loginId"
              type="text"
              value={formData.loginId}
              onChange={handleChange}
              placeholder="관리자 ID를 입력해 주세요"
              autoComplete="username"
            />
          </div>

          <div className="admin_account_field">
            <label htmlFor="admin_name">관리자 이름</label>

            <input
              id="admin_name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="관리자 이름을 입력해 주세요"
            />
          </div>

          <div className="admin_account_field">
            <label htmlFor="admin_password">비밀번호</label>

            <input
              id="admin_password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해 주세요"
              autoComplete="new-password"
            />
          </div>

          <div className="admin_account_field">
            <label htmlFor="admin_password_confirm">비밀번호 확인</label>

            <input
              id="admin_password_confirm"
              name="passwordConfirm"
              type="password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해 주세요"
              autoComplete="new-password"
            />
          </div>

          {errorMessage && (
            <p className="admin_account_error" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="admin_account_actions">
            <button
              type="button"
              className="admin_account_reset_button"
              onClick={() => {
                setFormData(INITIAL_FORM);
                setErrorMessage('');
              }}
              disabled={isSubmitting}
            >
              초기화
            </button>

            <button
              type="submit"
              className="admin_account_submit_button"
              disabled={isSubmitting}
            >
              {isSubmitting ? '등록 중...' : '관리자 등록'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
