import { useNavigate } from 'react-router-dom';
import { useResetStore } from '../../hooks/useResetStore';

// 사용할 페이지에선
// <CancelButton nextPage={'넘어갈 페이지'} text={'버튼이름'}>
// 로 사용하시면 됩니다
// ex. <CancelButton nextPage={`/ticket`} text={'결제 취소'}/> => 결제정보 초기화 후 <Ticket/>로 이동

// 경로 설정 예시
// 'ticket' : 현재 위치에서 이동합니다 ex. /payment에서 버튼 누를 시 경로 /payment/ticket
// '/ticket' : 라우터에 연결된 <Ticket/>으로 이동합니다 ex. /payment에서 버튼 누를 시 경로 /ticket

export default function CancelButton({ text, nextPage }) {
  const navi = useNavigate();
  const resetAll = useResetStore();

  const handleClear = () => {
    // 결제정보 초기화
    resetAll();
    navi(nextPage);
  };

  return (
    <button className="btn_cancel" onClick={() => handleClear()}>
      {text}
    </button>
  );
}
