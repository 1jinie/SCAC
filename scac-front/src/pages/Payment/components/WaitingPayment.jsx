import React from 'react';
import CancelButton from '../../../components/button/CancelButton';

export default function WaitingPayment({ handlePay }) {
  return (
    <div>
      <button onClick={() => handlePay()}>임시로 만들어둔 결제진행버튼</button>
      <p>결제를 진행해 주세요</p>
      <br />
      <CancelButton text={'결제 취소'} nextPage={'/ticket'} />
    </div>
  );
}
