import { useCallback } from 'react';
import { usePaymentStore } from '../store/paymentStore';
import { useTicketStore } from '../store/ticketStore';
import { reservationStore } from '../store/reservationStore';
import { useAuthStore } from '../store/authStore';
import { checkInStore } from '../store/checkInStore';
import { seatStore } from '../store/seatStore';
import { useUserStore } from '../store/userStore';

// 사용법 const { resetAll, resetPayData } = useResetStore(); 선언 후 필요한곳에 resetAll(); 쓰시면돼요
export const useResetStore = () => {
  const resetPayment = usePaymentStore((state) => state.resetStore);
  const resetTicket = useTicketStore((state) => state.resetStore);
  const clearReservation = reservationStore((state) => state.clearReservation);
  const logout = useAuthStore((state) => state.logout);
  const clearCheckIn = checkInStore((state) => state.clearCheckIn);
  const clearSelected = seatStore((state) => state.clearSelected);
  const clearUserData = useUserStore((state) => state.clearUserData);

  // 모든 스토어 상태 초기화 및 로그아웃
  const resetAll = useCallback(() => {
    resetPayment();
    resetTicket();
    clearReservation();
    clearCheckIn();
    clearSelected();
    clearUserData();
    logout();
  }, [
    resetPayment,
    resetTicket,
    clearReservation,
    logout,
    clearCheckIn,
    clearSelected,
    clearUserData,
  ]);

  // 결제관련 데이터 초기화
  const resetPayData = useCallback(() => {
    resetPayment();
    resetTicket();
    clearReservation();
  }, [resetPayment, resetTicket, clearReservation]);
  return { resetAll, resetPayData };
};
