import React from 'react';
import { usePaymentStore } from '../../../store/paymentStore';
import { formatPrice } from '../../../utils/formatter';

export default function StudyRoomPayment() {
  const reserv = {
    roomname: 'R1',
    date: '2026-07-28',
    startTime: '11:00',
    endTime: '13:00',
    price: 15000,
  };
  const paymentMethod = usePaymentStore((state) => state.paymentMethod);

  return (
    <>
      <ul>
        <li>
          <span className="payment_name">선택한 ROOM</span>
          <span className="payment_item">{reserv.roomname}</span>
        </li>
        <li>
          <span className="payment_name">날짜</span>
          <span className="payment_item">{reserv.date}</span>
        </li>
        <li>
          <span className="payment_name">시간</span>
          <span className="payment_item">
            {reserv.startTime} ~ {reserv.endTime}
          </span>
        </li>
        <li>
          <span className="payment_name">결제 수단</span>
          <span className="payment_item">{paymentMethod}</span>
        </li>
        <li>
          <span className="payment_name">최종 가격</span>
          <span className="payment_item">{formatPrice(reserv.price)} 원</span>
        </li>
      </ul>
    </>
  );
}
