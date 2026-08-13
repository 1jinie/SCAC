import { PAYMENT_METHOD_LABEL } from '../../../constants/payment';
import { usePaymentStore } from '../../../store/paymentStore';
import { formatPrice } from '../../../utils/formatter';

export default function StudyRoomPayment({ room, reservation }) {
  const paymentMethod = usePaymentStore((state) => state.paymentMethod);

  if (!room || !reservation) {
    return <p>스터디룸 예약 정보를 확인할 수 없습니다.</p>;
  }

  const amount =
    (reservation.endHour - reservation.startHour) * room.hourlyRate;

  return (
    <>
      <ul>
        <li>
          <span className="payment_name">선택한 ROOM</span>
          <span className="payment_item">{room.name}</span>
        </li>
        <li>
          <span className="payment_name">날짜</span>
          <span className="payment_item">{reservation.reservationDate}</span>
        </li>
        <li>
          <span className="payment_name">시간</span>
          <span className="payment_item">
            {reservation.startHour}:00 ~ {reservation.endHour}:00
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
