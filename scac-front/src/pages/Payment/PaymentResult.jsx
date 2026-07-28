import React from 'react';
import PaymentResultCard from './components/PaymentResultCard';
import { useLocation, useParams } from 'react-router-dom';
import './css/PaymentResult.css';

export default function PaymentResult() {
  const { status } = useParams();
  const { state } = useLocation();
  const isSuccess = status === 'success';

  return (
    <div className="overlay">
      <div className="modal">
        <PaymentResultCard
          isSuccess={isSuccess}
          errorMessage={state?.message}
        />
      </div>
    </div>
  );
}
