import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../../api/ticketApi';
import KioskErrorState from '../../components/common/KioskErrorState';
import { useTicketStore } from '../../store/ticketStore';
import TicketList from './TicketList';
import './css/TicketPage.css';
import { ticketusageApi } from '../../api/ticketusageApi';

/*
페이지 진입
→ 판매 중인 이용권 목록 조회
→ 사용자의 사용 가능한 좌석 이용권 보유 여부 조회
→ 두 조회가 모두 끝난 뒤 화면 표시

이용권 미선택
→ 선택 안내 모달

이용권 선택 + 기존 이용권 보유
→ 추가 구매 확인 모달

이용권 선택 + 기존 이용권 없음
→ 결제 화면 이동
*/
export default function TicketPage() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsageLoading, setIsUsageLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [hasAvailableTicket, setHasAvailableTicket] = useState(false);
  const [isUsageConfirmOpen, setIsUsageConfirmOpen] = useState(false);

  const selectedTicketId = useTicketStore((state) => state.selectedTicketId);
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

  //사용자가 이미 구매한 사용가능한 이용권이 있는지 확인
  const checkTicketUsage = useCallback(async () => {
    setIsUsageLoading(true);
    try {
      const exists = await ticketusageApi.isTicketUsage();

      setHasAvailableTicket(Boolean(exists));
    } catch (error) {
      console.error('보유 이용권 조회 실패:', error.response?.data ?? error);
      setErrorMessage(
        error.response?.data?.message ??
          '보유 이용권 정보를 불러오지 못했습니다.',
      );
    } finally {
      setIsUsageLoading(false);
    }
  }, []);

  //이용권 불러오기 실패했을 때 다시시도 버튼 함수
  const handleRetry = () => {
    fetchTickets();
    checkTicketUsage();
  };

  //렌더링
  useEffect(() => {
    fetchTickets();
    checkTicketUsage();
  }, [fetchTickets, checkTicketUsage]);

  //로딩 팝업
  if (isLoading || isUsageLoading) {
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
        variant="page"
        title="이용권 정보를 불러오지 못했습니다."
        message={errorMessage}
        onRetry={handleRetry}
        onHome={() => navi('/', { replace: true })}
      />
    );
  }

  //fetchTickets로 불러온 이용권을 시간권과 정기권으로 분류
  const timeTickets = tickets.filter((t) => t.ticketType === 'TIME_PACK');
  const periodTickets = tickets.filter((t) => t.ticketType === 'PERIOD_PACK');

  //선택한 티켓이 있는지 유무
  const handleIsTicket = () => {
    if (selectedTicketId == null) {
      setIsPopUpOpen(true);
      return;
    }
    if (hasAvailableTicket) {
      setIsUsageConfirmOpen(true);
      return;
    }

    navi('/payment');
  };

  //이미 사용가능한 이용권이 있는 사용자가 계속 구매를 원하면 payment로 보냄
  const handleContinuePurchase = () => {
    setIsUsageConfirmOpen(false);
    navi('/payment');
  };

  return (
    <>
      <div className="ticket_page_container">
        <button type="button" className="back_btn" onClick={() => navi(-1)}>
          <img
            src="/icons/common/next_black.svg"
            alt=""
            className="back_icon"
            aria-hidden="true"
          />
          <span>뒤로가기</span>
        </button>
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

            <button
              type="button"
              className="btn_select"
              onClick={handleIsTicket}
              // disabled={selectedTicketId}
            >
              선택완료
            </button>
          </>
        )}
      </div>
      {isPopUpOpen && (
        <KioskErrorState
          variant="modal"
          title="이용권을 선택해 주세요"
          message="선택한 이용권이 없습니다."
          onClose={() => setIsPopUpOpen(false)}
        />
      )}
      {isUsageConfirmOpen && (
        <KioskErrorState
          variant="modal"
          title="사용 가능한 이용권이 있습니다."
          message="기존 이용권과 별도로 새 이용권을 구매하시겠습니까?"
          onRetry={handleContinuePurchase}
          retryLabel="계속 구매"
          onClose={() => setIsUsageConfirmOpen(false)}
          closeLabel="취소"
        />
      )}
    </>
  );
}
