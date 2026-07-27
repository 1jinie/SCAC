import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaymentStore } from '../../store/paymentStore';
import { useTicketStore } from '../../store/ticketStore';
import ProceedPayment from './components/ProceedPayment';
import SeatPayment from './components/SeatPayment';
import StudyRoomPayment from './components/StudyRoomPayment';
import WaitingPayment from './components/WaitingPayment';
import './css/PaymentProcess.css';

export default function PaymentProcess() {
  const paymentMethod = usePaymentStore((state) => state.paymentMethod);
  const [isProcessing, setIsProcessing] = useState(false);
  const targetType = useTicketStore((state) => state.targetType);
  // const selectedTicketId = useTicketStore((state) => state.selectedTicketId);

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

  try {
    // const paymentData = {
    //   ticketId: selectedTicketId,
    //   paymentMethod,
    //   targetType,
    // };
  } catch (error) {}

  // const handlePayPrepare = async () => {
  //   await paymentApi.payPrepare();
  // };

  return (
    <div className="overlay">
      <div className="payment_modal">
        <h2>결제정보 확인</h2>
        <div className="payment_process_box">
          {targetType === 'SEAT' ? (
            <SeatPayment />
          ) : targetType === 'MEETING_ROOM' ? (
            <StudyRoomPayment />
          ) : (
            'Error'
          )}
        </div>
        {!isProcessing ? (
          <WaitingPayment handlePay={handlePay} paymentMethod={paymentMethod} />
        ) : (
          <ProceedPayment paymentMethod={paymentMethod} />
        )}
      </div>
    </div>
  );
}
