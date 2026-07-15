import React from 'react';

export default function WaitingCard() {
  return (
    <div className="payment_wait_card_box">
      <img
        src="/icons/payment/pay_card_00.svg"
        alt="카드를 넣어주세요"
        className="payment_wait_card"
      />
      <p className="payment_wait_card_ment">카드를 넣어주세요</p>
    </div>
  );
}
