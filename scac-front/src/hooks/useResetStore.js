import { useCallback } from 'react';
import { usePaymentStore } from '../store/paymentStore';
import { useTicketStore } from '../store/ticketStore';
import { reservationStore } from '../store/reservationStore';

export const useResetStore = () => {
  const resetPayment = usePaymentStore((state) => state.resetStore);
  const resetTicket = useTicketStore((state) => state.resetStore);
  const clearReservation = reservationStore((state) => state.clearReservation);

  const resetAll = useCallback(() => {
    resetPayment();
    resetTicket();
    clearReservation();
  }, [resetPayment, resetTicket, clearReservation]);

  return resetAll;
};
