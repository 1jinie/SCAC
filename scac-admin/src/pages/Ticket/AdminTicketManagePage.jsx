import { useEffect, useState } from 'react';
import { ticketApi } from '../../api/ticketApi';
import AdminTicketDetail from './components/AdminTicketDetail';
import AdminTicketList from './components/AdminTicketList';
import './css/AdminTicketManagePage.css';

export default function AdminTicketManagePage() {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [tab, setTab] = useState('TIME_PACK');

  const [tickets, setTickets] = useState([]);
  const fetchTickets = async () => {
    try {
      const ticketList = await ticketApi.getTicketList();

      setTickets(ticketList);
    } catch (error) {
      console.error('이용권 목록 조회 실패:', error.response?.data ?? error);
      setTickets([]);
    }
  };
  useEffect(() => {
    fetchTickets();
  }, []);
  const timeTickets = tickets.filter((t) => t.ticketType === 'TIME_PACK');
  const periodTickets = tickets.filter((t) => t.ticketType === 'PERIOD_PACK');
  const selectedTicket =
    tickets.find((ticket) => ticket.ticketId === selectedTicketId) ?? null;
  const handleTicketSelect = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsCreateMode(false);
  };

  const handleReset = () => {
    setSelectedTicketId(null);
    setIsCreateMode(true);
  };

  const handleTicketDeleted = async () => {
    setSelectedTicketId(null);
    setIsCreateMode(false);
    await fetchTickets();
  };

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
            <div>
              <h2>이용권 목록</h2>
              <p>관리할 이용권을 선택해주세요.</p>
            </div>
            <button className="admin_ticket_add" onClick={handleReset}>
              이용권 등록
            </button>
          </div>
          <div className="ticket_tab">
            <button
              className={tab === 'TIME_PACK' ? 'active' : ''}
              onClick={() => setTab('TIME_PACK')}
            >
              시간권
            </button>
            <button
              className={tab === 'PERIOD_PACK' ? 'active' : ''}
              onClick={() => setTab('PERIOD_PACK')}
            >
              기간권
            </button>
          </div>
          <AdminTicketList
            tickets={
              tab === 'TIME_PACK'
                ? timeTickets
                : tab === 'PERIOD_PACK'
                  ? periodTickets
                  : timeTickets
            }
            selectedTicketId={selectedTicketId}
            onTicketSelect={handleTicketSelect}
            tab={tab}
          />
        </div>
        {selectedTicketId || isCreateMode ? (
          <AdminTicketDetail
            selectedTicket={selectedTicket}
            fetchTickets={fetchTickets}
            onTicketDeleted={handleTicketDeleted}
          />
        ) : (
          ''
        )}
      </section>
    </div>
  );
}
