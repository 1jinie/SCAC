import { useEffect, useState } from 'react';
import { ticketApi } from '../../api/ticketApi';
import SelectButton from '../../components/button/SelectButton';
import TicketList from './TicketList';
import './css/TicketPage.css';

export default function TicketPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketList = await ticketApi.getTicketList();
        setTickets(Array.isArray(ticketList) ? ticketList : []);
        console.log('sdf' + ticketList);
      } catch (error) {
        console.error('이용권 조회 실패:', error);
        setTickets([]);
      }
    };

    fetchTickets();
  }, []);

  const timeTickets = tickets.filter((t) => t.ticketType === 'TIME_PACK');
  const periodTickets = tickets.filter((t) => t.ticketType === 'PERIOD_PACK');

  return (
    <div className="ticket_page_container">
      <h2 className="ticket_page_title">이용권 구매</h2>
      <section className="ticket_list_container">
        <h3 className="ticket_type">
          <img
            src="/icons/common/clock.svg"
            alt="시간권 이용권"
            className="ticket_type_icon"
          />
          <span>시간권</span>
        </h3>
        <TicketList tickets={timeTickets} />
      </section>

      <section className="ticket_list_container">
        <h3 className="ticket_type">
          <img
            src="/icons/common/calendar.svg"
            alt="정기권 이용권"
            className="ticket_type_icon"
          />
          <span>정기권 &#40;기간선택&#41;</span>
        </h3>
        <TicketList tickets={periodTickets} />
      </section>
      <SelectButton nextPage={`/payment`} text={'선택완료'} />
    </div>
  );
}
