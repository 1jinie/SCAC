import { create } from 'zustand';
import { postLogin, postLogout } from '../api/authApi';

export const useAuthStore = create((set) => ({
  // --- 상태 (State) ---
  isLoggedIn: false, // 로그인 여부 (기본값: 로그아웃 상태)
  userRole: 'GUEST', // 권한 (GUEST ➔ USER ➔ ADMIN)
  memberId: null, // DB 연동을 위한 회원 고유 ID

  // --- 액션 (Actions) ---
  /* 로그인 처리 액션 - authApi의 postLogin을 호출하고 성공 시 전역 상태를 업데이트 */
  login: async (phoneNumber, password) => {
    try {
      // authApi의 postLogin 호출
      const data = await postLogin(phoneNumber, password);

      set({
        isLoggedIn: true,
        userRole: data.user_role, // 'USER' 또는 'ADMIN'
        memberId: data.member_id,
      });

      return { success: true, role: data.user_role };
    } catch (error) {
      console.error('Store Login Error:', error);
      return { success: false, error };
    }
  },

  /* 로그아웃 처리 액션 - 상태를 초기화하여 출입 권한을 회수 */
  logout: async () => {
    try {
      await postLogout();
    } catch (error) {
      console.error('Store Logout Error:', error);
    } finally {
      // 에러가 나더라도 클라이언트 상태는 안전하게 리셋
      set({
        isLoggedIn: false,
        userRole: 'GUEST',
        memberId: null,
      });
    }
  },

  /* 회원가입 처리 액션 */
  signUp: async (userData) => {
    try {
      // authApi의 postSignUp 함수를 호출하여 서버에 전송
      await postSignUp(userData);

      // 회원가입 성공 시 화면(Component)에 성공 신호를 리턴
      return { success: true };
    } catch (error) {
      console.error('Store SignUp Error:', error);
      // 서버에서 에러 메시지가 올 경우 화면에 뿌려줄 수 있도록 에러 객체 반환
      return { success: false, error };
    }
  },
}));
