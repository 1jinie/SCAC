import { ANONYMOUS, loadTossPayments } from '@tosspayments/tosspayments-sdk';

const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;

const EASY_PAY_PROVIDER = {
  TOSSPAY: 'TOSSPAY',
  KAKAOPAY: 'KAKAOPAY',
};

export const requestTossPayment = async ({
  orderId,
  orderName,
  amount,
  paymentMethod,
}) => {
  const tossPayments = await loadTossPayments(clientKey);

  const payment = tossPayments.payment({
    customerKey: ANONYMOUS,
  });

  const easyPay = EASY_PAY_PROVIDER[paymentMethod];

  if (!easyPay) {
    throw new Error('지원하지 않는 간편결제 수단입니다.');
  }

  await payment.requestPayment({
    method: 'CARD',

    amount: {
      currency: 'KRW',
      value: amount,
    },

    orderId,
    orderName,

    successUrl: `${window.location.origin}/payment/toss/success`,

    failUrl: `${window.location.origin}/payment/toss/fail`,
    card: {
      useEscrow: false,
      flowMode: 'DIRECT',
      easyPay,
      useCardPoint: false,
      useAppCardOnly: false,
    },
  });
};
