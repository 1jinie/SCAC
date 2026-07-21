import { useEffect, useState } from 'react';
import tickets from '../../data/tickets.json';
import AdminTicketDetail from './components/AdminTicketDetail';
import AdminTicketList from './components/AdminTicketList';
import './css/AdminTicketManagePage.css';

export default function AdminTicketManagePage() {
  const [ticketData, setTicketData] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tab, setTab] = useState('TIME');

  useEffect(() => {
    setTicketData(tickets);
  }, []);

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleReset = () => {
    setSelectedTicket(null);
  };

  const filteredTickets = ticketData.filter(
    (ticket) => ticket.ticketType === tab,
  );

  return (
    <div className="admin_ticket_page">
      <div className="admin_page_heading">
        <div>
          <p className="admin_page_eyebrow">TICKET MANAGEMENT</p>

          <h2>이용권 관리</h2>

          <p>스터디카페 이용권의 종류와 가격 정보를 관리합니다.</p>
        </div>
      </div>
      <section className="admin_ticket_workspace">
        <div className="admin_ticket_list_section">
          <div className="admin_section_header">
            <button className="admin_ticket_add" onClick={handleReset}>
              이용권 등록
            </button>
          </div>
          <div className="ticket_tab">
            <button
              className={tab === 'TIME' ? 'active' : ''}
              onClick={() => setTab('TIME')}
            >
              시간권
            </button>
            <button
              className={tab === 'PERIOD' ? 'active' : ''}
              onClick={() => setTab('PERIOD')}
            >
              정기권
            </button>
          </div>
          <AdminTicketList
            tickets={filteredTickets}
            selectedTicket={selectedTicket}
            onTicketSelect={handleTicketSelect}
            tab={tab}
          />
        </div>
        <AdminTicketDetail
          selectedTicket={selectedTicket}
          ticketData={ticketData}
          setTicketData={setTicketData}
        />
      </section>
    </div>
  );
}
