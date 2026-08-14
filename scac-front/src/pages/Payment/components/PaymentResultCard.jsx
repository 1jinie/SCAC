import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentApi } from '../../../api/paymentApi';
import { ticketApi } from '../../../api/ticketApi';
import SelectButton from '../../../components/button/SelectButton';
import { useResetStore } from '../../../hooks/useResetStore';
import { reservationApi } from '../../../api/reservationApi';
import TicketPaymentResult from './TicketPaymentResult';
import ReservationPaymentResult from './ReservationPaymentResult';

export default function PaymentResultCard({ isSuccess, errorMessage }) {
  const [payment, setPayment] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultError, setResultError] = useState('');
  const navi = useNavigate();
  const resetAll = useResetStore();
  const { state } = useLocation();
  const paymentId = state?.paymentId;
  const [closeTimer, setCloseTimer] = useState(10);

  useEffect(() => {
    if (!isSuccess || paymentId == null) {
      return;
    }

    // 결제 결과 가져오기
    const fetchPaymentResult = async () => {
      try {
        setIsLoading(true);
        setResultError('');

        const paymentData = await paymentApi.getPayment(paymentId);

        setPayment(paymentData);

        // 좌석 이용권
        if (paymentData.ticketId != null) {
          const ticketData = await ticketApi.getById(paymentData.ticketId);

          setTicket(ticketData);
          setReservation(null);

          return;
        }

        // 스터디룸 예약
        if (paymentData.reservationId != null) {
          const reservationData = await reservationApi.getReservation(
            paymentData.reservationId,
          );

          setReservation(reservationData);
          setTicket(null);

          return;
        }

        throw new Error('결제 대상 정보가 없습니다.');
      } catch (error) {
        console.error(
          '결제 결과 조회 실패:',
          error.response?.data ?? error.message,
        );

        setResultError(
          error.response?.data?.message ??
            error.message ??
            '결제 결과를 불러오지 못했습니다.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentResult();
  }, [isSuccess, paymentId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCloseTimer(closeTimer - 1);
      console.log('timer' + closeTimer);
    }, 1000);
    if (closeTimer <= 0) {
      resetAll();
      navi('/');
      return () => clearTimeout(timer);
    }
  }, [navi, resetAll, closeTimer]);
  return (
    <div className={`payment_status_box ${isSuccess ? 'success' : 'fail'}`}>
      <img
        src={
          isSuccess
            ? '/icons/common/check_circle.svg'
            : '/icons/common/caution.svg'
        }
        alt={isSuccess ? '결제 성공' : '결제 실패'}
        className="payment_result_icon"
      />

      <div className="payment_status_container">
        <div className="payment_status_row">
          <span>status</span>
          <span>{isSuccess ? '[결제 성공]' : '[Error!]'}</span>
        </div>
        {isSuccess ? (
          <>
            {isLoading && (
              <div className="payment_status_row">
                <span>결제 결과를 불러오는 중입니다.</span>
              </div>
            )}

            {!isLoading && resultError && (
              <div className="payment_status_row">
                <span>{resultError}</span>
              </div>
            )}

            {!isLoading && !resultError && ticket && (
              <TicketPaymentResult ticket={ticket} payment={payment} />
            )}

            {!isLoading && !resultError && reservation && (
              <ReservationPaymentResult
                reservation={reservation}
                payment={payment}
              />
            )}
          </>
        ) : (
          <div className="payment_status_row">
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {isSuccess ? (
        <p className="payment_message">
          결제가 완료되었습니다.
          <br />
          영수증을 확인해 주세요.
        </p>
      ) : (
        <p className="payment_message">
          결제가 실패하였습니다.
          <br />
          다시 확인해 주세요.
        </p>
      )}
      <p className="payment_timer">{closeTimer}초 후 자동으로 종료됩니다</p>
      <SelectButton
        nextPage={'/'}
        text={'홈으로 돌아가기'}
        onClickAction={resetAll}
      />
    </div>
  );
}
