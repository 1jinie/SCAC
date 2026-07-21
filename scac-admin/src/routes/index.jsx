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
// import AdminPrivateRoute from './AdminPrivateRoute';

const router = createBrowserRouter([
  // ============================
  // Admin
  // ============================
  {
    path: '/',
    element: <AdminLayout />,
    errorElement: <AdminErrorPage />,
    //   element: (
    //   <AdminPrivateRoute>
    //     <AdminLayout />
    //   </AdminPrivateRoute>
    // ), 나중에 이걸로 바꿀 예정. JWT 토큰이 없으면 로그인 화면으로 강제이동하게 합니다
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
