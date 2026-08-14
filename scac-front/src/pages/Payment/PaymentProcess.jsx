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
import { requestTossPayment } from './utils/requestTossPayment';
import { reservationStore } from '../../store/reservationStore';
import { roomStore } from '../../store/roomStore';
import './css/PaymentProcess.css';
import './css/TossPayment.css';
import { formatPrice } from '../../utils/formatter';

export default function PaymentProcess() {
  const navi = useNavigate();

  const targetType = useTicketStore((state) => state.targetType);
  const selectedTicketId = useTicketStore((state) => state.selectedTicketId);

  const paymentMethod = usePaymentStore((state) => state.paymentMethod);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [ticket, setTicket] = useState(null);
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [ticketError, setTicketError] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const reservation = reservationStore((state) => state.reservation);

  const rooms = roomStore((state) => state.rooms);

  const selectedRoom = rooms.find((room) => room.id === reservation.roomId);

  const isTicketPayment = targetType === 'SEAT';
  const isReservationPayment = targetType === 'MEETING_ROOM';

  const reservationAmount =
    selectedRoom && reservation.startHour != null
      ? (reservation.endHour - reservation.startHour) * selectedRoom.hourlyRate
      : 0;

  const displayAmount = isTicketPayment
    ? ticket?.ticketPrice
    : reservationAmount;

  // 좌석이용권 결제정보 확인을 위해 좌석이용권 조회
  const fetchTicket = useCallback(async () => {
    if (!isTicketPayment || !selectedTicketId) {
      return;
    }

    try {
      setIsLoadingTicket(true);
      setTicketError('');

      const result = await ticketApi.getById(selectedTicketId);

      setTicket(result);
    } catch (error) {
      setTicket(null);
      setTicketError(
        error.response?.data?.message ?? '이용권 정보를 불러오지 못했습니다.',
      );
    } finally {
      setIsLoadingTicket(false);
    }
  }, [isTicketPayment, selectedTicketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  // 결제 시작
  const handlePayment = async () => {
    if (isPaying) {
      return;
    }

    try {
      setIsPaying(true);
      setPaymentError('');

      let orderData;
      let orderName;

      // 좌석 이용권
      if (isTicketPayment) {
        if (!ticket) {
          throw new Error('이용권 정보가 없습니다.');
        }

        orderData = {
          ticketId: selectedTicketId,
          amount: ticket.ticketPrice,
          paymentMethod,
        };

        orderName = ticket.ticketName;

        //스터디룸 예약
      } else if (isReservationPayment) {
        if (!reservation.reservationId || !selectedRoom) {
          throw new Error('스터디룸 예약 정보가 없습니다.');
        }

        const amount =
          (reservation.endHour - reservation.startHour) *
          selectedRoom.hourlyRate;

        orderData = {
          reservationId: reservation.reservationId,
          amount,
          paymentMethod,
        };

        orderName =
          `${selectedRoom.name} 스터디룸 ` +
          `${reservation.startHour}:00~${reservation.endHour}:00`;
      } else {
        throw new Error('결제 정보를 확인할 수 없습니다.');
      }

      const order = await paymentApi.createPayment(orderData);

      // 1. Mock 카드결제
      if (paymentMethod === PAYMENT_METHOD.CARD) {
        navi('/payment/kiosk/card', {
          state: {
            paymentId: order.paymentId,
          },
        });

        return;
      }

      // 2. TossPay 결제
      if (paymentMethod === PAYMENT_METHOD.TOSSPAY) {
        await requestTossPayment({
          orderId: order.orderId,
          orderName,
          amount: order.amount,
          paymentMethod,
        });

        return;
      }

      throw new Error('지원하지 않는 결제 수단입니다.');
    } catch (error) {
      setPaymentError(
        error.response?.data?.message ??
          error.message ??
          '결제 요청을 실패했습니다.',
      );
    } finally {
      setIsPaying(false);
    }
  };

  // 화면 자체를 구성할 수 없는 오류
  if (isTicketPayment && !selectedTicketId) {
    return (
      <KioskErrorState
        variant="page"
        title="선택된 이용권이 없습니다."
        message="처음 화면으로 돌아가 이용권을 다시 선택해 주세요."
        onHome={() => navi('/', { replace: true })}
      />
    );
  }

  if (isReservationPayment && !reservation.reservationId) {
    return (
      <KioskErrorState
        variant="page"
        title="스터디룸 예약 정보가 없습니다."
        message="스터디룸과 시간을 다시 선택해주세요."
        onHome={() => navi('/', { replace: true })}
      />
    );
  }

  if (!paymentMethod) {
    return (
      <KioskErrorState
        variant="page"
        title="선택된 결제 수단이 없습니다."
        message="처음 화면으로 돌아가 결제 수단을 다시 선택해 주세요."
        onHome={() => navi('/', { replace: true })}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <KioskErrorState
        variant="page"
        title="사용자 정보가 필요합니다."
        message="사용자 정보가 만료되었을 수 있습니다. 다시 시도해 주세요."
        onHome={() => navi('/', { replace: true })}
      />
    );
  }

  return (
    <>
      <div className="overlay">
        <div className="payment_modal">
          <CloseButton
            nextPage={isReservationPayment ? '/room' : '/ticket'}
            text="결제취소"
          />

          <h2>결제정보 확인</h2>

          <div className="payment_process_box">
            {isLoadingTicket && (
              <p className="payment_loading">결제 정보를 불러오고 있습니다.</p>
            )}

            {isTicketPayment ? (
              <SeatPayment />
            ) : isReservationPayment ? (
              <StudyRoomPayment room={selectedRoom} reservation={reservation} />
            ) : (
              <p>결제 정보를 확인할 수 없습니다.</p>
            )}
          </div>

          <div className="payment_action_area">
            <button
              type="button"
              className="toss_payment_button"
              onClick={handlePayment}
              disabled={isPaying || isLoadingTicket}
            >
              {isPaying
                ? '결제를 준비하고 있습니다'
                : `${formatPrice(displayAmount)}원 결제하기`}
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
          onHome={() => navi('/', { replace: true })}
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
