import React, { useEffect, useState } from 'react';
import { useTicketStore } from '../../../store/ticketStore';
import { usePaymentStore } from '../../../store/paymentStore';
import { ticketApi } from '../../../api/ticketApi';

export default function SeatPayment() {
  const selectTicketId = useTicketStore((state) => state.selectedTicketId);
  const paymentMethod = usePaymentStore((state) => state.paymentMethod);
  // 티켓정보 불러오는거 생략
  const [ticket, setTicket] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      await ticketApi.getById(selectTicketId).then((res) => {
        setTicket(res);
      });
    };
    fetchTickets();
    // console.log(ticket);
  }, []);

  console.log('SeatPayment');
  return (
    <div>
      <p>
        Seat ticketid : {selectTicketId !== null ? ticket.ticketId : 'null'}
      </p>
      <p>{paymentMethod}</p>
      <p>
        결제 상품 : {ticket.ticketName}{' '}
        {ticket.ticketType === 'TIME' ? '시간권' : '기간권'}
      </p>
      {/* <p>상품 종류 : </p> */}
      <p>최종 가격 : {ticket.ticketPrice}</p>
    </div>
  );
}
