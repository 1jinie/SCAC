import { useNavigate } from 'react-router-dom';
import CloseButton from '../../components/button/CloseButton';
import { PAYMENT_METHOD } from '../../constants/payment';
import { usePaymentStore } from '../../store/paymentStore';
import './css/PaymentMethod.css';
import { useTicketStore } from '../../store/ticketStore';
import { reservationStore } from '../../store/reservationStore';
import { useResetStore } from '../../hooks/useResetStore';
import { reservationApi } from '../../api/reservationApi';

export default function PaymentMethodPage() {
  const navi = useNavigate();
  const setPaymentMethod = usePaymentStore((state) => state.setPaymentMethod);
  const reservation = reservationStore((state) => state.reservation);
  const { resetPayData } = useResetStore();
  const handleMethod = (method) => {
    setPaymentMethod(method);
    navi(`process`);
  };
  const targetType = useTicketStore((state) => state.targetType);

  const isReservationPayment = targetType === 'MEETING_ROOM';

  const handleCancelPayment = async () => {
    try {
      if (targetType === 'MEETING_ROOM' && reservation.reservationId) {
        await reservationApi.cancelPendingReservation(
          reservation.reservationId,
        );
      }
      resetPayData();
      navi(targetType === 'MEETING_ROOM' ? '/room' : '/ticket', {
        replace: true,
      });
    } catch (error) {
      console.error('결제 대기 예약 취소 실패:', error);

      alert(
        error.response?.data?.message ??
          '예약 취소에 실패했습니다. 다시 시도해 주세요.',
      );
    }
  };
  return (
    <div className="payment_method_box">
      <CloseButton onClose={handleCancelPayment} text="결제취소" />
      <h2 className="payment_method_title">결제 수단 선택</h2>
      <p className="payment_method_text">이용하실 결제 수단을 선택해주세요</p>
      <button
        className="payment_btn credit_card"
        onClick={() => handleMethod(PAYMENT_METHOD.CARD)}
      >
        <img
          src="/icons/payment/credit_card_white.svg"
          alt="카드결제"
          className="payment_method_icon"
        />
        <span className="payment_card">카드결제</span>
        <span className="payment_detail">
          실물 카드를 단말기에 삽입하여 결제
        </span>
        <img
          src="/icons/common/next_black.svg"
          alt="카드결제 선택"
          className="payment_method_next"
        />
      </button>
      <button
        className="payment_btn simple_pay"
        onClick={() => handleMethod(PAYMENT_METHOD.TOSSPAY)}
      >
        <span className="payment_method_icon toss">T</span>

        <span className="payment_card">토스페이</span>

        <span className="payment_detail">토스 앱으로 간편하게 결제</span>

        <img
          src="/icons/common/next_black.svg"
          alt=""
          className="payment_method_next"
        />
      </button>
    </div>
  );
}
