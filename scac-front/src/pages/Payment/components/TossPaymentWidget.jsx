import { useEffect, useState } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import '../css/TossPaymentWidget.css';

const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;

export default function TossPaymentWidget({
  orderId,
  orderName,
  amount,
  customerKey,
  customerEmail,
  customerName,
}) {
  const [widgets, setWidgets] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const renderWidget = async () => {
      if (!clientKey) {
        setErrorMessage('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.');
        return;
      }

      if (
        !orderId ||
        !orderName ||
        !customerKey ||
        !Number.isInteger(amount) ||
        amount <= 0
      ) {
        setErrorMessage('결제 주문 정보가 올바르지 않습니다.');
        return;
      }

      try {
        const tossPayments = await loadTossPayments(clientKey);
        const paymentWidgets = tossPayments.widgets({ customerKey });

        await paymentWidgets.setAmount({
          currency: 'KRW',
          value: amount,
        });

        await Promise.all([
          paymentWidgets.renderPaymentMethods({
            selector: '#toss-payment-method',
            variantKey: 'DEFAULT',
          }),
          paymentWidgets.renderAgreement({
            selector: '#toss-payment-agreement',
            variantKey: 'AGREEMENT',
          }),
        ]);

        if (isMounted) {
          setWidgets(paymentWidgets);
          setIsReady(true);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message ?? '결제위젯을 불러오지 못했습니다.');
        }
      }
    };

    renderWidget();

    return () => {
      isMounted = false;
    };
  }, [amount, customerKey]);

  const handlePayment = async () => {
    if (!widgets || isPaying) return;

    try {
      setIsPaying(true);
      setErrorMessage('');

      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/payment/toss/success`,
        failUrl: `${window.location.origin}/payment/toss/fail`,
        customerEmail,
        customerName,
      });
    } catch (error) {
      console.error('토스 위젯 렌더링 오류:', error);
      setErrorMessage(error.message ?? '결제를 요청하지 못했습니다.');
      setIsPaying(false);
    }
  };

  return (
    <section className="toss_payment_widget">
      <div id="toss-payment-method" />
      <div id="toss-payment-agreement" />

      {errorMessage && (
        <p className="toss_payment_error" role="alert">
          {errorMessage}
        </p>
      )}
      <p>isReady: {String(isReady)}</p>
      <p>isPaying: {String(isPaying)}</p>

      <button
        type="button"
        className="toss_payment_button"
        onClick={handlePayment}
        disabled={!isReady || isPaying}
      >
        {isPaying
          ? '결제를 요청하고 있습니다'
          : `${Number(amount || 0).toLocaleString()}원 결제하기`}
      </button>
    </section>
  );
}
