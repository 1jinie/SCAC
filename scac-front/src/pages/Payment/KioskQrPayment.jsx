import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
// import './css/KioskQrPayment.css';

const PUBLIC_ORIGIN =
  process.env.REACT_APP_PUBLIC_ORIGIN || window.location.origin;

export default function KioskQrPayment() {
  const [sessionId] = useState(() => `DEMO-${Date.now()}`);

  const mobilePayUrl =
    `${PUBLIC_ORIGIN}/payment/mobile/mock` +
    `?sessionId=${encodeURIComponent(sessionId)}`;

  return (
    <div className="overlay">
      <div className="kiosk_payment_modal">
        <div className="kiosk_qr_icon">QR</div>

        <h2>QR을 스캔해 주세요</h2>

        <p className="kiosk_payment_guide">
          휴대폰 카메라로 QR을 스캔한 후
          <br />
          결제를 진행해 주세요.
        </p>

        <div className="kiosk_qr_box">
          <QRCodeSVG value={mobilePayUrl} size={320} level="H" />
        </div>

        <p className="kiosk_payment_wait">
          결제를 기다리고 있습니다
          <span className="waiting_dot">...</span>
        </p>
      </div>
    </div>
  );
}
