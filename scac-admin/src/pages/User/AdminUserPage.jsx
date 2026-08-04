import { useEffect, useMemo, useState } from "react";
import AdminSummary from "../../components/common/Summary";
import { useAdminUserStore } from "../../store/adminUserStore";
import AdminUserDetail from "./components/AdminUserDetail";
import AdminUserList from "./components/AdminUserList";
import AdminUserSearch from "./components/AdminUserSearch";
import "./css/AdminUserPage.css";

export default function AdminUserPage() {
  // 💡 adminUserStore 정의에 존재하는 메서드만 정확히 추출
  const {
    users,
    selectedUser,
    isLoading,
    isUpdating,
    errorMessage,
    fetchUsers,
    selectUser,
    changeUserStatus,
    clearSelectedUser,
  } = useAdminUserStore();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const userSummary = useMemo(() => {
    return users.reduce(
      (summary, user) => {
        if (user.isMember) {
          summary.memberCount += 1;
        }

        if (user.userStatus === "SUSPENDED") {
          summary.suspendedCount += 1;
        }

        if (user.role === "ADMIN") {
          summary.adminCount += 1;
        }

        return summary;
      },
      {
        memberCount: 0,
        suspendedCount: 0,
        adminCount: 0,
      },
    );
  }, [users]);

  const filteredUsers = useMemo(() => {
    const normalizedKeyword = searchKeyword
      .replaceAll("-", "")
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const phoneNumber = user.phoneNumber?.replaceAll("-", "").toLowerCase();
      const userId = String(user.userId);

      const matchesKeyword =
        normalizedKeyword === "" ||
        phoneNumber?.includes(normalizedKeyword) ||
        userId.includes(normalizedKeyword);

      const matchesStatus =
        statusFilter === "ALL" || user.userStatus === statusFilter;

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      return matchesKeyword && matchesStatus && matchesRole;
    });
  }, [users, searchKeyword, statusFilter, roleFilter]);

  const summaryItems = useMemo(
    () => [
      {
        key: "total",
        label: "전체 사용자",
        value: users.length,
        unit: "명",
        description: "회원 및 비회원 포함",
        color: "blue",
      },
      {
        key: "member",
        label: "가입 회원",
        value: userSummary.memberCount,
        unit: "명",
        description: "회원가입 완료 사용자",
        color: "mint",
      },
      {
        key: "suspended",
        label: "이용 정지",
        value: userSummary.suspendedCount,
        unit: "명",
        description: "현재 이용 제한 사용자",
        color: "orange",
      },
      {
        key: "admin",
        label: "관리자",
        value: userSummary.adminCount,
        unit: "명",
        description: "관리자 권한 보유자",
        color: "dark",
      },
    ],
    [users.length, userSummary],
  );

  const handleResetSearch = () => {
    setSearchKeyword("");
    setStatusFilter("ALL");
    setRoleFilter("ALL");
    clearSelectedUser();
  };

  // 💡 백엔드 PATCH /api/admin/users/{userId}/penalty 호출 연동
  const handleStatusChange = async (userId, userStatus, penaltyEndDate) => {
    const result = await changeUserStatus(
      userId,
      userStatus,
      penaltyEndDate,
      "관리자 제재 처리",
    );

    if (result.success) {
      window.alert("회원 상태가 변경되었습니다.");
    } else {
      window.alert("회원 상태 변경에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <main className="admin_user_page">
        <p className="admin_loading_message">회원 정보를 불러오는 중입니다.</p>
      </main>
    );
  }

  return (
    <main className="admin_user_page">
      <header className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">USER MANAGEMENT</p>
          <h2>회원 관리</h2>
          <p>SCAC 회원을 조회하고 관리합니다.</p>
        </div>
      </header>

      {errorMessage && <p className="admin_error_message">{errorMessage}</p>}

      <AdminSummary items={summaryItems} />

      <AdminUserSearch
        searchKeyword={searchKeyword}
        statusFilter={statusFilter}
        roleFilter={roleFilter}
        onSearchKeywordChange={setSearchKeyword}
        onStatusFilterChange={setStatusFilter}
        onRoleFilterChange={setRoleFilter}
        onReset={handleResetSearch}
      />

      <section className="admin_user_content">
        <AdminUserList
          users={filteredUsers}
          selectedUser={selectedUser}
          onUserSelect={selectUser}
        />

        <AdminUserDetail
          selectedUser={selectedUser}
          isUpdating={isUpdating}
          onStatusChange={handleStatusChange}
        />
      </section>
    </main>
  );
}
