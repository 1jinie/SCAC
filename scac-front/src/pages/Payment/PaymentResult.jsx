import React from 'react';
import PaymentResultCard from './components/PaymentResultCard';

export default function PaymentResult() {
  const isSuccess = true;

  return (
    <div className="overlay">
      <div className="modal">
        <PaymentResultCard isSuccess={isSuccess} />
      </div>
    </div>
  );
}
