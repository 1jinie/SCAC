import '../../styles/inOutModal.css';

function ChooseInModal({
  title = '입실 방법을 선택해주세요',
  onClose,
  onSeatCheckIn,
  onRoomCheckIn,
}) {
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
        <div className="content" style={{ gap: '30px', margin: '40px 0' }}>
          <button
            className="modal_confirm"
            onClick={onSeatCheckIn}
            style={{ marginBottom: 0 }}
          >
            좌석 입실
          </button>
          <button
            className="modal_confirm"
            onClick={onRoomCheckIn}
            style={{ marginBottom: 0 }}
          >
            스터디룸 입실
          </button>
          <button
            className="modal_confirm"
            onClick={onClose}
            style={{ marginBottom: 0 }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChooseInModal;
