import React from 'react';
import ProceedCard from './ProceedCard';
import { usePaymentStore } from '../../../store/paymentStore';
import ProceedSimplePay from './ProceedSimplePay';
import { useNavigate } from 'react-router-dom';

export default function ProceedPayment({ paymentMethod }) {
  const navi = useNavigate();
  return (
    <div className="payment_proceed">
      {paymentMethod === 'CARD' ? (
        <ProceedCard />
      ) : paymentMethod === 'SIMPLE' ? (
        <ProceedSimplePay />
      ) : (
        navi('/payment')
      )}

      <div className="payment_spinner" aria-label="결제 진행 중" />
      <p className="payment_proceed_ment">결제가 진행 중입니다</p>
      <p className="payment_proceed_subment">잠시만 기다려 주세요</p>
    </div>
  );
}
