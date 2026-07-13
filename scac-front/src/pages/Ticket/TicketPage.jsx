import React, { useEffect, useState } from 'react';
import TicketList from './TicketList';
import SelectButton from '../../components/button/SelectButton';
import { useTicketStore } from '../../store/ticketStore';
import { ticketApi } from '../../api/ticketApi';
// import stylesheet from './css/TicketPage.css';

export default function TicketPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    console.log('test');
    const fetchTickets = async () => {
      await ticketApi.getTicketList().then((res) => {
        setTickets(res);
      });
    };
    fetchTickets();
    // console.log(tickets);
  }, []);

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
      <SelectButton nextPage={`/payment`} text={'선택완료'} />
    </div>
  );
}
