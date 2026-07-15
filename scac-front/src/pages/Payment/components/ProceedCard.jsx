import React from 'react';

export default function ProceedCard() {
  return (
    <>
      <div className="payment_proceed_card_box">
        <img
          src="/icons/payment/pay_card_00.svg"
          alt="카드 결제가 진행중"
          className="payment_proceed_card"
        />
        <br />
      </div>
      <p className="payment_proceed_card_ment">
        결제가 완료될 때까지 카드를 빼지 마세요
      </p>
    </>
  );
}
