import React, { useEffect, useState } from 'react';
import { useTicketStore } from '../../../store/ticketStore';
import { ticketApi } from '../../../api/ticketApi';
import SelectButton from '../../../components/button/SelectButton';
import { useNavigate } from 'react-router-dom';
import { useResetStore } from '../../../hooks/useResetStore';

export default function PaymentResultCard({ isSuccess, errorMessage }) {
  const ticketId = useTicketStore((state) => state.selectedTicketId);
  const purchaseType = useTicketStore((state) => state.purchaseType);
  const [ticket, setTicket] = useState();
  const navi = useNavigate();
  const resetAll = useResetStore();

  //purchaseType === 'SEAT' 이면 좌석 결제 정보 가져오고 'STUDY_ROOM' 이면 스터디룸 결제 정보 가져올 예정
  useEffect(() => {
    const fetchTicket = async () => {
      const res = await ticketApi.getById(ticketId);
      setTicket(res);
    };

    fetchTicket();
  }, [ticketId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('resetAll');
      resetAll();
      navi('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navi, resetAll]);
  return (
    <div className={`payment_status_box ${isSuccess ? 'success' : 'fail'}`}>
      <img
        src={
          isSuccess
            ? '/icons/common/check_circle.svg'
            : '/icons/common/caution.svg'
        }
        alt={isSuccess ? '결제 성공' : '결제 실패'}
        className="payment_result_icon"
      />

      <h2>{isSuccess ? '결제 완료' : '결제 실패'}</h2>

      <div className="payment_status_container">
        <div className="payment_status_row">
          <span>status</span>
          <span>{isSuccess ? '[결제 성공]' : '[Error!]'}</span>
        </div>
        {isSuccess ? (
          <div className="payment_status_row">
            <span>선택한 이용권</span>
            <span>
              {ticket?.ticketName}&nbsp;
              {ticket?.ticketType === 'TIME' ? '시간권' : '기간권'}
            </span>
          </div>
        ) : (
          <div className="payment_status_row">
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {isSuccess ? (
        <p className="payment_message">
          결제가 완료되었습니다.
          <br />
          영수증을 확인해 주세요.
        </p>
      ) : (
        <p className="payment_message">
          결제가 실패하였습니다.
          <br />
          다시 확인해 주세요.
        </p>
      )}
      <p className="payment_timer">10초 후 자동으로 종료됩니다</p>
      <SelectButton
        nextPage={'/'}
        text={'홈으로 돌아가기'}
        onClickAction={resetAll}
      />
    </div>
  );
}
