// import { useEffect, useState } from 'react';
// import { useTicketStore } from '../../store/ticketStore';
// import { preparePayment } from '../../api/paymentApi';
// import TossPaymentWidget from './components/TossPaymentWidget';

// export default function TossPaymentPage() {
//   const selectedTicketId = useTicketStore((state) => state.selectedTicketId);

//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//     const prepare = async () => {
//       const result = await preparePayment({
//         ticketId: selectedTicketId,
//       });

//       setOrder(result);
//     };

//     if (selectedTicketId) {
//       prepare();
//     }
//   }, [selectedTicketId]);

//   if (!selectedTicketId) {
//     return <p>선택된 이용권이 없습니다.</p>;
//   }

//   if (!order) {
//     return <p>결제를 준비하고 있습니다.</p>;
//   }

//   return (
//     <TossPaymentWidget
//       orderId={order.orderId}
//       orderName={order.orderName}
//       amount={order.amount}
//       customerKey={order.customerKey}
//     />
//   );
// }
