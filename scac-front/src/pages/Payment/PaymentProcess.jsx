import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentApi } from '../../api/paymentApi';
import { ticketApi } from '../../api/ticketApi';
import CloseButton from '../../components/button/CloseButton';
import KioskErrorState from '../../components/common/KioskErrorState';
import { PAYMENT_METHOD } from '../../constants/payment';
import { useAuthStore } from '../../store/authStore';
import { usePaymentStore } from '../../store/paymentStore';
import { useTicketStore } from '../../store/ticketStore';
import SeatPayment from './components/SeatPayment';
import StudyRoomPayment from './components/StudyRoomPayment';
import './css/PaymentProcess.css';
import './css/TossPayment.css';
import { requestTossPayment } from './utils/requestTossPayment';

export default function PaymentProcess() {
  const navi = useNavigate();

  const targetType = useTicketStore((state) => state.targetType);
  const selectedTicketId = useTicketStore((state) => state.selectedTicketId);

  const paymentMethod = usePaymentStore((state) => state.paymentMethod);

  const memberId = useAuthStore((state) => state.memberId);

  const [ticket, setTicket] = useState(null);
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [ticketError, setTicketError] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // 결제정보 확인을 위해 이용권 조회
  const fetchTicket = useCallback(async () => {
    if (!selectedTicketId) {
      return;
    }

    try {
      setIsLoadingTicket(true);
      setTicketError('');

      const result = await ticketApi.getById(selectedTicketId);

      setTicket(result);
    } catch (error) {
      console.error('이용권 조회 실패:', error);

      setTicket(null);
      setTicketError(
        error.response?.data?.message ?? '이용권 정보를 불러오지 못했습니다.',
      );
    } finally {
      setIsLoadingTicket(false);
    }
  }, [selectedTicketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  // 결제 시작
  const handlePayment = async () => {
    if (!ticket || isPaying) {
      return;
    }

    try {
      setIsPaying(true);
      setPaymentError('');

      const orderData = {
        ticketId: selectedTicketId,
        userId: memberId,
        amount: ticket.ticketPrice,
        paymentMethod,
      };

      // 1. 카드 결제 → 키오스크 Mock 단말기
      if (paymentMethod === PAYMENT_METHOD.CARD) {
        const order = await paymentApi.createPayment(orderData);

        navi('/payment/kiosk/card', {
          state: {
            paymentId: order.paymentId,
          },
        });

        return;
      }

      // 2. 네이버페이 → QR 결제 화면
      if (paymentMethod === PAYMENT_METHOD.NAVERPAY) {
        const order = await paymentApi.createPayment(orderData);

        navi('/payment/kiosk/qr', {
          state: {
            paymentId: order.paymentId,
            amount: order.amount,
          },
        });

        return;
      }

      // 3. 토스페이 / 카카오페이
      if (
        paymentMethod === PAYMENT_METHOD.TOSSPAY ||
        paymentMethod === PAYMENT_METHOD.KAKAOPAY
      ) {
        const order = await paymentApi.createPayment(orderData);

        await requestTossPayment({
          orderId: order.orderId,
          orderName: ticket.ticketName,
          amount: order.amount,
          paymentMethod,
        });

        return;
      }

      throw new Error('지원하지 않는 결제 수단입니다.');
    } catch (error) {
      console.error('결제 요청 오류:', error);

      setPaymentError(
        error.response?.data?.message ??
          error.message ??
          '결제를 요청하지 못했습니다.',
      );
    } finally {
      setIsPaying(false);
    }
  };

  // 화면 자체를 구성할 수 없는 오류
  if (!selectedTicketId) {
    return (
      <KioskErrorState
        variant="page"
        title="선택된 이용권이 없습니다."
        message="처음 화면으로 돌아가 이용권을 다시 선택해 주세요."
        onHome={() => navi('/')}
      />
    );
  }

  if (!paymentMethod) {
    return (
      <KioskErrorState
        variant="page"
        title="선택된 결제 수단이 없습니다."
        message="처음 화면으로 돌아가 결제 수단을 다시 선택해 주세요."
        onHome={() => navi('/')}
      />
    );
  }

  if (memberId == null) {
    return (
      <KioskErrorState
        variant="page"
        title="사용자 정보를 확인할 수 없습니다."
        message="로그인 정보가 만료되었을 수 있습니다. 처음 화면에서 다시 로그인해 주세요."
        onHome={() => navi('/')}
      />
    );
  }

  return (
    <>
      <div className="overlay">
        <div className="payment_modal">
          <CloseButton nextPage="/ticket" text="결제취소" />

          <h2>결제정보 확인</h2>

          <div className="payment_process_box">
            {isLoadingTicket && (
              <p className="payment_loading">결제 정보를 불러오고 있습니다.</p>
            )}

            {!isLoadingTicket &&
              ticket &&
              (targetType === 'SEAT' ? (
                <SeatPayment />
              ) : targetType === 'MEETING_ROOM' ? (
                <StudyRoomPayment />
              ) : (
                <p>결제 정보를 확인할 수 없습니다.</p>
              ))}
          </div>

          <div className="payment_action_area">
            <button
              type="button"
              className="toss_payment_button"
              onClick={handlePayment}
              disabled={isPaying || isLoadingTicket || !ticket}
            >
              {isPaying
                ? '결제를 준비하고 있습니다'
                : ticket
                  ? `${ticket.ticketPrice.toLocaleString()}원 결제하기`
                  : '결제 정보 확인 중'}
            </button>
          </div>
        </div>
      </div>

      {/* 이용권 조회 실패 팝업 */}
      {ticketError && (
        <KioskErrorState
          variant="modal"
          title="이용권 정보를 불러오지 못했습니다."
          message={ticketError}
          onRetry={fetchTicket}
          onHome={() => navi('/')}
        />
      )}

      {/* 결제 요청 실패 팝업 */}
      {paymentError && (
        <KioskErrorState
          variant="modal"
          title="결제를 진행하지 못했습니다."
          message={paymentError}
          onRetry={handlePayment}
          onClose={() => setPaymentError('')}
        />
      )}
    </>
  );
}
