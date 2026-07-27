import { useEffect, useState } from 'react';
import { paymentApi } from '../../api/paymentApi';
import { ticketApi } from '../../api/ticketApi';
import { useAuthStore } from '../../store/authStore';
import { usePaymentStore } from '../../store/paymentStore';
import { useTicketStore } from '../../store/ticketStore';
import TossPaymentWidget from './components/TossPaymentWidget';

export default function TossPaymentPage() {
  const selectedTicketId = useTicketStore((state) => state.selectedTicketId);

  const paymentMethod = usePaymentStore((state) => state.paymentMethod);

  const memberId = useAuthStore((state) => state.memberId);

  const [order, setOrder] = useState(null);
  const [orderName, setOrderName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const preparePayment = async () => {
      try {
        setErrorMessage('');

        // 1. 선택한 이용권 조회
        const ticket = await ticketApi.getById(selectedTicketId);

        // 2. 백엔드에 결제 주문 생성
        const payment = await paymentApi.createPayment({
          ticketId: selectedTicketId,
          userId: memberId,
          amount: ticket.ticketPrice,
          paymentMethod,
        });

        setOrder(payment);
        setOrderName(ticket.ticketName);
      } catch (error) {
        console.error('결제 준비 실패:', error);

        setErrorMessage(
          error.response?.data?.message ?? '결제를 준비하지 못했습니다.',
        );
      }
    };

    if (selectedTicketId && memberId && paymentMethod) {
      preparePayment();
    }
  }, [selectedTicketId, memberId, paymentMethod]);

  if (!selectedTicketId) {
    return <p>선택된 이용권이 없습니다.</p>;
  }

  if (!paymentMethod) {
    return <p>선택된 결제 수단이 없습니다.</p>;
  }

  if (!memberId) {
    return <p>사용자 정보를 확인할 수 없습니다.</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  if (!order) {
    return <p>결제를 준비하고 있습니다.</p>;
  }

  return (
    <TossPaymentWidget
      orderId={order.orderId}
      orderName={orderName}
      amount={order.amount}
      // 테스트를 위해 임시 키
      customerKey="ANONYMOUS"
    />
  );
}
