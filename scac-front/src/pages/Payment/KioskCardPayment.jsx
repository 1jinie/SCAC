import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/KioskCardPayment.css';

export default function KioskCardPayment() {
  const navi = useNavigate();

  const [status, setStatus] = useState('WAITING');

  const handleMockCardInsert = () => {
    if (status !== 'WAITING') {
      return;
    }

    setStatus('PROCESSING');
    // 실제 서비스에서는 카드 단말기/VAN 승인 결과를 받아
    // Payment 승인 및 이용권 발급 로직을 호출
    // setTimeout(() => {
    //   navi('/payment/result/success');
    // }, 2000);
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
