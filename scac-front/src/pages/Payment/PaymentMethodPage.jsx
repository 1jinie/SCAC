import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaymentStore } from '../../store/paymentStore';
import CancelButton from '../../components/button/CancelButton';
import './css/PaymentMethod.css';

export default function PaymentMethodPage() {
  const navi = useNavigate();
  const setPaymentMethod = usePaymentStore((state) => state.setPaymentMethod);
  const handleMethod = (method) => {
    setPaymentMethod(method);
    console.log(method);
    // navi(`process`);
    navi(`toss`);
  };
  return (
    <div className="payment_method_box">
      <h2 className="payment_method_title">결제 수단 선택</h2>
      <p className="payment_method_text">이용하실 결제 수단을 선택해주세요</p>
      <button
        className="payment_btn credit_card"
        onClick={(e) => handleMethod('CARD')}
      >
        <img
          src="/icons/payment/credit_card_white.svg"
          alt="카드결제"
          className="payment_method_icon"
        />
        <span className="payment_card">카드결제</span>
        <span className="payment_detail">실물 카드 / 삼성페이 / Apple Pay</span>
        <img
          src="/icons/common/next_white.svg"
          alt="카드결제 선택"
          className="payment_method_next"
        />
      </button>
      <button
        className="payment_btn simple_pay"
        onClick={(e) => handleMethod('EASY_PAY')}
      >
        <img
          src="/icons/payment/qrcode.svg"
          alt="간편결제"
          className="payment_method_icon"
        />
        <span className="payment_card">간편결제</span>
        <span className="payment_detail">카카오페이 / 네이버페이</span>
        <img
          src="/icons/common/next_black.svg"
          alt="간편결제 선택"
          className="payment_method_next"
        />
      </button>
      <CancelButton nextPage={'/'} text={'결제 취소'} />
    </div>
  );
}
