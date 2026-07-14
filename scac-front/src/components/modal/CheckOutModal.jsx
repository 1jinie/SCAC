import { useState } from 'react';
import { checkOut } from '../../utils/checkOut';
import '../../styles/checkIn.css';

function CheckOutModal({ onClose, onConfirm, seatId }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    const result = checkOut(phone, password);

    if (!phone || !password) {
      alert('정보를 입력해주세요');
      return;
    }

    alert(result.message);

    if (result.success) {
      onConfirm({
        userId: result.user.id,
        checkInId: result.checkIn.id,
        seatId: result.checkIn.seatId,
      });
      onClose();
    }

    onClose();
  };

  return (
    <div className="overlay checkIn">
      <div className="modal checkIn">
        <button className="modal_close" onClick={onClose}>
          x
        </button>
        <h2>퇴실</h2>
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

export default CheckOutModal;
