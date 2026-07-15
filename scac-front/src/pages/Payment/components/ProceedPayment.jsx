import React from 'react';
import ProceedCard from './ProceedCard';

export default function ProceedPayment() {
  return (
    <div className="payment_proceed">
      <ProceedCard />
      <div className="payment_spinner" aria-label="결제 진행 중" />
      <p className="payment_proceed_ment">결제가 진행 중입니다</p>
      <p className="payment_proceed_subment">잠시만 기다려 주세요</p>
    </div>
  );
}
