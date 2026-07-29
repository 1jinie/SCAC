// import { useState } from 'react';
// import { useSearchParams } from 'react-router-dom';

// export default function MobileMockPayment() {
//   const [searchParams] = useSearchParams();

//   const paymentId = searchParams.get('paymentId');
//   const amount = Number(searchParams.get('amount'));

//   const [isPaying, setIsPaying] = useState(false);

//   return (
//     <main className="mobile_mock_payment">
//       <h1>SCAC</h1>

//       <h2>네이버페이</h2>

//       <p>키오스크 결제 요청에 연결되었습니다.</p>

//       <div className="mobile_payment_info">
//         <span>결제 금액</span>
//         <strong>{amount.toLocaleString()}원</strong>
//       </div>

//       <p>결제번호: {paymentId}</p>

//       <button
//         type="button"
//         disabled={isPaying}
//         onClick={() => setIsPaying(true)}
//       >
//         {isPaying ? '결제를 처리하고 있습니다' : 'Mock 결제 완료'}
//       </button>
//     </main>
//   );
// }
import { useSearchParams } from 'react-router-dom';

export default function MobileMockPayment() {
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get('paymentId');
  const amount = Number(searchParams.get('amount'));

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#363636',
        padding: '40px 24px',
        boxSizing: 'border-box',
      }}
    >
      <h1>SCAC</h1>

      <h2>네이버페이 Mock 결제</h2>

      <p>키오스크와 연결되었습니다.</p>

      <p>결제번호: {paymentId}</p>

      <p>
        결제금액:{' '}
        <strong>
          {Number.isNaN(amount) ? '-' : `${amount.toLocaleString()}원`}
        </strong>
      </p>

      <button
        type="button"
        style={{
          width: '100%',
          height: '64px',
          marginTop: '30px',
          fontSize: '20px',
        }}
      >
        Mock 결제 완료
      </button>
    </main>
  );
}
