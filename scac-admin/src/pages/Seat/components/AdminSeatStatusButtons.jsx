import { adminSeatApi } from "../../../api/seatApi";

export default function AdminSeatStatusButtons({ selectedSeat, onSeatChange }) {
  const handleStatusChange = async (status) => {
    try {
      await adminSeatApi.updateSeatStatus(selectedSeat.seatId, status);

      onSeatChange(status);

      alert("좌석 상태가 변경되었습니다");
    } catch (error) {
      console.error("좌석 상태 변경 실패", error);
      alert("좌석 상태 변경에 실패했습니다");
    }
  };

  const handleForceCheckout = async () => {
    const isConfirmed = window.confirm(
      `${selectedSeat.seatNumber} 좌석의 사용자를 강제 퇴실 처리하시겠습니까?`,
    );

    if (!isConfirmed) return;

    try {
      await adminSeatApi.forceCheckout(selectedSeat.seatId);

      alert("강제 퇴실 되었습니다");

      onSeatChange("AVB", true);
    } catch (error) {
      console.error("강제 퇴실 실패", error);
      alert("강제 퇴실 처리에 실패했습니다");
    }
  };

  return (
    <section className="admin_seat_actions">
      <h3>좌석 상태 변경</h3>

      <div className="admin_seat_status_buttons">
        <button
          type="button"
          disabled={
            selectedSeat.status === "USR" || selectedSeat.status === "AVB"
          }
          onClick={() => handleStatusChange("AVB")}
        >
          이용 가능
        </button>

        <button
          type="button"
          disabled={
            selectedSeat.status === "USR" || selectedSeat.status === "BRK"
          }
          onClick={() => handleStatusChange("BRK")}
        >
          점검 중
        </button>
      </div>

      {selectedSeat.status === "USR" && (
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
