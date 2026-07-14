import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIn } from '../../utils/checkIn';
import { addCheckIn } from '../../utils/addCheckIn';
import '../../styles/checkIn.css';
import { checkIns } from '../../data/CheckIn';

function CheckInModal({ onClose, onConfirm, seatId }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const result = checkIn(phone, password, seatId);
    alert(result.message);

    if (!phone || !password) {
      alert('정보를 입력해주세요');
      return;
    }

    if (result.success) {
      addCheckIn({
        id: checkIns.length + 1,
        userId: result.user.id,
        seatId,
        checkInTime: new Date(),
        checkOutTime: null,
      });
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
