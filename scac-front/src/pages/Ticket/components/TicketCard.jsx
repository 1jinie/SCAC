import { useTicketStore } from '../../../store/ticketStore';

export default function TicketCard({ ticket }) {
  const { ticketId, ticketName, ticketPrice } = ticket;
  const selectTicket = useTicketStore((state) => state.selectTicket);
  const selectedTicketId = useTicketStore((state) => state.selectedTicketId);
  const setPurchaseType = useTicketStore((state) => state.setPurchaseType);

  const onSelect = () => {
    console.log(ticketId);
    selectTicket(ticketId);
    setPurchaseType('SEAT');
  };

  return (
    <button
      className={`btn_ticket ${ticketId === selectedTicketId ? 'selected' : ''}`}
      onClick={() => onSelect()}
    >
      <span className="ticket_name">{ticketName}</span>
      <br />
      <span className="ticket_price">{ticketPrice} 원</span>
    </button>
  );
}
