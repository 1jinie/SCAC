import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentApi } from '../../api/paymentApi';
import './css/KioskCardPayment.css';

export default function KioskCardPayment() {
  const navi = useNavigate();
  const { state } = useLocation();

  const paymentId = state?.paymentId;

  const [status, setStatus] = useState('WAITING');

  useEffect(() => {
    if (!paymentId) {
      navi('/payment/result/fail', {
        replace: true,
        state: {
          message: '결제 정보를 확인할 수 없습니다.',
        },
      });
      return;
    }

    const timer = window.setTimeout(async () => {
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
            message:
              error.response?.data?.message ?? '카드 결제에 실패했습니다.',
          },
        });
      }
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [paymentId, navi]);

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
          <p className="kiosk_payment_wait">
            카드 인식을 기다리고 있습니다
            <span className="waiting_dot">...</span>
          </p>
        ) : (
          <div className="kiosk_payment_processing">
            <div className="payment_spinner" />
          </div>
        )}
      </div>
    </div>
  );
}
