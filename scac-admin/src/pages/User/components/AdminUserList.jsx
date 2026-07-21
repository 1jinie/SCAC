import React from 'react';
import { USER_ROLE_LABELS, USER_STATUS_LABELS } from '../../../constants/user';

export default function AdminUserList({
  users = [],
  selectedUser,
  onUserSelect,
}) {
  const formatDate = (dateValue) => {
    if (!dateValue) {
      return '-';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  const getMemberLabel = (isMember) => {
    return isMember ? '정식 회원' : '비회원';
  };

  const getStatusClassName = (userStatus) => {
    return userStatus ? `status_${userStatus.toLowerCase()}` : '';
  };

  const handleRowKeyDown = (event, user) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onUserSelect(user);
    }
  };

  return (
    <section className="admin_panel admin_user_list_panel">
      <header className="admin_user_list_header">
        <div>
          <h3 className="admin_user_list_title">사용자 목록</h3>

          <p className="admin_user_list_description">
            사용자를 선택하면 상세 정보를 확인하고 상태를 변경할 수 있습니다.
          </p>
        </div>

        <span className="admin_user_result_count">총 {users.length}명</span>
      </header>

      <div className="admin_user_table_wrap">
        <table className="admin_user_table">
          <thead>
            <tr>
              <th scope="col">번호</th>
              <th scope="col">전화번호</th>
              <th scope="col">회원 구분</th>
              <th scope="col">권한</th>
              <th scope="col">이용 상태</th>
              <th scope="col">정지 종료일</th>
              <th scope="col">가입일</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td className="admin_user_empty" colSpan={7}>
                  <strong>조회된 사용자가 없습니다.</strong>
                  <span>검색어 또는 필터 조건을 다시 확인해 주세요.</span>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isSelected = selectedUser?.userId === user.userId;

                return (
                  <tr
                    key={user.userId}
                    className={isSelected ? 'is_selected' : ''}
                    tabIndex={0}
                    aria-selected={isSelected}
                    onClick={() => onUserSelect(user)}
                    onKeyDown={(event) => handleRowKeyDown(event, user)}
                  >
                    <td className="admin_user_id">#{user.userId}</td>

                    <td className="admin_user_phone">{user.phoneNumber}</td>

                    <td>
                      <span
                        className={`admin_user_member_badge ${
                          user.isMember ? 'is_member' : 'is_guest'
                        }`}
                      >
                        {getMemberLabel(user.isMember)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin_user_role role_${user.role?.toLowerCase()}`}
                      >
                        {USER_ROLE_LABELS[user.role] ?? user.role ?? '-'}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin_user_status ${getStatusClassName(
                          user.userStatus,
                        )}`}
                      >
                        {USER_STATUS_LABELS[user.userStatus] ??
                          user.userStatus ??
                          '-'}
                      </span>
                    </td>

                    <td>
                      {user.userStatus === 'SUSPENDED'
                        ? formatDate(user.penaltyEndDate)
                        : '-'}
                    </td>

                    <td>{formatDate(user.createdAt)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
