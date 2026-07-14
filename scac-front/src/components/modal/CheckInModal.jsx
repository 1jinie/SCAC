import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { checkIn } from '../../utils/checkIn';
import '../../styles/checkIn.css';

function CheckInModal({ onClose, onConfirm }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const result = checkIn(phone, password);
    alert(result.message);

    if (!phone || !password) {
      alert('정보를 입력해주세요');
      return;
    }

    if (result.success) {
      onConfirm({
        phone,
        password,
      });
      onClose();
      navigate('/');
    }
    onClose();
  };

  return (
    <div className="overlay checkIn">
      <div className="modal checkIn">
        <button className="modal_close" onClick={onClose}>
          x
        </button>
        <h2>입실</h2>
        <div className="content">
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
        </div>
        <button className="modal_confirm" onClick={handleSubmit}>
          확인
        </button>
      </div>
    </div>
  );
}

export default CheckInModal;
