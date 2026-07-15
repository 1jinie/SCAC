import React from 'react';

export default function WaitingSimplePay() {
  return (
    <div className="payment_wait_box">
      <img
        src="/icons/payment/qrcode.svg"
        alt="간편결제를 진행해 주세요"
        className="payment_wait"
      />
      <p className="payment_wait_ment">
        간편 결제를 <br />
        진행해 주세요
      </p>
    </div>
  );
}
