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
        <div className="content choose_in_content">
          <button className="modal_confirm" onClick={onSeatCheckIn}>
            좌석 입실
          </button>

          <button className="modal_confirm" onClick={onRoomCheckIn}>
            스터디룸 입실
          </button>

          <button className="modal_confirm" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChooseInModal;
