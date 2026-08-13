import React from 'react';
import PaymentResultCard from './components/PaymentResultCard';
import { useLocation, useParams } from 'react-router-dom';
import './css/PaymentResult.css';
import { usePaymentStore } from '../../store/paymentStore';

export default function PaymentResult() {
  const { status } = useParams();
  const { state } = useLocation();
  const isSuccess = status === 'success';
  const type = usePaymentStore((state) => state.type);

  return (
    <div className="overlay">
      <div className="modal">
        <PaymentResultCard
          isSuccess={isSuccess}
          errorMessage={state?.message}
          type={type}
        />
      </div>
    </div>
  );
}
