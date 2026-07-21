export default function AdminSeatStatusButtons({ selectedSeat, onSeatChange }) {
  const handleStatusChange = (status) => {
    // 추후 API 연결
    // await seatApi.updateStatus(selectedSeat.seatId, status);

    onSeatChange(status);
  };

  const handleForceCheckout = () => {
    const isConfirmed = window.confirm(
      `${selectedSeat.seatNumber}번 좌석의 사용자를 강제 퇴실 처리하시겠습니까?`,
    );

    if (!isConfirmed) return;

    // 추후 API 연결
    // await seatApi.forceCheckout(selectedSeat.seatId);

    onSeatChange('AVB', true);
  };

  return (
    <section className="admin_seat_actions">
      <h3>좌석 상태 변경</h3>

      <div className="admin_seat_status_buttons">
        <button
          type="button"
          disabled={
            selectedSeat.status === 'USR' || selectedSeat.status === 'AVB'
          }
          onClick={() => handleStatusChange('AVB')}
        >
          이용 가능
        </button>

        <button
          type="button"
          disabled={
            selectedSeat.status === 'USR' || selectedSeat.status === 'BRK'
          }
          onClick={() => handleStatusChange('BRK')}
        >
          점검 중
        </button>
      </div>

      {selectedSeat.status === 'USR' && (
        <button
          type="button"
          className="admin_force_checkout_button"
          onClick={handleForceCheckout}
        >
          강제 퇴실
        </button>
      )}
    </section>
  );
}
