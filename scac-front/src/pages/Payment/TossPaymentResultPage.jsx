import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { paymentApi } from '../../api/paymentApi';

export default function TossPaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const hasRequestedRef = useRef(false);

  useEffect(() => {
    // 여러번 호출되는 걸 막는용도
    if (hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;

    const handlePaymentResult = async () => {
      // Toss 결제 실패 또는 취소
      if (location.pathname.endsWith('/fail')) {
        const code = searchParams.get('code');
        const message =
          searchParams.get('message') ??
          '결제가 취소되었거나 처리되지 않았습니다.';

        console.error('토스 결제 실패:', {
          code,
          message,
        });

        navigate('/payment/result/fail', {
          replace: true,
          state: {
            code,
            message,
          },
        });

        return;
      }

      // Toss 결제 성공
      try {
        const paymentKey = searchParams.get('paymentKey');
        const orderId = searchParams.get('orderId');
        const amountParam = searchParams.get('amount');
        const amount = Number(amountParam);

        if (
          !paymentKey ||
          !orderId ||
          !amountParam ||
          !Number.isFinite(amount) ||
          amount <= 0
        ) {
          throw new Error('결제 승인 정보가 올바르지 않습니다.');
        }

        const result = await paymentApi.confirmPayment({
          paymentKey,
          orderId,
          amount,
        });

        console.log('결제 승인 완료:', result);

        navigate('/payment/result/success', {
          replace: true,
          state: {
            paymentId: result.paymentId,
          },
        });
      } catch (error) {
        console.error('결제 승인 실패:', error);

        navigate('/payment/result/fail', {
          replace: true,
          state: {
            message:
              error.response?.data?.message ??
              error.message ??
              '결제 승인에 실패했습니다.',
          },
        });
      }
    };

    handlePaymentResult();
  }, [location.pathname, navigate, searchParams]);

  return (
    <div className="overlay">
      <div className="payment_modal">
        <h2>결제를 처리하고 있습니다</h2>

        <div className="payment_spin_area">
          <div className="payment_spinner" />

          <div className="payment_spin_message">
            <p>결제 정보를 확인하고 있습니다.</p>
            <p>잠시만 기다려 주세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
