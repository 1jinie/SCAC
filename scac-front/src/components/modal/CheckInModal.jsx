import React, { useState } from 'react';
import '../../styles/modal.css';

function CheckInModal({ onClose, onConfirm }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!phone || !password) {
      alert('정보를 입력해주세요');
      return;
    }
    onConfirm({
      phone,
      password,
    });
  };

  return (
    <div className="modal_overlay">
      <div className="modal">
        <button className="modal_close" onClick={onclose}>
          x
        </button>
        <h2>입실</h2>
        <input
          type="text"
          placeholder="휴대폰 번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="password"
          placeholder="입실 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="modal_confirm" onClick={handleSubmit}>
          확인
        </button>
      </div>
    </div>
  );
}

export default CheckInModal;
