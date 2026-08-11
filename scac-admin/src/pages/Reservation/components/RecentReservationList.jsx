import { useMemo, useState } from 'react';
import Pagination from '../../../components/common/Pagination';

const PAGE_SIZE = 10;

const STATUS_LABELS = {
  PENDING_PAYMENT: '결제 진행중',
  CONFIRMED: '예약 완료',
  IN_USE: '이용 중',
  COMPLETED: '이용 완료',
  USER_CANCELED: '사용자 취소',
};

export default function RecentReservationList({ reservations, onAdminCancel }) {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedReservations = useMemo(
    () =>
      [...reservations].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [reservations],
  );

  const totalPages = Math.ceil(sortedReservations.length / PAGE_SIZE);

  const currentReservations = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return sortedReservations.slice(startIndex, startIndex + PAGE_SIZE);
  }, [sortedReservations, currentPage]);

  return (
    <section className="admin_panel admin_recent_reservation_panel">
      <div className="admin_panel_header">
        <div>
          <h3>최근 사용자 예약 목록</h3>
          <p>최근 접수된 전체 스터디룸 예약입니다.</p>
        </div>

        <span className="admin_reservation_count">
          총 {reservations.length}건
        </span>
      </div>

      <div className="admin_log_table_wrap">
        <table className="admin_log_table">
          <thead>
            <tr>
              <th>예약 번호</th>
              <th>등록 일시</th>
              <th>스터디룸</th>
              <th>예약자</th>
              <th>예약 일자</th>
              <th>이용 시간</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {currentReservations.map((reservation) => (
              <tr key={reservation.reservationId}>
                <td>#{reservation.reservationId}</td>
                <td>{reservation.createdAt}</td>
                <td>{reservation.roomNumber}</td>
                <td>{reservation.phoneNumber}</td>
                <td>{reservation.reservationDate}</td>
                <td>
                  {reservation.startTime} ~ {reservation.endTime}
                </td>
                <td>
                  <span
                    className={`admin_status_badge reservation_${reservation.status.toLowerCase()}`}
                  >
                    {STATUS_LABELS[reservation.status]}
                  </span>
                </td>
                <td>
                  {reservation.status === 'RESERVED' ? (
                    <button
                      type="button"
                      className="admin_table_cancel_button"
                      onClick={() => onAdminCancel(reservation.reservationId)}
                    >
                      취소
                    </button>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}
