import { formatTicketTime } from '../../../utils/ticket';

export default function AdminTicketList({
  tickets,
  selectedTicketId,
  onTicketSelect,
  tab,
}) {
  return (
    <table className="admin_ticket_table">
      <thead>
        <tr>
          <th>이용권명</th>
          <th>종류</th>
          <th>{tab === 'TIME_PACK' ? '시간' : '일'}</th>
          <th>가격</th>
          <th>판매여부</th>
        </tr>
      </thead>
      <tbody>
        {tickets.length === 0 ? (
          <tr>
            <td colSpan="5" className="admin_ticket_empty">
              등록된 이용권이 없습니다.
            </td>
          </tr>
        ) : (
          tickets.map((ticket) => (
            <tr
              key={ticket.ticketId}
              onClick={() => onTicketSelect(ticket.ticketId)}
              className={selectedTicketId === ticket.ticketId ? 'selected' : ''}
            >
              <td>{ticket.ticketName}</td>
              {ticket.ticketType === 'TIME_PACK' ? (
                <>
                  <td>시간권</td>
                  <td>
                    {formatTicketTime(ticket.ticketType, ticket.ticketTime)}
                  </td>
                </>
              ) : (
                <>
                  <td>기간권</td>
                  <td>{ticket.validDays}</td>
                </>
              )}
              <td>{ticket.ticketPrice.toLocaleString()}원</td>
              <td>
                <span
                  className={
                    ticket.isActive
                      ? 'ticket_status active'
                      : 'ticket_status inactive'
                  }
                >
                  {ticket.isActive ? '판매 중' : '판매 중지'}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
