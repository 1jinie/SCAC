import { useSearchParams } from 'react-router-dom';

export default function MobileMockPayment() {
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get('sessionId');

  return (
    <main className="mobile_mock_payment">
      <h1>SCAC</h1>

      <h2>모바일 간편결제</h2>

      <p>키오스크의 QR 연결에 성공했습니다.</p>

      <p>결제번호: {sessionId}</p>

      <button type="button">Mock 결제 완료</button>
    </main>
  );
}
