import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentApi } from '../../../api/paymentApi';
import { ticketApi } from '../../../api/ticketApi';
import SelectButton from '../../../components/button/SelectButton';
import { useResetStore } from '../../../hooks/useResetStore';
import { roomApi } from '../../../api/roomApi';
import { reservationStore } from '../../../store/reservationStore';

export default function PaymentResultCard({ isSuccess, errorMessage, type }) {
  const [ticket, setTicket] = useState(null);
  // const [payment, setPayment] = useState(null);
  const navi = useNavigate();
  const resetAll = useResetStore();
  const { state } = useLocation();
  const paymentId = state?.paymentId;
  const [room, setRoom] = useState(null);
  const reservation = reservationStore((state) => state.reservation);

  useEffect(() => {
    if (!isSuccess || paymentId == null || type == null) {
      return;
    }

    const fetchPayment = async () => {
      try {
        const payment = await paymentApi.getPayment(paymentId);
        if (type === 'SEAT') {
          const ticket = await ticketApi.getById(payment.ticketId);
          setTicket(ticket);
        } else if (type === 'MEETING_ROOM') {
          const room = await roomApi.getRoomById(reservation.roomId);
          setRoom(room);
        } else {
          throw new Error('이용권이나 스터디룸을 조회할 수 없습니다.');
        }
      } catch (error) {
        console.error('결제 조회 실패:', error.response?.data ?? error.message);
      }
    };

    fetchPayment();
  }, [isSuccess, paymentId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      resetAll();
      navi('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navi, resetAll]);
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

      <h2>{isSuccess ? '결제 완료' : '결제 실패'}</h2>

      <div className="payment_status_container">
        <div className="payment_status_row">
          <span>status</span>
          <span>{isSuccess ? '[결제 성공]' : '[Error!]'}</span>
        </div>
        {isSuccess ? (
          <div className="payment_status_row">
            <span>선택한 이용권</span>
            <span>
              {type === 'SEAT'
                ? ticket?.ticketName
                : type === 'MEETING_ROOM'
                  ? room?.roomName
                  : '-'}
            </span>
          </div>
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
      <p className="payment_timer">10초 후 자동으로 종료됩니다</p>
      <SelectButton
        nextPage={'/'}
        text={'홈으로 돌아가기'}
        onClickAction={resetAll}
      />
    </div>
  );
}
