import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import AdminAccountDetail from './components/AdminAccountDetail';
import AdminAccountList from './components/AdminAccountList';
import './css/AdminAccountPage.css';

export default function AdminAccountPage() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // null,create,edit
  const [accountFormMode, setAccountFormMode] = useState(null);

  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // 관리자 계정 목록 조회
  const fetchAdminAccounts = useCallback(async () => {
    try {
      setIsAccountLoading(true);
      setErrorMessage('');

      const data = await adminApi.getAdminAccounts();

      setAccounts(data);
    } catch (error) {
      console.error(
        '관리자 계정 목록 조회 실패:',
        error.response?.data?.message ?? error,
      );

      setErrorMessage(
        error.response?.data?.message ??
          '관리자 계정 목록을 불러오지 못했습니다.',
      );
    } finally {
      setIsAccountLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminAccounts();
  }, [fetchAdminAccounts]);

  // 계정 선택
  const handleAccountSelect = async (account) => {
    setAccountFormMode(null);

    try {
      const detail = await adminApi.getAdminAccount(account.adminId);

      setSelectedAccount(detail);
    } catch (error) {
      console.error(
        '관리자 계정 상세 조회 실패:',
        error.response?.data?.message ?? error,
      );

      window.alert(
        error.response?.data?.message ??
          '관리자 계정 정보를 불러오지 못했습니다.',
      );
    }
  };

  // 계정 추가
  const handleCreateAccount = () => {
    setSelectedAccount(null);
    setAccountFormMode('create');
  };

  // 수정 모드
  const handleEditAccount = () => {
    if (!selectedAccount) {
      return;
    }
    setAccountFormMode('edit');
  };

  // 등록/수정 취소
  const handleCloseAccountForm = () => {
    if (isSavingAccount) {
      return;
    }

    setAccountFormMode(null);
  };

  // 등록/수정
  const handleAccountFormSubmit = async (form) => {
    if (isSavingAccount) {
      return;
    }

    try {
      setIsSavingAccount(true);

      // 신규 등록
      if (accountFormMode === 'create') {
        const response = await adminApi.createAdminAccount(form);

        await fetchAdminAccounts();

        if (response.data) {
          setSelectedAccount(response.data);
        }

        window.alert(response.message ?? '관리자 계정이 생성되었습니다.');
      }

      // 비밀번호 수정
      if (accountFormMode === 'edit') {
        await adminApi.updateAdminAccount(selectedAccount.adminId, form);

        const updatedAccount = await adminApi.getAdminAccount(
          selectedAccount.adminId,
        );

        setSelectedAccount(updatedAccount);

        await fetchAdminAccounts();

        window.alert('관리자 계정 정보 변경이 완료되었습니다.');
      }

      setAccountFormMode(null);
    } catch (error) {
      console.error(
        '관리자 계정 저장 실패:',
        error.response?.data?.message ?? error,
      );

      window.alert(
        error.response?.data?.message ??
          '관리자 계정 처리 중 오류가 발생했습니다.',
      );
    } finally {
      setIsSavingAccount(false);
    }
  };

  // 계정 삭제
  const handleDeleteAccount = async () => {
    if (!selectedAccount || isDeletingAccount) {
      return;
    }

    if (selectedAccount.role === 'SUPER_ADMIN') {
      window.alert('SUPER ADMIN 계정은 삭제할 수 없습니다.');
      return;
    }

    const confirmed = window.confirm(
      `"${selectedAccount.name}" 관리자 계정을 삭제하시겠습니까?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeletingAccount(true);

      await adminApi.deleteAdminAccount(selectedAccount.adminId);

      setSelectedAccount(null);

      await fetchAdminAccounts();

      window.alert('관리자 계정이 삭제되었습니다.');
    } catch (error) {
      console.error(
        '관리자 계정 삭제 실패:',
        error.response?.data?.message ?? error,
      );

      window.alert(
        error.response?.data?.message ??
          '관리자 계정 삭제 중 오류가 발생했습니다.',
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="admin_account_page">
      <div className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">ADMIN ACCOUNT</p>

          <h2>관리자 계정 관리</h2>

          <p>관리자 계정을 조회하고 새로운 STAFF 계정을 관리합니다.</p>
        </div>
      </div>

      <section className="admin_account_workspace">
        <div className="admin_account_left_column">
          <AdminAccountList
            accounts={accounts}
            selectedAccount={selectedAccount}
            onAccountSelect={handleAccountSelect}
            isAccountLoading={isAccountLoading}
            errorMessage={errorMessage}
            onCreateAccount={handleCreateAccount}
            isCreateMode={accountFormMode === 'create'}
          />
        </div>

        <AdminAccountDetail
          selectedAccount={selectedAccount}
          formMode={accountFormMode}
          onEdit={handleEditAccount}
          onCancelForm={handleCloseAccountForm}
          onSubmitForm={handleAccountFormSubmit}
          isSavingAccount={isSavingAccount}
          onDelete={handleDeleteAccount}
          isDeletingAccount={isDeletingAccount}
        />
      </section>
    </div>
  );
}
