import { useId } from 'react';
import './css/KioskErrorState.css';

/**
 * 키오스크 공통 오류 화면 컴포넌트
 *
 * 사용 방법
 * - variant="page": 페이지 전체를 대체하는 오류 화면
 * - variant="modal": 현재 화면 위에 표시하는 오류 팝업
 * - status: HTTP 상태 코드 등 오류 코드 표시
 * - onRetry, onHome, onClose: 전달된 함수에 해당하는 버튼만 표시
 * - 버튼 문구는 retryLabel, homeLabel, closeLabel로 변경 가능
 *
 * 예시
 * <KioskErrorState
 *   variant="page"
 *   status={500}
 *   title="정보를 불러오지 못했습니다."
 *   message="잠시 후 다시 시도해 주세요."
 *   onRetry={fetchData} // 해당버튼을 누르면 fetchData 함수를 다시 실행합니다
 *   onHome={() => navigate('/', { replace: true })} // replace:true는 뒤로가기가 안되게 하는 설정입니다 필요없으면 그냥 빼면돼요
 * />
 */
/*
 * KioskErrorPage
 * → 잘못된 주소, 렌더링 오류 등 라우터 전체 오류
 *
 * KioskErrorState
 * → API 조회 실패, 로그인 정보 없음 등 페이지 내부 오류 UI
 */
export default function KioskErrorState({
  status,
  title = '오류가 발생했습니다.',
  message,
  timerText,
  onRetry,
  onHome,
  onClose,
  retryLabel = '다시 시도',
  homeLabel = '홈으로 돌아가기',
  closeLabel = '확인',
  variant = 'page',
}) {
  const titleId = useId();
  const messageId = useId();
  const normalizedVariant = variant === 'modal' ? 'modal' : 'page';
  const isModal = normalizedVariant === 'modal';
  const hasStatus = status != null;

  return (
    <div
      className={`kiosk_error_state_backdrop kiosk_error_state_backdrop--${normalizedVariant}`}
    >
      <section
        className={[
          'kiosk_error_state',
          `kiosk_error_state--${normalizedVariant}`,
          hasStatus ? 'kiosk_error_state--with_status' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        role={isModal ? 'dialog' : 'alert'}
        aria-modal={isModal ? 'true' : undefined}
        aria-labelledby={titleId}
        aria-describedby={message ? messageId : undefined}
      >
        <img
          src="/icons/common/caution.svg"
          alt=""
          className="kiosk_error_state_icon"
          aria-hidden="true"
        />
        <div
          className={`kiosk_error_state_status_container ${normalizedVariant === 'page' ? 'page_container' : 'popup_container'}`}
        >
          {hasStatus ? (
            <div className="kiosk_error_state_status_box">
              <span className="kiosk_error_state_status_label">status</span>

              <strong className="kiosk_error_state_status_code">
                [{status} Error!]
              </strong>

              <h2 id={titleId}>{title}</h2>

              {message && <p id={messageId}>{message}</p>}
            </div>
          ) : (
            <div className="kiosk_error_state_message_box">
              <h2 id={titleId}>{title}</h2>

              {message && <p id={messageId}>{message}</p>}
            </div>
          )}

          <div className="kiosk_error_state_footer">
            {timerText && (
              <p className="kiosk_error_state_timer">{timerText}</p>
            )}

            <div className="kiosk_error_state_actions">
              {onRetry && (
                <button
                  type="button"
                  className="kiosk_error_state_retry"
                  onClick={onRetry}
                >
                  {retryLabel}
                </button>
              )}

              {onHome && (
                <button
                  type="button"
                  className="kiosk_error_state_home"
                  onClick={onHome}
                >
                  {homeLabel}
                </button>
              )}

              {onClose && (
                <button
                  type="button"
                  className="kiosk_error_state_close"
                  onClick={onClose}
                >
                  {closeLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
