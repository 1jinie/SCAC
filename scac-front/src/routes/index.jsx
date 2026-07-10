import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TicketPage from '../pages/Ticket/TicketPage';
import Home from '../pages/Main/Home';
import KioskLayout from '../layouts/KioskLayout';
import KioskErrorPage from '../pages/Error/KioskErrorPage';
import Seat from '../pages/Seat/Seat';
import Reservation from '../pages/Reservation/Reservation';
import PaymentMethodPage from '../pages/Payment/PaymentMethodPage';
import PaymentProcess from '../pages/Payment/PaymentProcess';

const router = createBrowserRouter([
  {
    path: '/',
    element: <KioskLayout />,
    errorElement: <KioskErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'seat', element: <Seat /> },
      // { path: 'login', element: <Login /> },
      // { path: 'signup', element: <Signup /> },
      { path: 'studyroom_reservation', element: <Reservation /> },
      {
        path: 'ticket',
        children: [
          { index: true, element: <TicketPage /> },

          // 받은 경로가 'ticket/seat'이라면 <Payment/>에서
          // const { type } = useParams();으로 type = 'seat'을 얻을 수 있습니다
          // { path: ':type', element: <Payment /> }, 아 근데 이거 안쓸거같아서 주석처리할게요 하핫
        ],
      },
      {
        path: 'payment',
        children: [
          { index: true, element: <PaymentMethodPage /> },
          { path: 'process', element: <PaymentProcess /> },
        ],
      },
    ],
  },
]);
export default router;
