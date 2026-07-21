import { useEffect, useMemo, useState } from 'react';
import Pagination from '../../../components/common/Pagination';

export default function AdminSeatLogList({ logs, selectedSeat }) {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(logs.length / PAGE_SIZE);
  const currentLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return logs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [logs, currentPage]);
  const ACTION_LABEL = {
    CHECK_IN: '입실',
    CHECK_OUT: '퇴실',
    AUTO_CHECKOUT: '자동퇴실',
    FORCE_CHECKOUT: '강제퇴실',
    STATUS_CHANGE: '상태변경',
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [logs, selectedSeat]);

  return (
    <section className="admin_panel admin_recent_log_panel">
      <div className="admin_panel_header">
        <div>
          <h3>좌석 이용 로그</h3>

          <p>
            {selectedSeat
              ? `${selectedSeat}번 좌석 이용 내역`
              : '전체 좌석 이용 내역'}
          </p>
        </div>
      </div>

      {logs ? (
        <div className="admin_log_table_wrap">
          <table className="admin_log_table">
            <thead>
              <tr>
                <th>시간</th>
                <th>상태</th>
                <th>설명</th>
                <th>전화번호</th>
              </tr>
            </thead>

            <tbody>
              {currentLogs.map((log) => (
                <tr key={log.log_id}>
                  <td>{log.created_at}</td>

                  <td>
                    <span className={`admin_log_type ${log.action}`}>
                      {ACTION_LABEL[log.action]}
                    </span>
                  </td>

                  <td>{log.description}</td>

                  <td>{log.phone_number || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin_seat_log_empty">해당 좌석의 로그가 없습니다.</div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageGroupSize={5}
      />
    </section>
  );
}
