import React from 'react';
import SeatPayment from './components/SeatPayment';
import { useTicketStore } from '../../store/ticketStore';
import { Link, useNavigate } from 'react-router-dom';

export default function PaymentProcess() {
  const purchaseType = useTicketStore((state) => state.purchaseType);
  console.log(purchaseType);
  const navi = useNavigate();
  return (
    <div>
      <h2>결제정보 확인</h2>
      {
        // seat면 SeatPayment, 아니면 StudyRoomPayment(아직 안만듦)컴퍼넌트 불러옴
        purchaseType === 'SEAT' ? <SeatPayment /> : ''
      }
      <Link to={'/'}>임시로 만들어둔 Home 링크</Link>
    </div>
  );
}
