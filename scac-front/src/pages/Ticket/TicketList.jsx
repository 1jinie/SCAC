import React from 'react';
import TicketCard from './components/TicketCard';

export default function TicketList({ tickets }) {
  return (
    <>
      {tickets.map((ticket) => (
        <div key={ticket.ticketId} className="ticket_list_box">
          <TicketCard ticket={ticket} />
        </div>
      ))}
    </>
  );
}
