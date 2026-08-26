import { createBrowserRouter } from 'react-router-dom';
import KioskLayout from '../layouts/KioskLayout';
import KioskErrorPage from '../pages/Error/KioskErrorPage';
import LoginPage from '../pages/Login/Login';
import HomePage from '../pages/Main/Home';
import LoginHomePage from '../pages/Main/LoginHome';
import MyPage from '../pages/MyPage/MyPage';
import KioskCardPayment from '../pages/Payment/KioskCardPayment';
import PaymentMethodPage from '../pages/Payment/PaymentMethodPage';
import PaymentProcess from '../pages/Payment/PaymentProcess';
import PaymentResult from '../pages/Payment/PaymentResult';
import TossPaymentResultPage from '../pages/Payment/TossPaymentResultPage';
import Reservation from '../pages/Reservation/Reservation';
import Room from '../pages/Seat/Room';
import Seat from '../pages/Seat/Seat';
import NonmemberSignup from '../pages/Signup/NonmemberSignup';
import SignUpPage from '../pages/Signup/Signup';
import TicketPage from '../pages/Ticket/TicketPage';
import UserPrivateRoute from './UserPrivateRoute';
// import DevErrorPage from '../pages/Error/DevErrorPage';

const router = createBrowserRouter([
  // ============================
  // User(Kiosk)
  // ============================
  {
    path: '/',
    element: <KioskLayout />,
    errorElement: <KioskErrorPage />,
    // 개발용 에러 페이지가 필요하다면 KioskErrorPage를 주석처리하고
    // 아래 DevErrorPage와 import DevErrorPage를 활성화해 주세요
    // errorElement: <DevErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'seat', element: <Seat /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignUpPage /> },
      {
        path: 'loginhome',
        element: (
          <UserPrivateRoute>
            <LoginHomePage />
          </UserPrivateRoute>
        ),
      },
      {
        path: 'mypage',
        element: (
          <UserPrivateRoute>
            <MyPage />
          </UserPrivateRoute>
        ),
      },
      { path: 'nonmember-signup', element: <NonmemberSignup /> },
      {
        path: 'room',
        children: [
          { index: true, element: <Room /> },
          { path: 'reservation/:roomId', element: <Reservation /> },
        ],
      },
      {
        path: 'ticket',
        children: [{ index: true, element: <TicketPage /> }],
      },
      {
        path: 'payment',
        children: [
          {
            index: true,
            element: <PaymentMethodPage />,
          },
          {
            path: 'process',
            element: <PaymentProcess />,
          },
          {
            path: 'kiosk/card',
            element: <KioskCardPayment />,
          },

          {
            path: 'toss/success',
            element: <TossPaymentResultPage />,
          },
          {
            path: 'toss/fail',
            element: <TossPaymentResultPage />,
          },
          {
            path: 'result/:status',
            element: <PaymentResult />,
          },
        ],
      },
    ],
  },
  //라우터 에러페이지
  {
    path: '*',
    element: <KioskErrorPage status={404} />,
  },
]);
export default router;
