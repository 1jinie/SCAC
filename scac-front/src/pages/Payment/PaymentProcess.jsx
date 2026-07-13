import { Link, useNavigate } from 'react-router-dom';
import { useTicketStore } from '../../store/ticketStore';
import SeatPayment from './components/SeatPayment';
import WaitingPayment from './components/WaitingPayment';
import { useEffect, useState } from 'react';
import ProceedPayment from './components/ProceedPayment';
import stylesheet from './css/PaymentResult.css';

export default function PaymentProcess() {
  const [isProcessing, setIsProcessing] = useState(false);
  const purchaseType = useTicketStore((state) => state.purchaseType);
  // console.log(purchaseType);
  const navi = useNavigate();
  const handlePay = () => {
    setIsProcessing(true);
  };

  useEffect(() => {
    if (!isProcessing) return;

    const timer = setTimeout(() => {
      // 결제 성공시 navigate('/payment/result/success');
      // 결제 실패시 navigate('/payment/result/fail');
      navi('/payment/result/success');
    }, 5000);

    return () => clearTimeout(timer);
  }, [isProcessing, navi]);

  return (
    <div className="overlay">
      <div className="modal">
        <h2>결제정보 확인</h2>
        {
          // seat면 SeatPayment, 아니면 StudyRoomPayment(아직 안만듦)컴퍼넌트 불러옴
          purchaseType === 'SEAT' ? <SeatPayment /> : ''
        }
        <Link to={'/'}>임시로 만들어둔 Home 링크</Link>
        <br />
        {!isProcessing ? (
          <WaitingPayment handlePay={handlePay} />
        ) : (
          <ProceedPayment />
        )}
      </div>
    </div>
  );
}
