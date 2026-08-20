import LoadingOverlay from '../../../components/common/LoadingOverlay';
import { ADMIN_ROLE_LABELS } from '../../../constants/admin';
import { formatfullDateTime } from '../../../utils/date';

export default function AdminAccountList({
  accounts,
  selectedAccount,
  onAccountSelect,
  isAccountLoading,
  errorMessage,
  onCreateAccount,
  isCreateMode,
}) {
  return (
    <div className="admin_panel">
      <div className="admin_panel_header">
        <div>
          <h3>관리자 목록</h3>
          <p>관리자를 선택하면 상세 정보를 확인할 수 있습니다.</p>
        </div>

        <button
          type="button"
          className={`admin_account_create_button ${
            isCreateMode ? 'is_active' : ''
          }`}
          onClick={onCreateAccount}
        >
          관리자 추가
        </button>
      </div>

      <div className="admin_account_manage_list">
        <LoadingOverlay
          isLoading={isAccountLoading}
          message="관리자 계정을 불러오는 중입니다."
        />

        {errorMessage && !isAccountLoading && (
          <div className="admin_account_error">{errorMessage}</div>
        )}

        {!errorMessage && accounts.length === 0 && !isAccountLoading && (
          <div className="admin_account_empty">
            등록된 관리자 계정이 없습니다.
          </div>
        )}

        {accounts.map((account) => (
          <button
            key={account.adminId}
            type="button"
            className={`admin_account_manage_item ${
              selectedAccount?.adminId === account.adminId ? 'is_selected' : ''
            }`}
            onClick={() => onAccountSelect(account)}
          >
            <div className="admin_account_manage_info">
              <strong>{account.name}</strong>

              <span>{account.loginId}</span>

              <small>
                마지막 로그인:{' '}
                {account.lastLoginAt
                  ? formatfullDateTime(account.lastLoginAt)
                  : '-'}
              </small>
            </div>

            <span
              className={`admin_account_role is_${account.role.toLowerCase()}`}
            >
              {ADMIN_ROLE_LABELS[account.role] ?? account.role}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
