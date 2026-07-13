import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaymentStore } from '../../store/paymentStore';

export default function PaymentMethodPage() {
  const navi = useNavigate();
  const setPaymentMethod = usePaymentStore((state) => state.setPaymentMethod);
  const handleMethod = (method) => {
    setPaymentMethod(method);
    console.log(method);
    navi(`process`);
  };
  return (
    <div>
      <h2>결제 수단 선택</h2>
      <p>이용하실 결제 수단을 선택해주세요</p>
      <button
        className="payment_btn credit_card"
        onClick={(e) => handleMethod('CARD')}
      >
        카드결제
      </button>
      <button
        className="payment_btn simple_pay"
        id="SIMPLE"
        onClick={(e) => handleMethod('SIMPLE')}
      >
        간편결제
      </button>
    </div>
  );
}
