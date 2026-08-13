import { create } from 'zustand';

export const usePaymentStore = create((set) => ({
  // 결제 수단 'CARD', 'TOSSPAY'
  paymentMethod: null,
  type: null,

  setPaymentMethod: (paymentMethod) => set({ paymentMethod: paymentMethod }),
  setType: (type) => set({ type: type }),
  resetStore: () => set({ paymentMethod: null, type: null }),
}));
