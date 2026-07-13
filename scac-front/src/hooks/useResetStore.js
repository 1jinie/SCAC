import { usePaymentStore } from '../store/paymentStore';
import { useTicketStore } from '../store/ticketStore';

export const useResetStore = () => {
  const resetPayment = usePaymentStore((state) => state.resetStore);
  const resetTicket = useTicketStore((state) => state.resetStore);

  const resetAll = () => {
    resetPayment();
    resetTicket();
  };

  return resetAll;
};
