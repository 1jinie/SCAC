import { useCallback } from 'react';
import { usePaymentStore } from '../store/paymentStore';
import { useTicketStore } from '../store/ticketStore';

export const useResetStore = () => {
  const resetPayment = usePaymentStore((state) => state.resetStore);
  const resetTicket = useTicketStore((state) => state.resetStore);

  const resetAll = useCallback(() => {
    resetPayment();
    resetTicket();
  }, [resetPayment, resetTicket]);

  return resetAll;
};
