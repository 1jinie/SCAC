import React from 'react';

export default function TicketPaymentResult({ ticket, payment }) {
  return (
    <>
      <div className="payment_status_row">
        <span>결제 대상</span>
        <span>좌석 이용권</span>
      </div>

      <div className="payment_status_row">
        <span>이용권</span>
        <span>{ticket?.ticketName ?? '-'}</span>
      </div>

      <div className="payment_status_row">
        <span>결제 금액</span>
        <span>{payment?.amount?.toLocaleString() ?? 0}원</span>
      </div>
    </>
  );
}
