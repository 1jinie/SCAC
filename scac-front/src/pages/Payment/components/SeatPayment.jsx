import React from 'react';
import { useTicketStore } from '../../../store/ticketStore';
import { usePaymentStore } from '../../../store/paymentStore';

export default function SeatPayment() {
  const selectTicketId = useTicketStore((state) => state.selectedTicketId);
  const paymentMethod = usePaymentStore((state) => state.paymentMethod);
  // 티켓정보 불러오는거 생략
  const ticket = {
    ticketId: 2,
    ticketName: '2시간권',
    ticketType: 'TIME',
    ticketTime: 120,
    ticketPrice: 4000,
  };

  console.log('SeatPayment');
  return (
    <div>
      <p>
        Seat ticketid : {selectTicketId !== null ? ticket.ticketId : 'null'}
      </p>
      <p>{paymentMethod}</p>
      <p>결제 상품 : {ticket.ticketName}</p>
      {/* <p>상품 종류 : {ticket.ticketType === 'TIME' ? '시간권' : '기간권'}</p> */}
      <p>최종 가격 : {ticket.ticketPrice}</p>
    </div>
  );
}
