import React from 'react';

export default function AdminUserSearch({
  searchKeyword,
  statusFilter,
  roleFilter,
  onSearchKeywordChange,
  onStatusFilterChange,
  onRoleFilterChange,
  onReset,
}) {
  return (
    <section className="admin_user_search">
      <div className="admin_user_search_group">
        <label htmlFor="user_search_keyword">사용자 검색</label>

        <input
          id="user_search_keyword"
          type="search"
          value={searchKeyword}
          onChange={(event) => onSearchKeywordChange(event.target.value)}
          placeholder="전화번호 또는 사용자 번호를 입력하세요."
        />
      </div>

      <div className="admin_user_search_group">
        <label htmlFor="user_status_filter">이용 상태</label>

        <select
          id="user_status_filter"
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
        >
          <option value="ALL">전체</option>
          <option value="ACTIVE">정상</option>
          <option value="SUSPENDED">이용 정지</option>
          <option value="BANNED">영구 정지</option>
        </select>
      </div>

      <div className="admin_user_search_group">
        <label htmlFor="user_role_filter">권한</label>

        <select
          id="user_role_filter"
          value={roleFilter}
          onChange={(event) => onRoleFilterChange(event.target.value)}
        >
          <option value="ALL">전체</option>
          <option value="GUEST">비회원</option>
          <option value="USER">회원</option>
          <option value="ADMIN">관리자</option>
        </select>
      </div>

      <button
        type="button"
        className="admin_user_search_reset_button"
        onClick={onReset}
      >
        초기화
      </button>
    </section>
  );
}
