import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TicketPage from '../pages/Ticket/TicketPage';
import Home from '../pages/Main/Home';
import KioskLayout from '../layouts/KioskLayout';
import KioskErrorPage from '../pages/Error/KioskErrorPage';
import Seat from '../pages/Seat/Seat';
import Room from '../pages/Seat/Room';
import Reservation from '../pages/Reservation/Reservation';
import PaymentMethodPage from '../pages/Payment/PaymentMethodPage';
import PaymentProcess from '../pages/Payment/PaymentProcess';
import PaymentResult from '../pages/Payment/PaymentResult';

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
      {
        path: 'room',
        children: [
          { index: true, element: <Room /> },
          { path: 'reservation', element: <Reservation /> },
        ],
      },
      {
        path: 'ticket',
        children: [{ index: true, element: <TicketPage /> }],
      },
      {
        path: 'payment',
        children: [
          { index: true, element: <PaymentMethodPage /> },
          { path: 'process', element: <PaymentProcess /> },
          { path: 'result', element: <PaymentResult /> },
        ],
      },
    ],
  },
]);
export default router;
