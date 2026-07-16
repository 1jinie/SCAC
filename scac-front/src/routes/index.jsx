import { createBrowserRouter } from 'react-router-dom';
import KioskLayout from '../layouts/KioskLayout';
import KioskErrorPage from '../pages/Error/KioskErrorPage';
import LoginPage from '../pages/Login/Login';
import HomePage from '../pages/Main/Home';
import LoginHomePage from '../pages/Main/LoginHome';
import MyPage from '../pages/MyPage/MyPage';
import PaymentMethodPage from '../pages/Payment/PaymentMethodPage';
import PaymentProcess from '../pages/Payment/PaymentProcess';
import PaymentResult from '../pages/Payment/PaymentResult';
import Reservation from '../pages/Reservation/Reservation';
import Room from '../pages/Seat/Room';
import Seat from '../pages/Seat/Seat';
import NonmemberSignup from '../pages/Signup/NonmemberSignup';
import SignUpPage from '../pages/Signup/Signup';
import TicketPage from '../pages/Ticket/TicketPage';

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
]);
export default router;
