import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AdminDevicePage from '../pages/Device/AdminDevicePage';
import AdminLogDetailPage from '../pages/Log/AdminLogDetailPage';
import AdminLogPage from '../pages/Log/AdminLogPage';
import AdminLoginPage from '../pages/Login/AdminLoginPage';
import AdminMainPage from '../pages/Main/AdminMainPage';
import AdminPaymentPage from '../pages/Payment/AdminPaymentPage';
import AdminReservationPage from '../pages/Reservation/AdminReservationPage';
import AdminSeatPage from '../pages/Seat/AdminSeatPage';
import AdminTicketManagePage from '../pages/Ticket/AdminTicketManagePage';
import AdminErrorPage from '../pages/Error/AdminErrorPage';
import AdminUserPage from '../pages/User/AdminUserPage';
import AdminMemoPage from '../pages/Memo/AdminMemoPage';
import AdminPrivateRoute from './AdminPrivateRoute';

const router = createBrowserRouter([
  // ============================
  // Admin (인증 필요 라우트)
  // ============================
  {
    path: '/',
    element: (
      // 관리자 로그인이 완성되기까지 개발편의를 위해 냅두는 용도
      // <AdminLayout />
      <AdminPrivateRoute>
        <AdminLayout />
      </AdminPrivateRoute>
    ),
    errorElement: <AdminErrorPage />,
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
      {
        path: 'user',
        children: [{ index: true, element: <AdminUserPage /> }],
      },
      {
        path: 'memo',
        children: [{ index: true, element: <AdminMemoPage /> }],
      },
      {
        path: 'seat',
        children: [
          {
            index: true,
            element: <AdminSeatPage />,
          },
        ],
      },
    ],
  },

  {
    path: '/login',
    element: <AdminLoginPage />,
    errorElement: <AdminErrorPage />,
  },
  {
    path: '*',
    element: <AdminErrorPage status={404} />,
  },
]);

export default router;
