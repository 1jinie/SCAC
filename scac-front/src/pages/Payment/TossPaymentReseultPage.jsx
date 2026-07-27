import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import paymentApi from '../../api/paymentApi';
import ProceedPayment from './components/ProceedPayment';

export default function TossPaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const result = await paymentApi.confirm({
          paymentKey: searchParams.get('paymentKey'),
          orderId: searchParams.get('orderId'),
          amount: Number(searchParams.get('amount')),
        });

        navigate('/payment/result/success', {
          replace: true,
          state: { payment: result },
        });
      } catch (error) {
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

  return <ProceedPayment />;
}
