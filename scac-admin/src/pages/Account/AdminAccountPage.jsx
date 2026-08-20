import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import './css/AdminAccountPage.css';
import { useAuthStore } from '../../store/authStore';
import AdminAccountList from './components/AdminAccountList';
import AdminAccountDetail from './components/AdminAccountDetail';

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
  const [accounts, setAccounts] = useState([]);
  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [mode, setMode] = useState('VIEW');
  // VIEW | CREATE | EDIT

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const user = useAuthStore((state) => state.user);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // 어드민 계정 목록 조회
  const fetchAdminAccounts = useCallback(async () => {
    try {
      setIsAccountLoading(true);

      const data = await adminApi.getAdminAccounts();

      setAccounts(data);
    } catch (error) {
      console.error(
        '관리자 계정 목록 조회 실패:',
        error.response?.data ?? error,
      );

      setErrorMessage(
        error.response?.data?.message ??
          '관리자 계정 목록을 불러오지 못했습니다.',
      );
    } finally {
      setIsAccountLoading(false);
    }
  }, []);

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

  // 계정 생성
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
      await fetchAdminAccounts();
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

  // 추가모드 버튼
  const handleCreate = () => {
    setSelectedAccount(null);
    setMode('CREATE');
  };
  // 계정 상세확인
  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    setMode('VIEW');
  };

  //수정모드
  const handleEdit = () => {
    setMode('EDIT');
  };

  //취소버튼
  const handleCancel = () => {
    setMode('VIEW');
  };

  useEffect(() => {
    fetchAdminAccounts();
  }, [fetchAdminAccounts]);

  return (
    <div className="admin_account_page">
      <div className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">ADMIN ACCOUNT</p>

          <h2>관리자 계정 관리</h2>

          <p>SCAC 관리자 페이지를 이용할 관리자 계정을 관리합니다.</p>
        </div>
      </div>
      <section className="admin_device_workspace">
        <div className="admin_device_left_column">
          <AdminAccountList
            accounts={accounts}
            selectedAccount={selectedAccount}
            onAccountSelect={handleSelectAccount}
            isAccountLoading={isAccountLoading}
            errorMessage={errorMessage}
            isCreateMode={mode === 'create'}
          />
        </div>
        <AdminAccountDetail
          // 계정 상세정보
          selectedAccount={selectedAccount}
          onStatusChange={handleChange}
          // 계정 추가, 수정 삭제
          formMode={mode}
          isSuperAdmin={isSuperAdmin}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          // onDelete={handleDelete}
          // isDeletingDevice={isDeletingDevice}
        />
      </section>

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
