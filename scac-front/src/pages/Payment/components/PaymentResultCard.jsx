import React, { useState } from 'react';
import { useTicketStore } from '../../../store/ticketStore';
import { ticketApi } from '../../../api/ticketApi';
import SelectButton from '../../../components/button/SelectButton';

export default function PaymentResultCard({ isSuccess, errorMessage }) {
  const ticketId = useTicketStore((state) => state.selectedTicketId);
  const [ticket, setTicket] = useState();
  const getTicket = async () => {
    ticketApi.getById(ticketId).then((res) => setTicket(res));
  };
  return (
    <>
      {isSuccess ? (
        <>
          <img
            src="/icons/common/check_circle.svg"
            alt="결제 성공"
            className="payment_result_icon"
          />
          <h2>결제 완료</h2>

          <p>[결제 성공]</p>
          {/* <p>{ticket.ticketName}</p> */}

          <p>
            결제가 완료되었습니다.
            <br />
            영수증을 확인해 주세요.
          </p>
        </>
      ) : (
        <>
          <img
            src="/icons/common/caution.svg"
            alt="결제 실패"
            className="payment_result_icon"
          />
          <h2>결제 실패</h2>

          <p>[Error!]</p>
          <p>{errorMessage}</p>

          <p>
            결제가 실패하였습니다.
            <br />
            다시 한번 확인해 주세요.
          </p>
        </>
      )}
      <p>5초 후 자동으로 종료됩니다</p>
      <SelectButton nextPage={'/'} text={'홈으로 돌아가기'} />
    </>
  );
}
