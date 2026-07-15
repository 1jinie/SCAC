import React, { useEffect, useState } from 'react';
import { useTicketStore } from '../../../store/ticketStore';
import { usePaymentStore } from '../../../store/paymentStore';
import { ticketApi } from '../../../api/ticketApi';
import { formatPrice } from '../../../utils/formatter';

export default function SeatPayment() {
  const selectTicketId = useTicketStore((state) => state.selectedTicketId);
  const paymentMethod = usePaymentStore((state) => state.paymentMethod);

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
    <>
      <ul>
        <li>
          <span className="payment_name">결제 상품</span>
          <span className="payment_item">
            {ticket.ticketName}{' '}
            {ticket.ticketType === 'TIME'
              ? '시간권'
              : ticket.ticketType === 'PERIOD'
                ? '기간권'
                : ''}
          </span>
        </li>
        <li>
          <span className="payment_name">결제 수단</span>
          <span className="payment_item">{paymentMethod}</span>
        </li>
        <li>
          <span className="payment_name">최종 가격</span>
          <span className="payment_item">
            {formatPrice(ticket.ticketPrice)}
          </span>
        </li>
      </ul>
    </>
  );
}
