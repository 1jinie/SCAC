import { create } from 'zustand';
import { checkIns as initialCheckIns } from '../data/CheckIn';

export const checkInStore = create((set) => ({
  currentUser: null,
  checkIns: initialCheckIns,

  // 사용자 인증
  authenticate: (user) =>
    set({
      currentUser: user,
    }),

  // 입실 추가
  addCheckIn: (data) =>
    set((state) => ({
      checkIns: [
        ...state.checkIns,
        {
          ...data,
          id: state.checkIns.length + 1,
        },
      ],
    })),

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
