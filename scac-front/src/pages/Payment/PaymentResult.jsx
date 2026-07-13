import React from 'react';
import PaymentResultCard from './components/PaymentResultCard';
import { useParams } from 'react-router-dom';

export default function PaymentResult() {
  const { status } = useParams();
  const isSuccess = status === 'success';

  return (
    <div className="overlay">
      <div className="modal">
        <PaymentResultCard isSuccess={isSuccess} />
      </div>
    </div>
  );
}
