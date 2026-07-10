import React, { useEffect, useState } from 'react';
import TicketList from './TicketList';
import SelectButton from '../../components/button/SelectButton';
import { useTicketStore } from '../../store/ticketStore';
// import stylesheet from './css/TicketPage.css';

export default function TicketPage() {
  // const [tickets, setTickets] = useState([]);

  // useEffect(() => {
  //   setTickets(testtickets);
  // }, []);
  const [tickets] = useState([
    {
      ticketId: 0,
      ticketName: '2시간권',
      ticketType: 'TIME',
      ticketTime: 120,
      ticketPrice: 4000,
    },
    {
      ticketId: 1,
      ticketName: '4시간',
      ticketType: 'TIME',
      ticketTime: 240,
      ticketPrice: 8000,
    },
    {
      ticketId: 2,
      ticketName: '6시간',
      ticketType: 'TIME',
      ticketTime: 60 * 6,
      ticketPrice: 8000,
    },
    {
      ticketId: 3,
      ticketName: '9시간',
      ticketType: 'TIME',
      ticketTime: 60 * 9,
      ticketPrice: 8000,
    },
    {
      ticketId: 4,
      ticketName: '12시간',
      ticketType: 'TIME',
      ticketTime: 60 * 12,
      ticketPrice: 8000,
    },
    {
      ticketId: 5,
      ticketName: '24시간',
      ticketType: 'TIME',
      ticketTime: 60 * 24,
      ticketPrice: 8000,
    },
    {
      ticketId: 6,
      ticketName: '50시간',
      ticketType: 'TIME',
      ticketTime: 60 * 50,
      ticketPrice: 8000,
    },
    {
      ticketId: 7,
      ticketName: '100시간',
      ticketType: 'TIME',
      ticketTime: 60 * 100,
      ticketPrice: 8000,
    },
    {
      ticketId: 8,
      ticketName: '3일',
      ticketType: 'PERIOD',
      ticketTime: 60 * 24 * 3,
      ticketPrice: 30000,
    },
    {
      ticketId: 9,
      ticketName: '7일',
      ticketType: 'PERIOD',
      ticketTime: 60 * 24 * 7,
      ticketPrice: 180000,
    },
    {
      ticketId: 10,
      ticketName: '14일',
      ticketType: 'PERIOD',
      ticketTime: 60 * 24 * 14,
      ticketPrice: 180000,
    },
    {
      ticketId: 11,
      ticketName: '30일',
      ticketType: 'PERIOD',
      ticketTime: 60 * 24 * 30,
      ticketPrice: 180000,
    },
    {
      ticketId: 12,
      ticketName: '60일',
      ticketType: 'PERIOD',
      ticketTime: 60 * 24 * 60,
      ticketPrice: 180000,
    },
    {
      ticketId: 13,
      ticketName: '120일',
      ticketType: 'PERIOD',
      ticketTime: 60 * 24 * 120,
      ticketPrice: 180000,
    },
  ]);

  const timeTickets = tickets.filter((t) => t.ticketType === 'TIME');
  const periodTickets = tickets.filter((t) => t.ticketType === 'PERIOD');

  return (
    <div className="ticket_page_box">
      <h2 className="ticket_page_title">이용권 구매</h2>
      <section className="ticket_list">
        <h3 className="ticket_type">시간권</h3>
        <TicketList tickets={timeTickets} />
      </section>

      <section className="ticket_list">
        <h3 className="ticket_type">정기권 &#40;기간선택&#41;</h3>
        <TicketList tickets={periodTickets} />
      </section>
      <SelectButton nextPage={`/payment`} />
    </div>
  );
}
