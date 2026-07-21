import { useEffect, useState } from 'react';

export default function AdminTicketDetail({
  selectedTicket,
  ticketData,
  setTicketData,
}) {
  const emptyTicket = {
    ticketId: '',
    ticketName: '',
    ticketType: 'TIME',
    ticketTime: '',
    ticketPrice: '',
  };

  const [ticket, setTicket] = useState(emptyTicket);

  useEffect(() => {
    if (selectedTicket) {
      setTicket(selectedTicket);
    } else {
      setTicket(emptyTicket);
    }
  }, [selectedTicket]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === 'ticketTime') {
      newValue =
        ticket.ticketType === 'TIME'
          ? Number(value) * 60
          : Number(value) * 24 * 60;
    } else if (name === 'ticketPrice') {
      newValue = Number(value);
    }

    setTicket((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSave = () => {
    if (selectedTicket) {
      setTicketData((prev) =>
        prev.map((item) => (item.ticketId === ticket.ticketId ? ticket : item)),
      );

      alert('수정되었습니다');
    } else {
      setTicketData((prev) => [
        ...prev,
        {
          ...ticket,
          ticketId: prev.length + 1,
        },
      ]);

      alert('등록되었습니다');
      setTicket(emptyTicket);
    }
  };

  const handleDelete = () => {
    if (!selectedTicket) return;

    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    setTicketData((prev) =>
      prev.filter((item) => item.ticketId !== selectedTicket.ticketId),
    );

    setTicket(emptyTicket);
    alert('삭제되었습니다');
  };

  return (
    <div className="admin_ticket_detail">
      <h3>{selectedTicket ? '이용권 수정' : '이용권 등록'}</h3>
      <div className="admin_ticket_form">
        <label>이용권명</label>
        <input
          name="ticketName"
          value={ticket.ticketName}
          onChange={handleChange}
        />
        <label>종류</label>
        <select
          name="ticketType"
          value={ticket.ticketType}
          onChange={handleChange}
        >
          <option value="TIME">시간권</option>
          <option value="PERIOD">기간권</option>
        </select>
        <label>{ticket.ticketType === 'TIME' ? '시간' : '일'}</label>
        <input
          type="number"
          name="ticketTime"
          value={
            ticket.ticketType === 'TIME'
              ? ticket.ticketTime / 60
              : ticket.ticketTime / (24 * 60)
          }
          onChange={handleChange}
        />
        <label>가격</label>
        <input
          type="number"
          name="ticketPrice"
          value={ticket.ticketPrice}
          onChange={handleChange}
        />

        <div className="admin_ticket_button_group">
          <button className="admin_ticket_save" onClick={handleSave}>
            {selectedTicket ? '수정' : '등록'}
          </button>
          {selectedTicket && (
            <button className="admin_ticket_delete" onClick={handleDelete}>
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
