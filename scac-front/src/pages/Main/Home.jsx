import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { seatStore } from '../../store/seatStore';
import { checkInStore } from '../../store/checkInStore';
import { useResetStore } from '../../hooks/useResetStore';
import { openDoor } from '../../api/deviceApi';
import { updatePrinterStatus } from '../../api/deviceApi';
import InOutModal from '../../components/modal/InOutModal';
import KioskAlertModal from '../../components/modal/KioskAlertModal';
import '../../styles/Home.css';

function HomePage() {
  const [alertModal, setAlertModal] = useState(null);
  const [modalType, setModalType] = useState(null);
  // -------------- 시연용 --------------
  const [printerStatus] = useState('NORMAL');
  const prepareCheckIn = checkInStore((state) => state.prepareCheckIn);
  const setPreparedInfo = checkInStore((state) => state.setPreparedInfo);
  const goOut = checkInStore((state) => state.goOut);
  const comeBack = checkInStore((state) => state.comeBack);
  const checkOut = checkInStore((state) => state.checkOut);
  const seats = seatStore((state) => state.seats);
  const fetchSeats = seatStore((state) => state.fetchSeats);
  const { resetAll } = useResetStore();
  const navigate = useNavigate();

  const availableSeats = seats.filter(
    (seat) => seat.type === 'seat' && seat.status === 'available',
  ).length;

  const totalSeats = seats.filter((seat) => seat.type === 'seat').length;

  // 입실 관리
  const handleCheckIn = async (phoneNumber, password) => {
    const result = await prepareCheckIn(phoneNumber, password);

    if (!result.success) {
      setAlertModal({
        title: '입실 실패',
        message: result.message,
        onClose: () => setAlertModal(null),
      });
      return;
    }

    setPreparedInfo(result.data.userId, result.data.usageId);

    setModalType(null);

    // 외출 상태면 좌석 선택 없이 복귀
    if (result.data.away) {
      const comebackResult = await comeBack(phoneNumber, password);

      if (!comebackResult.success) {
        setAlertModal({
          title: '복귀 실패',
          message: comebackResult.message,
          onClose: () => setAlertModal(null),
        });
        return;
      }

      try {
        await openDoor();
      } catch (error) {
        console.error('문 열기 명령 전송 실패: ', error);
      }

      setAlertModal({
        title: '입실 완료',
        message: '재입실되었습니다',
        onClose: () => setAlertModal(null),
      });
      return;
    }

    navigate('/seat');
  };

  // 외출 관리
  const handleGoOut = async (phoneNumber, password) => {
    const result = await goOut(phoneNumber, password);

    if (!result.success){
      setAlertModal({
        title: '외출 실패',
        message: result.message,
        onClose: () => setAlertModal(null),
      });
      
      return;
    }

    setModalType(null);

    setAlertModal({
      title: '외출 완료',
      message: result.message,
      onClose: () => {
        setAlertModal(null);
        navigate('/');
      }
    });
  };

  // 퇴실 관리
  const handleCheckOut = async (phoneNumber, password) => {
    const result = await checkOut(phoneNumber, password);

    if (!result.success){
      setAlertModal({
        title: '퇴실',
        message: result.message,
        onClose: () => setAlertModal(null),
      });
      return;
    }

    setModalType(null);

    fetchSeats();

    setAlertModal({
      title: '퇴실 완료',
      message: result.message,
      onClose: () => {
        setAlertModal(null);
        navigate('/');
      }
    });
  };

  // 버튼 관리
  const handleSubmit = (phoneNumber, password) => {
    switch (modalType) {
      case '입실':
        handleCheckIn(phoneNumber, password);
        break;
      case '외출':
        handleGoOut(phoneNumber, password);
        break;
      case '퇴실':
        handleCheckOut(phoneNumber, password);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    // 홈 화면 진입 시 이전 사용자의 로그인 세션, 선택 좌석, 결제/예약 데이터 완전 초기화
    resetAll();
    fetchSeats();
  }, [resetAll, fetchSeats]);

  // -------------- 시연용 --------------
  // 로고 클릭
  const handlePrinterTest = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try{
      const nextStatus = printerStatus === 'NORMAL' ? 'ERROR' : 'NORMAL';

      await updatePrinterStatus(nextStatus);
    } catch(error){
      console.error('프린터 상태 변경 실패', error);
    }
  };

  return (
    <div className="kiosk_container">
      {/* 상단 헤더 / 로고 영역 */}
      <header className="kiosk_header">
        <div 
          className="logo_box"
          onClick={handlePrinterTest}
        >
          <div className="logo_icon">
            <img src="/logo/logo.png" alt="로고 아이콘" className="logo_img" />
          </div>
        </div>
      </header>

      {/* 실시간 좌석 현황 대시보드 */}
      <div className="seat_status_bar">
        <span className="chair_icon">
          <img
            src="/icons/common/chair.svg"
            alt="의자"
            style={{ width: '32px', height: '32px' }}
          />
        </span>
        <span className="status_text">
          좌석 수 {availableSeats}/{totalSeats}
        </span>
      </div>

      {/* 메인 메뉴 그리드 영역 */}
      <main className="menu_grid">
        {/* 상단 강조 메뉴 (주황색 버튼 라인) */}
        <div className="highlight_menu_row">
          <button
            type="button"
            className="menu_btn btn_orange"
            onClick={() => setModalType('입실')}
          >
            <div className="btn_icon">
              <img
                src="/icons/common/open_door.svg"
                alt="입실"
                style={{ width: '80px', height: '45px' }}
              />
            </div>
            <span className="btn_label">입실</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_orange"
            onClick={() => setModalType('외출')}
          >
            <div className="btn_icon">
              <img
                src="/icons/common/open_door.svg"
                alt="외출"
                style={{ width: '80px', height: '45px' }}
              />
            </div>
            <span className="btn_label">외출</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_orange"
            onClick={() => setModalType('퇴실')}
          >
            <div className="btn_icon">
              <img
                src="/icons/common/close_door.svg"
                alt="퇴실"
                style={{ width: '80px', height: '45px' }}
              />
            </div>
            <span className="btn_label">퇴실</span>
          </button>
        </div>

        {/* 하단 기본 메뉴 (회색 버튼 라인) */}
        <div className="standard_menu_grid">
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('nonmember-signup')} // 비회원 회원가입 경로 설정
          >
            <div className="btn_icon">
              <img
                src="/icons/common/ticket.svg"
                alt="이용권 결제"
                style={{ width: '80px', height: '45px' }}
              />
            </div>
            <span className="btn_label">이용권 결제</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('/login')}
          >
            <div className="btn_icon">
              <img
                src="/icons/reservation/reserv.svg"
                alt="스터디룸 예약"
                style={{ width: '60px', height: '60px' }}
              />
            </div>
            <span className="btn_label">스터디룸 예약</span>
          </button>

          {/* 로그인 전용 버튼 세트 */}
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('/login')}
          >
            <div className="btn_icon">
              <img
                src="/icons/common/login.svg"
                alt="로그인"
                style={{ width: '80px', height: '65px' }}
              />
            </div>
            <span className="btn_label">로그인</span>
          </button>
          <button
            type="button"
            className="menu_btn btn_gray"
            onClick={() => navigate('/signup')}
          >
            <div className="btn_icon">
              <img
                src="/icons/common/register.svg"
                alt="회원가입"
                style={{ width: '80px', height: '65px' }}
              />
            </div>
            <span className="btn_label">회원가입</span>
          </button>
        </div>
      </main>

      {/* 하단 풋터 (관리자 안내 영역) */}
      <footer className="kiosk_footer">
        <div className="headset_icon">
          <img
            src="/icons/common/headphone.svg"
            alt="관리자 정보"
            style={{ width: '80px', height: '45px' }}
          />
        </div>
        <span className="footer_text">관리자 번호: 010-0000-0000</span>
      </footer>

      {modalType && (
        <InOutModal
          title={modalType}
          onClose={() => setModalType(null)}
          onConfirm={handleSubmit}
        />
      )}
      {alertModal && (
        <KioskAlertModal
          title={alertModal.title}
          message={alertModal.message}
          onClose={alertModal.onClose}
        />
      )}
    </div>
  );
}

export default HomePage;
