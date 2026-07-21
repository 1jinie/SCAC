import React, { useEffect, useState } from 'react';

export default function AdminUserDetail({
  selectedUser,
  isUpdating,
  onStatusChange,
  onRoleChange,
}) {
  const [selectedStatus, setSelectedStatus] = useState('ACTIVE');
  const [penaltyEndDate, setPenaltyEndDate] = useState('');

  useEffect(() => {
    if (!selectedUser) return;

    setSelectedStatus(selectedUser.userStatus);
    setPenaltyEndDate(selectedUser.penaltyEndDate ?? '');
  }, [selectedUser]);

  if (!selectedUser) {
    return (
      <aside className="admin_user_detail is_empty">
        <p>사용자를 선택해 주세요.</p>
      </aside>
    );
  }

  const handleStatusSubmit = () => {
    if (selectedStatus === 'SUSPENDED' && !penaltyEndDate) {
      window.alert('정지 종료일을 선택해 주세요.');
      return;
    }

    onStatusChange(
      selectedUser.userId,
      selectedStatus,
      selectedStatus === 'SUSPENDED' ? penaltyEndDate : null,
    );
  };

  const handleRoleChange = (event) => {
    onRoleChange(selectedUser.userId, event.target.value);
  };

  return (
    <aside className="admin_user_detail">
      <h3>회원 상세</h3>

      <dl className="admin_user_info_list">
        <div>
          <dt>사용자 번호</dt>
          <dd>{selectedUser.userId}</dd>
        </div>

        <div>
          <dt>전화번호</dt>
          <dd>{selectedUser.phoneNumber}</dd>
        </div>

        <div>
          <dt>현재 상태</dt>
          <dd>{selectedUser.userStatus}</dd>
        </div>
      </dl>

      <div className="admin_user_management">
        <label htmlFor="user_status">이용 상태</label>

        <select
          id="user_status"
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
          disabled={isUpdating}
        >
          <option value="ACTIVE">정상</option>
          <option value="SUSPENDED">이용 정지</option>
          <option value="BANNED">영구 정지</option>
        </select>

        {selectedStatus === 'SUSPENDED' && (
          <>
            <label htmlFor="penalty_end_date">정지 종료일</label>

            <input
              id="penalty_end_date"
              type="date"
              value={penaltyEndDate}
              onChange={(event) => setPenaltyEndDate(event.target.value)}
              disabled={isUpdating}
            />
          </>
        )}

        <button
          type="button"
          className="admin_user_status_button"
          onClick={handleStatusSubmit}
          disabled={isUpdating}
        >
          {isUpdating ? '변경 중...' : '상태 변경'}
        </button>
      </div>

      <div className="admin_user_management">
        <label htmlFor="user_role">권한</label>

        <select
          id="user_role"
          value={selectedUser.role}
          onChange={handleRoleChange}
          disabled={isUpdating}
        >
          <option value="GUEST">비회원</option>
          <option value="USER">회원</option>
          <option value="ADMIN">관리자</option>
        </select>
      </div>
    </aside>
  );
}
