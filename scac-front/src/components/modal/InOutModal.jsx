import { useState } from 'react';
import '../../styles/inOutModal.css';

function InOutModal({ title, onClose, onConfirm }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!phoneNumber || !password) {
      alert('정보를 입력하세요');
      return;
    }

    onConfirm(phoneNumber, password);
  };

  return (
    <div className="overlay checkIn">
      <div className="modal checkIn">
        <button className="modal_close" onClick={onClose}>
          <img
            src="/icons/common/cancel.svg"
            alt="닫기"
            className="close_img"
          />
        </button>
        <h2>{title}</h2>
        <div className="content">
          <input
            type="text"
            placeholder="휴대폰 번호"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <input
            type="password"
            placeholder="입실 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="modal_confirm" onClick={handleSubmit}>
          확인
        </button>
      </div>
    </div>
  );
}

export default InOutModal;
