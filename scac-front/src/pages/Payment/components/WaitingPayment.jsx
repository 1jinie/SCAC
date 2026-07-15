import React from 'react';
import CancelButton from '../../../components/button/CancelButton';
import WaitingCard from './WaitingCard';
import WaitingSimplePay from './WaitingSimplePay';
import { useNavigate } from 'react-router-dom';

export default function WaitingPayment({ handlePay, paymentMethod }) {
  const navi = useNavigate();
  return (
    <div>
      {paymentMethod === 'CARD' ? (
        <WaitingCard />
      ) : paymentMethod === 'SIMPLE' ? (
        <WaitingSimplePay />
      ) : (
        navi('/payment')
      )}

      <CancelButton text={'결제 취소'} nextPage={'/ticket'} />
      <br />
      <button onClick={() => handlePay()}>임시 결제용 버튼</button>
    </div>
  );
}
