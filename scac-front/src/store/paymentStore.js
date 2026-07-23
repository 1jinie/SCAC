import { create } from 'zustand';

export const usePaymentStore = create((set) => ({
  // 결제 수단 'CARD', 'EASY_PAY'
  paymentMethod: null,

  setPaymentMethod: (paymentMethod) => set({ paymentMethod: paymentMethod }),

  resetStore: () => set({ paymentMethod: null }),
}));
