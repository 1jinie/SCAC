import { useNavigate } from 'react-router-dom';

export default function CloseButton({ nextPage, text }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="btn_close"
      onClick={() => navigate(nextPage)}
      aria-label={text}
    >
      ×
    </button>
  );
}
