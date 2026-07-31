import { useId } from 'react';
import './css/KioskErrorState.css';

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

  const isModal = variant === 'modal';
  const hasStatus = status != null;

  return (
    <div
      className={`kiosk_error_state_backdrop kiosk_error_state_backdrop--${variant}`}
    >
      <section
        className={[
          'kiosk_error_state',
          `kiosk_error_state--${variant}`,
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
          className={`kiosk_error_state_status_container ${variant === 'page' ? 'page_container' : 'popup_container'}`}
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
