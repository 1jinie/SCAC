import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentApi } from '../../../api/paymentApi';
import { reservationApi } from '../../../api/reservationApi';
import { ticketApi } from '../../../api/ticketApi';
import { useResetStore } from '../../../hooks/useResetStore';
import ReservationPaymentResult from './ReservationPaymentResult';
import TicketPaymentResult from './TicketPaymentResult';
import { getCommand, printReceipt } from '../../../api/deviceApi';
//영수증 출력 명령 api printReceipt, 장치명령 처리 결과 조회용 api getCommand로 임시로 사용했습니다 지우셔도 상관없어요 나중에 맞는 명칭으로 수정하시면 돼요

export default function PaymentResultCard({ isSuccess, errorMessage }) {
  const [payment, setPayment] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultError, setResultError] = useState('');
  const navi = useNavigate();
  const { resetAll } = useResetStore();
  const { state } = useLocation();
  const paymentId = state?.paymentId;
  const [closeTimer, setCloseTimer] = useState(10);
  const { resetPayData } = useResetStore();
  const [isPrintingReceipt, setIsPrintingReceipt] = useState(false);
  const [isReceiptPrinted, setIsReceiptPrinted] = useState(false);

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

  // 10초 타이머 + 10초 지나면 자동으로 올 리셋(+로그아웃) + 메인으로 이동
  useEffect(() => {
    // 영수증 출력 중에는 자동 로그아웃 타이머 정지
    if (isPrintingReceipt) {
      return;
    }
    if (closeTimer < 0) {
      resetAll();
      navi('/', { replace: true });
      return;
    }
    const timer = setTimeout(() => {
      setCloseTimer((t) => t - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [navi, resetAll, closeTimer, isPrintingReceipt]);

  // 계속 이어하기 버튼함수 (결제 데이터만 리셋, loginhome으로 이동)
  const handleContinue = () => {
    resetPayData();
    navi('/loginhome', { replace: true });
  };

  // 사용자가 직접 종료버튼 누르는 함수 올리셋 로그아웃 + 메인이동
  const handleExit = () => {
    resetAll();
    navi('/', { replace: true });
  };

  // 영수증 출력 버튼 함수 임시로 만든건데 지우고 다시 만드셔도 돼요
  const handlePrintReceipt = async () => {
    if (!payment || isPrintingReceipt || isReceiptPrinted) {
      return;
    }

    try {
      setIsPrintingReceipt(true);

      // 출력 중 자동 로그아웃 방지
      setCloseTimer(10);

      const itemName =
        ticket?.ticketName ??
        (reservation ? `스터디룸 ${reservation.roomId}번 예약` : '결제 상품');

      const command = await printReceipt({
        orderId: payment.orderId ?? `PAYMENT-${payment.paymentId}`,
        itemName,
        amount: payment.amount,
      });

      // RTOS 처리 결과 확인
      for (let i = 0; i < 20; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const result = await getCommand(command.id);

        if (result.status === 'COMPLETED') {
          setIsReceiptPrinted(true);
          return;
        }

        if (result.status === 'FAILED') {
          throw new Error(result.result ?? '영수증 출력에 실패했습니다.');
        }
      }

      throw new Error('프린터 응답이 지연되고 있습니다.');
    } catch (error) {
      console.error('영수증 출력 실패:', error);

      alert(
        error.response?.data?.message ??
          error.message ??
          '영수증 출력에 실패했습니다.',
      );
    } finally {
      setIsPrintingReceipt(false);
    }
  };

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

      <div className="btn_place">
        {isSuccess && (
          <button
            type="button"
            className="btn_receipt"
            onClick={handlePrintReceipt}
            disabled={
              isLoading || !payment || isPrintingReceipt || isReceiptPrinted
            }
          >
            {isPrintingReceipt
              ? '영수증 출력 중...'
              : isReceiptPrinted
                ? '✓ 영수증 출력 완료'
                : '영수증 받기'}
          </button>
        )}

        <button
          className="btn_loginhome"
          onClick={() => {
            handleContinue();
          }}
        >
          이어서 이용하기
        </button>
        <button
          className="btn_mainhome"
          onClick={() => {
            handleExit();
          }}
        >
          로그아웃
        </button>
        <p className="payment_auto_exit">
          {isPrintingReceipt
            ? '영수증을 출력하고 있습니다.'
            : `${closeTimer}초 후 자동으로 로그아웃 됩니다.`}
        </p>
      </div>
    </div>
  );
}
