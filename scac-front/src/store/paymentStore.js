import { create } from 'zustand';

export const usePaymentStore = create((set) => ({
  // 결제 수단 'CARD', 'SIMPLE'
  paymentMethod: null,

  setPaymentMethod: (paymentMethod) => set({ paymentMethod: paymentMethod }),

  clearSelectedPaymentMethod: () => set({ paymentMethod: null }),
}));
