import './css/KioskErrorState.css';

export default function KioskErrorState({
  title = '정보를 불러오지 못했습니다.',
  message = '잠시 후 다시 시도해 주세요.',
  onRetry,
  onHome,
}) {
  return (
    <section className="kiosk_error_state">
      <div className="kiosk_error_state_icon" aria-hidden="true">
        !
      </div>

      <h2>{title}</h2>
      <p>{message}</p>

      <div className="kiosk_error_state_actions">
        {onRetry && (
          <button
            type="button"
            className="kiosk_error_state_retry"
            onClick={onRetry}
          >
            다시 시도
          </button>
        )}

        {onHome && (
          <button
            type="button"
            className="kiosk_error_state_home"
            onClick={onHome}
          >
            홈으로 돌아가기
          </button>
        )}
      </div>
    </section>
  );
}
