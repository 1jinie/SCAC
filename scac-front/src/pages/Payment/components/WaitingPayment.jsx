import React from 'react';
import CancelButton from '../../../components/button/CancelButton';
import WaitingCard from './WaitingCard';

export default function WaitingPayment({ handlePay }) {
  return (
    <div>
      <WaitingCard />
      <CancelButton text={'결제 취소'} nextPage={'/ticket'} />
      <br />
      <button onClick={() => handlePay()}>임시 결제용 버튼</button>
    </div>
  );
}
