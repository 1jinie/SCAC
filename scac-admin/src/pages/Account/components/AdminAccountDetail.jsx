import { useEffect, useState } from 'react';
import { formatfullDateTime } from '../../../utils/date';
import { ADMIN_ROLE_LABELS } from '../../../constants/admin';

const INITIAL_FORM = {
  loginId: '',
  name: '',
  password: '',
  passwordConfirm: '',
};

export default function AdminAccountDetail({
  selectedAccount,

  formMode,
  onEdit,
  onCancelForm,
  onSubmitForm,
  isSavingAccount,

  onDelete,
  isDeletingAccount,
}) {
  const [form, setForm] = useState(INITIAL_FORM);

  const isCreateMode = formMode === 'create';
  const isEditMode = formMode === 'edit';
  const isFormMode = isCreateMode || isEditMode;

  const isSuperAdmin = selectedAccount?.role === 'SUPER_ADMIN';

  useEffect(() => {
    if (isEditMode && selectedAccount) {
      setForm({
        loginId: selectedAccount.loginId ?? '',
        name: selectedAccount.name ?? '',
        password: '',
        passwordConfirm: '',
      });

      return;
    }

    if (isCreateMode) {
      setForm(INITIAL_FORM);
    }
  }, [isCreateMode, isEditMode, selectedAccount]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.loginId.trim()) {
      window.alert('관리자 ID를 입력해 주세요.');
      return;
    }

    if (!form.name.trim()) {
      window.alert('관리자 이름을 입력해 주세요.');
      return;
    }

    // 신규 등록일 때는 비밀번호 필수
    if (isCreateMode && !form.password) {
      window.alert('비밀번호를 입력해 주세요.');
      return;
    }

    if (form.password && form.password !== form.passwordConfirm) {
      window.alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    onSubmitForm({
      loginId: form.loginId.trim(),
      name: form.name.trim(),
      password: form.password,
      role: 'STAFF',
    });
  };

  // 조회 모드인데 선택 계정이 없는 경우
  if (!selectedAccount && !isCreateMode) {
    return (
      <aside className="admin_panel admin_account_detail">
        <div className="admin_account_detail_empty">
          확인할 관리자 계정을 선택해 주세요.
        </div>
      </aside>
    );
  }

  return (
    <aside className="admin_panel admin_account_detail">
      <div className="admin_panel_header">
        <div>
          <p className="admin_section_eyebrow">ADMIN ACCOUNT</p>

          <h3>{isCreateMode ? '새 관리자 등록' : selectedAccount.name}</h3>

          <p className="admin_account_detail_description">
            {isCreateMode
              ? '새로운 관리자 계정을 등록합니다.'
              : isEditMode
                ? '수정할 관리자 정보를 입력해 주세요.'
                : '선택한 관리자 계정의 상세 정보입니다.'}
          </p>
        </div>

        {!isCreateMode && (
          <span
            className={`admin_account_role is_${selectedAccount.role.toLowerCase()}`}
          >
            {ADMIN_ROLE_LABELS[selectedAccount.role]}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <dl className="admin_account_info_list">
          {/* 관리자 ID */}
          {!isCreateMode && (
            <div>
              <dt>관리자 번호</dt>
              <dd>{selectedAccount.adminId}</dd>
            </div>
          )}

          <div>
            <dt>로그인 ID</dt>

            <dd>
              {isCreateMode ? (
                <input
                  type="text"
                  name="loginId"
                  value={form.loginId}
                  onChange={handleChange}
                  placeholder="관리자 ID를 입력해 주세요."
                  maxLength={50}
                />
              ) : (
                selectedAccount.loginId
              )}
            </dd>
          </div>

          {/* 관리자 이름 */}
          <div>
            <dt>이름</dt>

            <dd>
              {isFormMode ? (
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="관리자 이름을 입력해 주세요."
                  maxLength={50}
                />
              ) : (
                selectedAccount.name
              )}
            </dd>
          </div>

          {/* 권한 */}
          {!isCreateMode && (
            <div>
              <dt>권한</dt>
              <dd>{ADMIN_ROLE_LABELS[selectedAccount.role]}</dd>
            </div>
          )}

          {/* 비밀번호 */}
          {isFormMode && (
            <>
              <div>
                <dt>비밀번호</dt>

                <dd>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={
                      isCreateMode
                        ? '비밀번호를 입력해 주세요.'
                        : '변경할 경우에만 입력해 주세요.'
                    }
                    autoComplete="new-password"
                  />
                </dd>
              </div>

              <div>
                <dt>비밀번호 확인</dt>

                <dd>
                  <input
                    type="password"
                    name="passwordConfirm"
                    value={form.passwordConfirm}
                    onChange={handleChange}
                    placeholder="비밀번호를 다시 입력해 주세요."
                    autoComplete="new-password"
                  />
                </dd>
              </div>
            </>
          )}

          {/* 마지막 로그인 */}
          {!isCreateMode && !isEditMode && (
            <div>
              <dt>마지막 로그인</dt>
              <dd>
                {selectedAccount.lastLoginAt
                  ? formatfullDateTime(selectedAccount.lastLoginAt)
                  : '-'}
              </dd>
            </div>
          )}
        </dl>

        {isFormMode ? (
          <div className="admin_account_form_actions">
            <button
              type="button"
              className="admin_account_form_cancel_button"
              onClick={onCancelForm}
              disabled={isSavingAccount}
            >
              취소
            </button>

            <button
              type="submit"
              className="admin_account_form_submit_button"
              disabled={isSavingAccount}
            >
              {isSavingAccount
                ? '처리 중...'
                : isCreateMode
                  ? '관리자 등록'
                  : '수정 완료'}
            </button>
          </div>
        ) : (
          <>
            {!isSuperAdmin && (
              <>
                <button
                  type="button"
                  className="admin_account_edit_button"
                  onClick={onEdit}
                >
                  정보 수정
                </button>

                <button
                  type="button"
                  className="admin_account_delete_button"
                  onClick={onDelete}
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? '삭제 중...' : '관리자 계정 삭제'}
                </button>
              </>
            )}

            {isSuperAdmin && (
              <p className="admin_account_protected_message">
                SUPER ADMIN 계정은 수정하거나 삭제할 수 없습니다.
              </p>
            )}
          </>
        )}
      </form>
    </aside>
  );
}
