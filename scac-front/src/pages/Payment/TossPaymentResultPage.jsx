import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentApi } from '../../api/paymentApi';

export default function TossPaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        // 1. 토스가 successUrl로 전달한 값
        const paymentKey = searchParams.get('paymentKey');
        const orderId = searchParams.get('orderId');
        const amount = Number(searchParams.get('amount'));

        // 2. 백엔드 결제 승인
        const result = await paymentApi.confirmPayment({
          paymentKey,
          orderId,
          amount,
        });

        console.log('결제 승인 완료:', result);

        // 3. 성공 화면에는 paymentId만 전달
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
              error.response?.data?.message ?? '결제 승인에 실패했습니다.',
          },
        });
      }
    };

    confirmPayment();
  }, [navigate, searchParams]);

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
