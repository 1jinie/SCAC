import { useCallback } from 'react';
import { usePaymentStore } from '../store/paymentStore';
import { useTicketStore } from '../store/ticketStore';
import { reservationStore } from '../store/reservationStore';
import { useAuthStore } from '../store/authStore';

// 사용법 const { resetAll, resetData } = useResetStore(); 또는 const resetAll = useResetStore((state) => state.resetAll); const resetData = useResetStore((state) => state.resetData);
export const useResetStore = () => {
  const resetPayment = usePaymentStore((state) => state.resetStore);
  const resetTicket = useTicketStore((state) => state.resetStore);
  const clearReservation = reservationStore((state) => state.clearReservation);
  const logout = useAuthStore((state) => state.logout);

  // 모든 스토어 상태 초기화 및 로그아웃
  const resetAll = useCallback(() => {
    resetPayment();
    resetTicket();
    clearReservation();
    logout();
  }, [resetPayment, resetTicket, clearReservation, logout]);

  // 결제, 이용권, 예약정보 초기화
  const resetData = useCallback(() => {
    resetPayment();
    resetTicket();
    clearReservation();
  }, [resetPayment, resetTicket, clearReservation]);
  return { resetAll, resetData };
};
