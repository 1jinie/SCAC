import { create } from 'zustand';
import { users } from '../data/User';
import { checkIns as initialCheckIns } from '../data/CheckIn';

export const checkInStore = create((set, get) => ({
  currentUser: null,
  checkIns: initialCheckIns,

  // 사용자 인증 및 입실 검증
  verifyCheckIn: (phone, password) => {
    const user = users.find(
      (u) => u.phone === phone && u.password === password,
    );

    // 사용자 정보 확인
    if (!user) {
      return {
        success: false,
        message: '정보가 일치하지 않습니다',
      };
    }

    // 잔여 시간 확인
    if (user.timeLeft <= 0) {
      return {
        success: false,
        message: '잔여 시간이 없습니다',
      };
    }

    // 현재 입실 기록 조회
    const activeCheckIn = get().checkIns.find(
      (checkIn) => checkIn.userId === user.id && checkIn.checkOutTime === null,
    );

    // 퇴실하지 않은 상태
    if (activeCheckIn) {
      // 외출 후 복귀
      if (activeCheckIn.status === 'away') {
        set({ currentUser: user });

        return {
          success: true,
          comeback: true,
          user,
          activeCheckIn,
          message: '재입실하였습니다',
        };
      }

      // 입실 중인 상태
      return {
        success: false,
        message: '이미 입실했습니다',
      };
    }

    set({ currentUser: user });

    return {
      success: true,
      user,
      comeback: false,
      message: '좌석을 선택하세요 ',
    };
  },

  // 외출 가능 여부 확인
  verifyGoOut: (phone, password) => {
    const user = users.find(
      (u) => u.phone === phone && u.password === password,
    );

    // 사용자 확인
    if (!user) {
      return {
        success: false,
        message: '정보가 일치하지 않습니다',
      };
    }

    const activeCheckIn = get().checkIns.find(
      (checkIn) => checkIn.userId === user.id && checkIn.checkOutTime === null,
    );

    // 입실 상태 확인
    if (!activeCheckIn) {
      return {
        success: false,
        message: '입실 정보가 없습니다',
      };
    }

    // 외출 중인지 확인
    if (activeCheckIn.status === 'away') {
      return {
        success: false,
        message: '이미 외출 중입니다',
      };
    }

    return {
      success: true,
      message: '외출 처리 되었습니다.',
      user,
      checkIn: activeCheckIn,
    };
  },

  // 퇴실 가능 여부 확인
  verifyCheckOut: (phone, password) => {
    const user = users.find(
      (u) => u.phone === phone && u.password === password,
    );

    // 사용자 확인
    if (!user) {
      return {
        success: false,
        message: '정보가 일치하지 않습니다',
      };
    }

    const activeCheckIn = get().checkIns.find(
      (checkIn) => checkIn.userId === user.id && checkIn.checkOutTime === null,
    );

    // 입실 상태 확인
    if (!activeCheckIn) {
      return {
        success: false,
        message: '입실 기록이 없습니다',
      };
    }

    return {
      success: true,
      message: '퇴실되었습니다',
      user,
      checkIn: activeCheckIn,
    };
  },

  // 입실 추가
  addCheckIn: (data) =>
    set((state) => {
      // addCheckIn의 중복 생성 방지
      const exists = state.checkIns.some(
        (item) => item.userId === data.userId && item.checkOutTime === null,
      );

      if (exists) return state;

      return {
        checkIns: [
          ...state.checkIns,
          {
            ...data,
            id: state.checkIns.length + 1,
          },
        ],
      };
    }),

  // 외출 처리
  goOut: (userId) =>
    set((state) => ({
      checkIns: state.checkIns.map((checkIn) =>
        checkIn.userId === userId && checkIn.checkOutTime === null
          ? {
              ...checkIn,
              status: 'away',
              awayStartTime: new Date(),
            }
          : checkIn,
      ),
    })),

  // 외출 복귀
  comeBack: (userId) =>
    set((state) => ({
      checkIns: state.checkIns.map((checkIn) =>
        checkIn.userId === userId && checkIn.status === 'away'
          ? {
              ...checkIn,
              status: 'using',
              awayStartTime: null,
            }
          : checkIn,
      ),
    })),

  // 퇴실 처리
  updateCheckOut: (checkInId) =>
    set((state) => ({
      checkIns: state.checkIns.map((checkIn) =>
        checkIn.id === checkInId
          ? {
              ...checkIn,
              checkOutTime: new Date(),
            }
          : checkIn,
      ),
    })),

  // 현재 입실 중인 기록 찾기
  getActiveCheckIn: (userId) => {
    const state = checkInStore.getState();

    return state.checkIns.find(
      (checkIn) => checkIn.userId === userId && checkIn.checkOutTime === null,
    );
  },
}));
