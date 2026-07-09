import React from 'react';
import { useTicketStore } from '../../../store/ticketStore';

export default function TicketCard({ ticket }) {
  const selectTicket = useTicketStore((state) => state.selectTicket);
  return (
    <button
      className={`btn_ticket ${selectTicket ? 'active' : ''}`}
      onClick={() => selectTicket(ticket.ticketId)}
    >
      <span className="ticket_name">{ticket.ticketName}</span>
      <br />
      <span className="ticket_price">{ticket.ticketPrice} 원</span>
    </button>
  );
}
