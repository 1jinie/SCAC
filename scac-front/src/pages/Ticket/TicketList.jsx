import React from 'react';
import TicketCard from './components/TicketCard';

export default function TicketList({ tickets }) {
  return (
    <>
      {tickets.map((ticket) => (
        <div key={ticket.ticketId}>
          <TicketCard ticket={ticket} />
        </div>
      ))}
    </>
  );
}
