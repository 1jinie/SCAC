import { useEffect, useState } from 'react';
import { paymentApi } from '../../api/paymentApi';
import { ticketApi } from '../../api/ticketApi';
import CloseButton from '../../components/button/CloseButton';
import { useAuthStore } from '../../store/authStore';
import { usePaymentStore } from '../../store/paymentStore';
import { useTicketStore } from '../../store/ticketStore';
import SeatPayment from './components/SeatPayment';
import StudyRoomPayment from './components/StudyRoomPayment';
import './css/PaymentProcess.css';
import './css/TossPayment.css';
import { requestTossPayment } from './utils/requestTossPayment';

export default function PaymentProcess() {
  const targetType = useTicketStore((state) => state.targetType);
  const selectedTicketId = useTicketStore((state) => state.selectedTicketId);

  const paymentMethod = usePaymentStore((state) => state.paymentMethod);

  const memberId = useAuthStore((state) => state.memberId);

  const [ticket, setTicket] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 결제정보 확인을 위해 이용권만 조회
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setErrorMessage('');

        const ticket = await ticketApi.getById(selectedTicketId);

        setTicket(ticket);
      } catch (error) {
        console.error('이용권 조회 실패:', error);

        setErrorMessage(
          error.response?.data?.message ?? '이용권 정보를 불러오지 못했습니다.',
        );
      }
    };

    if (selectedTicketId) {
      fetchTicket();
    }
  }, [selectedTicketId]);

  // 실제 결제 시작
  const handlePayment = async () => {
    if (!ticket || isPaying) {
      return;
    }

    try {
      setIsPaying(true);
      setErrorMessage('');

      // 1. 결제하기를 눌렀을 때 PENDING 주문 생성
      const order = await paymentApi.createPayment({
        ticketId: selectedTicketId,
        userId: memberId,
        amount: ticket.ticketPrice,
        paymentMethod,
      });

      // 2. 토스 결제창 호출
      await requestTossPayment({
        orderId: order.orderId,
        orderName: ticket.ticketName,
        amount: order.amount,
        paymentMethod,
      });
    } catch (error) {
      console.error('토스 결제 요청 오류:', error);

      setErrorMessage(
        error.response?.data?.message ??
          error.message ??
          '결제를 요청하지 못했습니다.',
      );

      setIsPaying(false);
    }
  };

  if (!selectedTicketId) {
    return <p>선택된 이용권이 없습니다.</p>;
  }

  if (!paymentMethod) {
    return <p>선택된 결제 수단이 없습니다.</p>;
  }

  if (!memberId) {
    return <p>사용자 정보를 확인할 수 없습니다.</p>;
  }

  if (!ticket && !errorMessage) {
    return <p>결제 정보를 불러오고 있습니다.</p>;
  }

  return (
    <div className="overlay">
      <div className="payment_modal">
        <CloseButton nextPage={'/ticket'} text="결제취소" />
        <h2>결제정보 확인</h2>

        <div className="payment_process_box">
          {targetType === 'SEAT' ? (
            <SeatPayment />
          ) : targetType === 'MEETING_ROOM' ? (
            <StudyRoomPayment />
          ) : (
            <p>결제 정보를 확인할 수 없습니다.</p>
          )}
        </div>
        <div className="payment_action_area">
          {errorMessage && (
            <p className="toss_payment_error" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            className="toss_payment_button"
            onClick={handlePayment}
            disabled={isPaying || !ticket}
          >
            {isPaying
              ? '결제창을 여는 중입니다'
              : `${ticket?.ticketPrice?.toLocaleString()}원 결제하기`}
          </button>
        </div>
      </div>
    </div>
  );
}
