import { PAYMENT_METHOD_LABEL } from '../../../constants/payment';
import { usePaymentStore } from '../../../store/paymentStore';
import { formatPrice } from '../../../utils/formatter';

export default function StudyRoomPayment({ room, reservation }) {
  const paymentMethod = usePaymentStore((state) => state.paymentMethod);
  const amount =
    (reservation.endTime - reservation.startTime) * room.hourlyRate;

  return (
    <>
      <ul>
        <li>
          <span className="payment_name">선택한 ROOM</span>
          <span className="payment_item">{room.roomName}</span>
        </li>
        <li>
          <span className="payment_name">날짜</span>
          <span className="payment_item">{room.date}</span>
        </li>
        <li>
          <span className="payment_name">시간</span>
          <span className="payment_item">
            {reservation.startTime} ~ {reservation.endTime}
          </span>
        </li>
        <li>
          <span className="payment_name">결제 수단</span>
          <span className="payment_item">
            {PAYMENT_METHOD_LABEL[paymentMethod]}
          </span>
        </li>
        <li>
          <span className="payment_name">최종 가격</span>
          <span className="payment_item">{formatPrice(amount)} 원</span>
        </li>
      </ul>
    </>
  );
}
