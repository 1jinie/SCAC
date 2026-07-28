import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;

export const requestTossPayment = async ({
  orderId,
  orderName,
  amount,
  paymentMethod,
}) => {
  const tossPayments = await loadTossPayments(clientKey);

  const payment = tossPayments.payment({
    customerKey: 'ANONYMOUS',
  });

  await payment.requestPayment({
    method: paymentMethod,

    amount: {
      currency: 'KRW',
      value: amount,
    },

    orderId,
    orderName,

    successUrl: `${window.location.origin}/payment/toss/success`,

    failUrl: `${window.location.origin}/payment/toss/fail`,
    windowTarget: 'self',
  });
};
