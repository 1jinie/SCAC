import './css/LoadingOverlay.css';
/*
  사용하실땐 꼭 부모 css에 

  .클래스명아이디명 {
  position: relative;
  min-height: 400px;
  }

  추가해주세요
*/
export default function LoadingOverlay({
  isLoading,
  message = '데이터를 불러오는 중입니다.',
}) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="loading_overlay" role="status" aria-live="polite">
      <div className="loading_overlay_content">
        <div className="loading_spinner" />
        <span>{message}</span>
      </div>
    </div>
  );
}
