import { formatTicketTime } from '../../../utils/ticket';

export default function AdminTicketList({
  tickets,
  selectedTicket,
  onTicketSelect,
  tab,
}) {
  return (
    <table className="admin_ticket_table">
      <thead>
        <tr>
          <th>이용권명</th>
          <th>종류</th>
          <th>{tab === 'TIME' ? '시간' : '일'}</th>
          <th>가격</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr
            key={ticket.ticketId}
            onClick={() => onTicketSelect(ticket)}
            className={
              selectedTicket?.ticketId === ticket.ticketId ? 'selected' : ''
            }
          >
            <td>{ticket.ticketName}</td>
            <td>{ticket.ticketType}</td>
            <td>{formatTicketTime(ticket.ticketType, ticket.ticketTime)}</td>
            <td>{ticket.ticketPrice.toLocaleString()}원</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
