export default function CloseButton({ onClose, text }) {
  return (
    <button
      type="button"
      className="btn_close"
      onClick={() => onClose()}
      aria-label={text}
    >
      ×
    </button>
  );
}
