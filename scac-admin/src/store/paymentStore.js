import { create } from "zustand";

export const paymentStore = create((set) => ({
  payments: [],
  selectedPayment: null,

  setPayments: (payments) => {
    set({ payments });
  },

  selectPayment: (payment) => {
    set({ selectedPayment: payment });
  },

  clearSelectedPayment: () => {
    set({ selectedPayment: null });
  },

  updatePaymentStatus: (paymentId, status) => {
    set((state) => ({
      payments: state.payments.map((payment) =>
        payment.paymentId === paymentId
          ? {
              ...payment,
              status,
            }
          : payment,
      ),

      selectedPayment:
        state.selectedPayment?.paymentId === paymentId
          ? {
              ...state.selectedPayment,
              status,
            }
          : state.selectedPayment,
    }));
  },
}));
