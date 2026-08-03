import { useCallback, useEffect, useState } from 'react';
import { ticketApi } from '../../api/ticketApi';
import SelectButton from '../../components/button/SelectButton';
import TicketList from './TicketList';
import './css/TicketPage.css';
import { useNavigate } from 'react-router-dom';
import KioskErrorState from '../../components/common/KioskErrorState';
// import { useTicketStore } from '../../store/ticketStore';

/*
API 조회 중
→ 로딩 문구

API 조회 실패
→ KioskErrorState
→ 다시 시도 / 홈으로 돌아가기

API 성공 + 이용권 0개
→ 현재 구매 가능한 이용권 없음

API 성공 + 이용권 nn개
→ 징기권과 시간권 분류 후 렌더링
*/
export default function TicketPage() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  // const selectTicket = useTicketStore((state) => state.selectTicket);
  const navi = useNavigate();

  //이용권 불러오는 함수
  const fetchTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const ticketList = await ticketApi.getTicketList();

      const activeTicketList = Array.isArray(ticketList)
        ? ticketList.filter((ticket) => ticket.isActive)
        : [];

      setTickets(activeTicketList);
    } catch (error) {
      // 이용권 불러오기 실패
      console.error('이용권 조회 실패:', error.response?.data ?? error);
      setTickets([]);
      setErrorMessage(
        error.response?.data?.message ?? '이용권 정보를 불러오지 못했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  //렌더링
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  //로딩 팝업
  if (isLoading) {
    return (
      <div className="ticket_page_container ticket_page_state">
        <p>이용권 정보를 불러오고 있습니다.</p>
      </div>
    );
  }

  //에러 팝업
  if (errorMessage) {
    return (
      <KioskErrorState
        variant="modal"
        title="이용권 정보를 불러오지 못했습니다."
        message={errorMessage}
        onRetry={fetchTickets}
        onHome={() => navi('/', { replace: true })}
      />
    );
  }

  //fetchTickets로 불러온 이용권을 시간권과 정기권 티켓으로 분류
  const timeTickets = tickets.filter((t) => t.ticketType === 'TIME_PACK');
  const periodTickets = tickets.filter((t) => t.ticketType === 'PERIOD_PACK');

  return (
    <div className="ticket_page_container">
      <h2 className="ticket_page_title">이용권 구매</h2>
      {tickets.length === 0 ? (
        <div className="ticket_page_empty">
          <p>현재 구매 가능한 이용권이 없습니다.</p>
          <span>관리자에게 문의해 주세요.</span>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
