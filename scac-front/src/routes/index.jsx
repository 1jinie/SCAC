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
import AdminLayout from '../layouts/AdminLayout';
import AdminMainPage from '../pages/Admin/Main/AdminMainPage';
import AdminLoginPage from '../pages/Admin/Login/AdminLoginPage';
import AdminLogPage from '../pages/Admin/Log/AdminLogPage';
import AdminLogDetailPage from '../pages/Admin/Log/AdminLogDetailPage';
import AdminReservationPage from '../pages/Admin/Reservation/AdminReservationPage';
import AdminDevicePage from '../pages/Admin/Device/AdminDevicePage';
import AdminTicketManagePage from '../pages/Admin/Ticket/AdminTicketManagePage';
import AdminPaymentPage from '../pages/Admin/Payment/AdminPaymentPage';

const router = createBrowserRouter([
  // ============================
  // User(Kiosk)
  // ============================
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

  // ============================
  // Admin
  // ============================
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminMainPage /> },

      {
        path: 'log',
        children: [
          { index: true, element: <AdminLogPage /> },
          { path: ':logId', element: <AdminLogDetailPage /> },
        ],
      },

      {
        path: 'ticket',
        children: [{ index: true, element: <AdminTicketManagePage /> }],
      },

      {
        path: 'payment',
        children: [{ index: true, element: <AdminPaymentPage /> }],
      },

      {
        path: 'reservation',
        children: [{ index: true, element: <AdminReservationPage /> }],
      },

      {
        path: 'device',
        children: [{ index: true, element: <AdminDevicePage /> }],
      },
    ],
  },

  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
]);
export default router;
