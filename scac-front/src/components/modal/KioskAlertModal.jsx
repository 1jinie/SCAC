import '../../styles/kioskAlertModal.css';

export default function KioskAlertModal({ title, message, onClose }) {
  if (!message) return null;

  return (
    <div className="overlay kioskAlert">
      <div className="modal kioskAlert">
        <h2>{title}</h2>

        <p className="kiosk_alert_message">{message}</p>

        <button
          type="button"
          className="modal_confirm kiosk_alert_confirm"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
}
