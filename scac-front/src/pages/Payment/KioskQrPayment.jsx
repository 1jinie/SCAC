// import { QRCodeSVG } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';

const PUBLIC_ORIGIN =
  process.env.REACT_APP_PUBLIC_ORIGIN || window.location.origin;

export default function KioskQrPayment() {
  const { state } = useLocation();
  const navi = useNavigate();

  const paymentId = state?.paymentId;
  const amount = state?.amount;

  if (!paymentId) {
    return (
      <div className="overlay">
        <div className="kiosk_payment_modal">
          <p>결제 정보를 확인할 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const mobilePayUrl =
    `${PUBLIC_ORIGIN}/payment/mobile/mock` +
    `?paymentId=${encodeURIComponent(paymentId)}` +
    `&amount=${encodeURIComponent(amount)}`;
  console.log('QR URL:', mobilePayUrl);

  return (
    <div className="overlay">
      <div className="kiosk_payment_modal">
        <div className="kiosk_qr_icon">N</div>

        <h2>QR을 스캔해 주세요</h2>

        <p className="kiosk_payment_guide">
          휴대폰 카메라로 QR을 스캔한 후
          <br />
          결제를 진행해 주세요.
        </p>

        {/* <div className="kiosk_qr_box">
          <QRCodeSVG value={mobilePayUrl} size={320} level="H" />
        </div> */}

        <div className="kiosk_qr_amount">
          <span>결제 금액</span>
          <strong>{Number(amount).toLocaleString()}원</strong>
        </div>

        <p className="kiosk_payment_wait">
          네이버페이 결제를 기다리고 있습니다
          <span className="waiting_dot">...</span>
        </p>
      </div>
    </div>
  );
}
