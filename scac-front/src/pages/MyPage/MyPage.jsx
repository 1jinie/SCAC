import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import '../../styles/Mypage.css';

function MyPage() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const userId = user?.userId || user?.id;
  const logout = useAuthStore((state) => state.logout);

  const {
    userProfile,
    getUserProfile,
    modifyUserPassword,
    clearUserData,
    isLoading,
    errorMessage,
  } = useUserStore();

  /* 상태 관리 (비밀변호 변경용) */
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [localError, setLocalError] = useState('');

  /* 내 정보 및 이용권 정보 조회 */
  useEffect(() => {
    if (userId) {
      getUserProfile(userId);
    }
  }, [userId, getUserProfile, navigate]);

  /* 로그아웃 핸들러 */
  const handleLogoutClick = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      clearUserData();
      await logout();
      alert('안전하게 로그아웃되었습니다.');
      navigate('/');
    }
  };

  /* 입실 비밀번호 변경 핸들러 */
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    // 필수 입력 검증
    if (!currentPassword || !newPassword || !passwordConfirm) {
      setLocalError('모든 항목을 입력해 주세요.');
      return;
    }

    // 새 비밀번호 확인 일치 검증
    if (newPassword !== passwordConfirm) {
      setLocalError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 규칙 검증 (숫자 6자리)
    if (!/^\d{6}$/.test(newPassword)) {
      setLocalError('비밀번호는 숫자 6자리로 입력해 주세요.');
      return;
    }

    if (!userId) {
      setLocalError('사용자 정보가 유효하지 않습니다. 다시 로그인해 주세요.');
      return;
    }

    // 서버로 수정 요청 보낼 데이터 객체
    const result = await modifyUserPassword({
      currentPassword,
      newPassword,
    });

    if (result.success) {
      alert(
        '비밀번호가 변경되어 안전하게 로그아웃됩니다. 다시 로그인해 주세요.',
      );
      clearUserData();
      await logout();
      navigate('/login');
    }
  };

  if (isLoading && !userProfile) {
    return <div className="loading_box">정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="mypage_container">
      {/* 상단 헤더 */}
      <header className="mypage_header">
        <button
          type="button"
          className="btn_home"
          onClick={() => navigate('/loginhome')}
        >
          <img
            src="/icons/common/home.svg"
            alt="홈"
            style={{ width: '60px', height: '70px' }}
          />
        </button>
      </header>

      {/* 페이지 제목 */}
      <h2 className="mypage_title">마이페이지</h2>

      {/* 에러 및 성공 메시지 */}
      {(errorMessage || localError) && (
        <p className="error_text">{localError || errorMessage}</p>
      )}
      {successMessage && <p className="success_text">{successMessage}</p>}

      {/* 회원 정보 조회 */}
      {userProfile && (
        <div className="profile_info_section">
          <div className="profile_section">
            <h3 className="profile_title">회원 정보</h3>
            <div className="profile_icon_circle">👤</div>
            <p className="user_phone_number">{userProfile.phoneNumber}</p>
          </div>

          <div className="info_group">
            <span className="info_lable">전화번호(ID)</span>
            <span className="info_value">{userProfile.phoneNumber}</span>
          </div>
          <div className="info_group">
            <span className="info_lable">현재 보유 이용권</span>
            <span className="info_value">
              {userProfile.currentTicketName || '보유하신 이용권이 없습니다.'}
            </span>
          </div>
        </div>
      )}

      <hr className="divider" />

      {/* 입실 비밀번호 변경 */}
      <div className="password_change_section">
        <h3 className="section_title">입실 비밀번호 변경</h3>

        <form id="password_change_form" onSubmit={handlePasswordChangeSubmit}>
          <div className="input_group">
            <label htmlFor="curr_password">현재 비밀번호</label>
            <input
              id="curr_password"
              className="input_field"
              type="password"
              placeholder="현재 숫자 6자리"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="input_group">
            <label htmlFor="new_password">새 비밀번호</label>
            <input
              id="new_password"
              className="input_field"
              type="password"
              placeholder="새 숫자 6자리"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="input_group">
            <label htmlFor="confirm_password">새 비밀번호 확인</label>
            <input
              id="confirm_password"
              className="input_field"
              type="password"
              placeholder="새 비밀번호 한 번 더 입력"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          <button type="submit" className="btn_submit" disabled={isLoading}>
            {isLoading ? '변경 중...' : '비밀번호 변경하기'}
          </button>
        </form>
      </div>

      <hr className="divider" />

      {/* 이용권 구매 버튼 */}
      <div className="no_ticket">
        <button
          type="button"
          className="btn_buy_ticket"
          onClick={() => navigate('/ticket')}
        >
          이용권 구매하러 가기
        </button>
      </div>

      {/* 하단 제어 버튼 */}
      <div className="mypage_footer">
        <button
          type="button"
          className="btn_back_main"
          onClick={() => navigate('/loginhome')}
        >
          메인으로 돌아가기
        </button>

        <button
          type="button"
          className="btn_logout"
          onClick={handleLogoutClick}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default MyPage;
