import React, { useState } from 'react';
import { useTicketStore } from '../../../store/ticketStore';
import { ticketApi } from '../../../api/ticketApi';

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
          {/* <SuccessIcon /> */}
          <h2>결제 완료</h2>

          {/* <StatusCard> */}
          <p>[결제 성공]</p>
          {/* <p>{ticket.ticketName}</p> */}
          {/* </StatusCard> */}

          <p>
            결제가 완료되었습니다.
            <br />
            영수증을 확인해 주세요.
          </p>
        </>
      ) : (
        <>
          {/* <ErrorIcon /> */}
          <h2>결제 실패</h2>

          {/* <StatusCard> */}
          <p>[Error!]</p>
          <p>{errorMessage}</p>
          {/* </StatusCard> */}

          <p>
            결제가 실패하였습니다.
            <br />
            다시 한번 확인해 주세요.
          </p>
        </>
      )}
    </>
  );
}
