import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/Main/Home';
import LoginPage from '../pages/Login/Login';
import SignUpPage from '../pages/Signup/Signup';
import LoginHomePage from '../pages/Main/LoginHome';
import MyPage from '../pages/MyPage/MyPage';
import TicketPage from '../pages/Ticket/TicketPage';
import KioskLayout from '../layouts/KioskLayout';
import KioskErrorPage from '../pages/Error/KioskErrorPage';
import Seat from '../pages/Seat/Seat';
import Room from '../pages/Seat/Room';
import Reservation from '../pages/Reservation/Reservation';
import PaymentMethodPage from '../pages/Payment/PaymentMethodPage';
import PaymentProcess from '../pages/Payment/PaymentProcess';
import PaymentResult from '../pages/Payment/PaymentResult';
import NonmemberSignup from '../pages/Signup/NonmemberSignup';

const router = createBrowserRouter([
  {
    path: '/',
    element: <KioskLayout />,
    errorElement: <KioskErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'seat', element: <Seat /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'loginhome', element: <LoginHomePage /> },
      { path: 'mypage', element: <MyPage /> },
      { path: 'nonmember-signup', element: <NonmemberSignup /> },
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

          { path: 'result/:status', element: <PaymentResult /> },
        ],
      },
    ],
  },
]);
export default router;
