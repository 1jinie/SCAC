import { useState } from 'react';
import { checkOut } from '../../utils/checkOut';
import { goOut } from '../../utils/goOut';
import { checkInStore } from '../../store/checkInStore';
import '../../styles/checkIn.css';

function CheckOutModal({ onClose, onConfirm, mode = 'checkout' }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const checkIns = checkInStore((state) => state.checkIns);

  const handleSubmit = () => {
    if (!phone || !password) {
      alert('정보를 입력해주세요');
      return;
    }

    const result =
      mode === 'goOut'
        ? goOut(phone, password, checkIns)
        : checkOut(phone, password);

    alert(result.message);

    if (result.success) {
      onConfirm({
        userId: result.user.id,
        checkInId: result.checkIn.id,
        seatId: result.checkIn.seatId,
      });

      onClose();
    }
  };

  return (
    <div className="overlay checkIn">
      <div className="modal checkIn">
        <button className="modal_close" onClick={onClose}>
          x
        </button>
        <h2>{mode === 'goOut' ? '외출' : '퇴실'}</h2>
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
