import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/KioskCardPayment.css';
import { paymentApi } from '../../api/paymentApi';

export default function KioskCardPayment() {
  const navi = useNavigate();
  const { state } = useLocation();

  const paymentId = state?.paymentId;

  const [status, setStatus] = useState('WAITING');

  const handleMockCardInsert = async () => {
    if (status !== 'WAITING') {
      return;
    }

    try {
      setStatus('PROCESSING');
      const result = await paymentApi.mockConfirmPayment(paymentId);
      navi('/payment/result/success', {
        replace: true,
        state: {
          paymentId: result.paymentId,
        },
      });
    } catch (error) {
      navi('/payment/result/fail', {
        replace: true,
        state: {
          message: error.response?.data?.message ?? '카드 결제에 실패했습니다.',
        },
      });
    }
  };

  return (
    <div className="overlay">
      <div className="kiosk_payment_modal">
        <div className="kiosk_card_icon">
          <img src="/icons/payment/credit_card_white.svg" alt="카드 결제" />
        </div>

        {status === 'WAITING' ? (
          <>
            <h2>카드를 넣어주세요</h2>

            <p className="kiosk_payment_guide">
              IC칩이 위를 향하도록
              <br />
              카드를 끝까지 넣어주세요.
            </p>
          </>
        ) : (
          <>
            <h2>결제를 처리하고 있습니다</h2>

            <p className="kiosk_payment_guide">
              카드를 빼지 마세요.
              <br />
              잠시만 기다려 주세요.
            </p>
          </>
        )}

        <div className="kiosk_card_reader">
          <div className="card_slot" />

          <div
            className={`card_mock ${
              status === 'PROCESSING' ? 'card_inserted' : ''
            }`}
          >
            <span>SCAC</span>
          </div>
        </div>

        {status === 'WAITING' ? (
          <>
            <p className="kiosk_payment_wait">
              카드 인식을 기다리고 있습니다
              <span className="waiting_dot">...</span>
            </p>

            <button
              type="button"
              onClick={handleMockCardInsert}
              className="mock_card_button"
            >
              Mock 카드 삽입
            </button>
          </>
        ) : (
          <div className="kiosk_payment_processing">
            <div className="payment_spinner" />
          </div>
        )}
      </div>
    </div>
  );
}
