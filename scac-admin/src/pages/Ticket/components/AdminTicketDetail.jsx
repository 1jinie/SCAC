import { useEffect, useState } from 'react';
import { ticketApi } from '../../../api/ticketApi';

const EMPTY_TICKET = {
  ticketId: null,
  ticketName: '',
  ticketType: 'TIME_PACK',
  ticketTime: '',
  validDays: '',
  ticketPrice: '',
  isActive: true,
};

export default function AdminTicketDetail({
  selectedTicket,

  fetchTickets,
  onTicketDeleted,
}) {
  const [ticket, setTicket] = useState(EMPTY_TICKET);

  useEffect(() => {
    setTicket(selectedTicket ? { ...selectedTicket } : { ...EMPTY_TICKET });
  }, [selectedTicket]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setTicket((prev) => {
      if (name === 'ticketType') {
        return {
          ...prev,
          ticketType: value,
          ticketTime: '',
          validDays: '',
        };
      }

      if (name === 'ticketTime') {
        return {
          ...prev,
          ticketTime: value === '' ? '' : Number(value) * 60,
        };
      }

      if (name === 'validDays' || name === 'ticketPrice') {
        return {
          ...prev,
          [name]: value === '' ? '' : Number(value),
        };
      }

      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  };

  const handleStatusChange = async (e) => {
    const isActive = e.target.checked;

    try {
      await ticketApi.updateTicketStatus(ticket.ticketId, isActive);

      setTicket((prev) => ({
        ...prev,
        isActive,
      }));

      await fetchTickets();

      alert(
        isActive
          ? '이용권 판매를 시작했습니다.'
          : '이용권 판매를 중지했습니다.',
      );
    } catch (error) {
      console.error(
        '이용권 판매 상태 변경 실패:',
        error.response?.data ?? error,
      );

      alert(
        error.response?.data?.message ??
          '이용권 판매 상태 변경에 실패했습니다.',
      );
    }
  };

  const handleSave = async () => {
    if (!ticket.ticketName.trim()) {
      alert('이용권명을 입력해주세요.');
      return;
    }

    if (ticket.ticketPrice === '') {
      alert('가격을 입력해주세요.');
      return;
    }

    if (ticket.ticketType === 'TIME_PACK' && ticket.ticketTime === '') {
      alert('시간을 입력해주세요.');
      return;
    }

    if (ticket.ticketType === 'PERIOD_PACK' && ticket.validDays === '') {
      alert('기간을 입력해주세요.');
      return;
    }

    const savedTicket =
      ticket.ticketType === 'TIME_PACK'
        ? { ...ticket, validDays: null, targetType: 'SEAT' }
        : { ...ticket, ticketTime: null, targetType: 'SEAT' };

    if (selectedTicket) {
      try {
        await ticketApi.updateTicket(savedTicket.ticketId, savedTicket);
        alert('수정되었습니다.');
        await fetchTickets();
      } catch (error) {
        alert('수정에 실패했습니다.');
        console.error(
          '이용권 수정 실패:',
          error.response?.data.message ?? error,
        );
      }
    } else {
      try {
        await ticketApi.createTicket(savedTicket);
        alert('등록되었습니다.');
        setTicket(EMPTY_TICKET);
        await fetchTickets();
      } catch (error) {
        alert('등록에 실패했습니다.');
        console.error(
          '이용권 등록 실패:',
          error.response?.data.message ?? error,
        );
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedTicket) {
      return;
    }

    const confirmed = window.confirm('정말 삭제하시겠습니까?');

    if (!confirmed) {
      return;
    }

    try {
      await ticketApi.deleteTicket(selectedTicket.ticketId);

      alert('삭제되었습니다.');

      await onTicketDeleted();
    } catch (error) {
      console.error('이용권 삭제 실패:', error.response?.data ?? error);

      alert(error.response?.data?.message ?? '이용권 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="admin_ticket_detail">
      <h3>{selectedTicket ? '이용권 수정' : '이용권 등록'}</h3>

      <div className="admin_ticket_form">
        <label htmlFor="ticketName">이용권명</label>
        <input
          id="ticketName"
          name="ticketName"
          value={ticket.ticketName}
          onChange={handleChange}
        />

        <label htmlFor="ticketType">종류</label>
        <select
          id="ticketType"
          name="ticketType"
          value={ticket.ticketType}
          onChange={handleChange}
        >
          <option value="TIME_PACK">시간권</option>
          <option value="PERIOD_PACK">기간권</option>
        </select>

        {ticket.ticketType === 'TIME_PACK' ? (
          <>
            <label htmlFor="ticketTime">시간</label>
            <input
              id="ticketTime"
              type="number"
              name="ticketTime"
              min="1"
              value={ticket.ticketTime === '' ? '' : ticket.ticketTime / 60}
              onChange={handleChange}
            />
          </>
        ) : (
          <>
            <label htmlFor="validDays">일수</label>
            <input
              id="validDays"
              type="number"
              name="validDays"
              min="1"
              value={ticket.validDays ?? ''}
              onChange={handleChange}
            />
          </>
        )}

        <label htmlFor="ticketPrice">가격</label>
        <input
          id="ticketPrice"
          type="number"
          name="ticketPrice"
          min="0"
          value={ticket.ticketPrice}
          onChange={handleChange}
        />

        {selectedTicket && (
          <div className="admin_ticket_active_field">
            <span className="admin_ticket_active_label">판매 여부</span>

            <label className="admin_ticket_checkbox">
              <input
                type="checkbox"
                name="isActive"
                checked={ticket.isActive}
                onChange={handleStatusChange}
              />

              <span className="admin_ticket_checkbox_box" aria-hidden="true" />
              <span className="admin_ticket_checkbox_text">
                {ticket.isActive ? '판매 중' : '판매 중지'}
              </span>
            </label>
          </div>
        )}

        <div className="admin_ticket_button_group">
          <button
            type="button"
            className="admin_ticket_save"
            onClick={handleSave}
          >
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
