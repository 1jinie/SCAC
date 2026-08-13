import React from 'react';

export default function ReservationPaymentResult({ reservation, payment }) {
  return (
    <div className="reservation_payment_result">
      <div className="reservation_result_title">스터디룸 예약</div>

      <div className="reservation_result_datetime">
        <strong>{reservation?.reservationDate ?? '-'}</strong>
        <span>
          {reservation
            ? `${reservation.startHour}:00 ~ ${reservation.endHour}:00`
            : '-'}
        </span>
      </div>

      <div className="reservation_result_amount">
        <span>결제 금액</span>
        <strong>{payment?.amount?.toLocaleString() ?? 0}원</strong>
      </div>
    </div>
  );
}
