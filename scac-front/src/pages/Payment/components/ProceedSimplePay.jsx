import React from 'react';

export default function ProceedSimplePay() {
  return (
    <>
      <div className="payment_proceed_box">
        <img
          src="/icons/payment/qrcode.svg"
          alt="간편 결제가 진행중"
          className="payment_proceed_icon"
        />
        <br />
      </div>
    </>
  );
}
